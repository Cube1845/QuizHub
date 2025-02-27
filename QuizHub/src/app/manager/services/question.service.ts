import { inject, Injectable } from '@angular/core';
import { Question } from '../models/question';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ToastService } from '../../common/services/toast.service';
import { HttpClient } from '@angular/common/http';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { PaginatedData } from '../../common/models/paginatedData';
import { UnidentifiedQuestionWithNoImage } from '../models/unidentifiedQuestionWithNoImage';
import { GetQuestionDTO } from '../models/getQuestionDto';
import { Answer } from '../models/answer';
import { DisplayableImage } from '../../common/models/displayableImage';
import { QuestionUpdateDTO } from '../models/questionUpdateDTO';
import { ImageService } from '../../common/services/image.service';

type GetPaginatedQuestionsResponse = {
  data: PaginatedData<GetQuestionDTO>;
  questionBaseName: string;
};

type GetPaginatedQuestionsMappedResponse = {
  data: PaginatedData<Question>;
  questionBaseName: string;
};

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly imageService = inject(ImageService);

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getQuestionsFromUserQuestionBase(
    questionBaseId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<GetPaginatedQuestionsMappedResponse | null> {
    return this.http
      .get<Result<GetPaginatedQuestionsResponse>>(
        this.apiUrl +
          '/question' +
          '?questionBaseId=' +
          questionBaseId +
          '&pageNumber=' +
          pageNumber.toString() +
          '&pageSize=' +
          pageSize.toString()
      )
      .pipe(this.handleGetPaginatedResultPatternResponse());
  }

  addQuestion(
    question: UnidentifiedQuestionWithNoImage,
    questionBaseId: string,
    contentImage: File | null,
    answerImages: (File | null)[]
  ): Observable<boolean> {
    const formData = new FormData();

    formData.append('questionBaseId', questionBaseId);
    formData.append('question', JSON.stringify(question));

    if (contentImage != null) {
      formData.append('contentImage', contentImage);
    }

    answerImages.forEach((file, index) => {
      if (file != null) {
        formData.append(`answerImage${index + 1}`, file);
        return;
      }

      formData.append(`answerImage${index + 1}`, null!);
    });

    return this.http.post<Result>(this.apiUrl + '/question', formData).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  editQuestion(
    question: QuestionUpdateDTO,
    questionBaseId: string,
    contentImage: File | null,
    answerImages: (File | null)[]
  ): Observable<boolean> {
    const formData = new FormData();

    formData.append('questionBaseId', questionBaseId);

    formData.append('question', JSON.stringify(question));

    if (contentImage != null) {
      formData.append('contentImage', contentImage);
    }

    answerImages.forEach((file, index) => {
      if (file != null) {
        formData.append(`answerImage${index + 1}`, file);
        return;
      }

      formData.append(`answerImage${index + 1}`, null!);
    });

    return this.http.put<Result>(this.apiUrl + '/question', formData).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  removeQuestion(
    questionBaseId: string,
    questionId: string
  ): Observable<boolean> {
    return this.http
      .delete<Result>(
        this.apiUrl +
          '/question' +
          '?questionBaseId=' +
          questionBaseId +
          '&questionId=' +
          questionId
      )
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  searchForQuestions(
    questionBaseId: string,
    key: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedData<Question> | null> {
    return this.http
      .get<Result<PaginatedData<GetQuestionDTO>>>(
        this.apiUrl +
          '/question/search' +
          '?questionBaseId=' +
          questionBaseId +
          '&key=' +
          key +
          '&pageNumber=' +
          pageNumber.toString() +
          '&pageSize=' +
          pageSize.toString()
      )
      .pipe(this.handleGetFoundPaginatedResultPatternResponse());
  }

  private handleGetFoundPaginatedResultPatternResponse() {
    return (
      source: Observable<Result<PaginatedData<GetQuestionDTO>>>
    ): Observable<PaginatedData<Question> | null> =>
      source.pipe(
        switchMap((result: Result<PaginatedData<GetQuestionDTO>>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return of(null!);
          }

          const dtoPaginatedData = result.value;

          return this.mapGetQuestionDtoListToQuestionList(
            dtoPaginatedData.data
          ).pipe(
            map((questions: Question[]) => ({
              data: questions,
              totalItems: dtoPaginatedData.totalItems,
            }))
          );
        })
      );
  }

  private handleGetPaginatedResultPatternResponse() {
    return (
      source: Observable<Result<GetPaginatedQuestionsResponse>>
    ): Observable<GetPaginatedQuestionsMappedResponse | null> =>
      source.pipe(
        switchMap((result: Result<GetPaginatedQuestionsResponse>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return of(null);
          }

          const dtoPaginatedData = result.value.data;

          if (dtoPaginatedData.data.length == 0) {
            const emptyData: GetPaginatedQuestionsMappedResponse = {
              data: {
                data: [],
                totalItems: dtoPaginatedData.totalItems,
              },
              questionBaseName: result.value.questionBaseName,
            };

            return of(emptyData);
          }

          return this.mapGetQuestionDtoListToQuestionList(
            dtoPaginatedData.data
          ).pipe(
            map((questions: Question[]) => ({
              data: {
                data: questions,
                totalItems: dtoPaginatedData.totalItems,
              },
              questionBaseName: result.value.questionBaseName,
            }))
          );
        })
      );
  }

  private mapGetQuestionDtoListToQuestionList(
    questionDtoList: GetQuestionDTO[]
  ): Observable<Question[]> {
    const mappedQuestions$ = questionDtoList.map((dto) => {
      const questionImage$ = dto.imageId
        ? this.imageService.getImageFromApi(dto.imageId)
        : of(null);

      const answers$ = this.buildAnswersForQuestionDtoList(dto);

      return forkJoin([questionImage$, forkJoin(answers$)]).pipe(
        map(([questionImage, answers]) => ({
          id: dto.id,
          content: dto.content,
          questionType: dto.questionType,
          image: questionImage,
          answers,
        }))
      );
    });

    return forkJoin(mappedQuestions$);
  }

  private buildAnswersForQuestionDtoList(dto: GetQuestionDTO) {
    return dto.answers.map((answerDto) => {
      const answerImage$ = answerDto.imageId
        ? this.imageService.getImageFromApi(answerDto.imageId)
        : of(null);

      return answerImage$.pipe(
        map((answerImage) => ({
          id: answerDto.id,
          content: answerDto.content,
          isCorrect: answerDto.isCorrect,
          image: answerImage,
        }))
      );
    });
  }
}

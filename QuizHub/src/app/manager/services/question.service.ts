import { inject, Injectable } from '@angular/core';
import { Question } from '../models/question';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ToastService } from '../../common/services/toast.service';
import { HttpClient } from '@angular/common/http';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { PaginatedData } from '../../common/models/paginatedData';
import { UnidentifiedQuestionWithNoImage } from '../models/unidentifiedQuestionWithNoImage';
import { ImageService } from './image.service';
import { GetQuestionDTO } from '../models/getQuestionDto';
import { Answer } from '../models/answer';
import { DisplayableImage } from '../models/displayableImage';
import { QuestionUpdateDTO } from '../models/questionUpdateDTO';

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
  ): Observable<GetPaginatedQuestionsMappedResponse> {
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

  searchForQuestions(questionBaseId: string, key: string): void {}

  private handleGetPaginatedResultPatternResponse() {
    return (
      source: Observable<Result<GetPaginatedQuestionsResponse>>
    ): Observable<GetPaginatedQuestionsMappedResponse> =>
      source.pipe(
        switchMap(async (result: Result<GetPaginatedQuestionsResponse>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return null!;
          }

          const dtoPaginatedData = result.value.data;

          const questions: Question[] =
            await this.mapGetQuestionDtoListToQuestionList(
              dtoPaginatedData.data
            );

          const response: GetPaginatedQuestionsMappedResponse = {
            data: {
              data: questions,
              totalItems: dtoPaginatedData.totalItems,
            },
            questionBaseName: result.value.questionBaseName,
          };

          return response;
        })
      );
  }

  private async mapGetQuestionDtoListToQuestionList(
    questionDtoList: GetQuestionDTO[]
  ): Promise<Question[]> {
    const mappedQuestions: Question[] = await Promise.all(
      questionDtoList.map(async (dto) => {
        const questionImage = dto.imageId
          ? await this.getImageFromApi(dto.imageId)
          : null;

        const answers: Answer[] = await Promise.all(
          dto.answers.map(async (answerDto) => {
            const answerImage = answerDto.imageId
              ? await this.getImageFromApi(answerDto.imageId)
              : null;

            return {
              id: answerDto.id,
              content: answerDto.content,
              isCorrect: answerDto.isCorrect,
              image: answerImage,
            };
          })
        );

        return {
          id: dto.id,
          content: dto.content,
          questionType: dto.questionType,
          image: questionImage,
          answers,
        };
      })
    );

    return mappedQuestions;
  }

  private async getImageFromApi(
    imageId: string
  ): Promise<DisplayableImage | null> {
    return this.http
      .get(`${this.apiUrl}/image/${imageId}`, {
        responseType: 'blob',
      })
      .toPromise()
      .then((blob) => {
        if (blob) {
          const displayableImage: DisplayableImage | null = new File(
            [blob],
            'Obraz',
            {
              type: blob.type,
            }
          );

          displayableImage.displayUrl =
            this.imageService.getImageUrl(displayableImage);

          return displayableImage;
        } else {
          return null;
        }
      });
  }
}

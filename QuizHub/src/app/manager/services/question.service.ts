import { inject, Injectable } from '@angular/core';
import { UnidentifiedQuestion } from '../models/unidentifiedQuestion';
import { Question } from '../models/question';
import { from, map, Observable, of, switchMap } from 'rxjs';
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
  ): Observable<PaginatedData<Question>> {
    return this.http
      .get<Result<PaginatedData<GetQuestionDTO>>>(
        this.apiUrl +
          '/question' +
          '?questionBaseId=' +
          questionBaseId +
          '&pageNumber=' +
          pageNumber.toString() +
          '&pageSize=' +
          pageSize.toString()
      )
      .pipe(
        switchMap((result) => {
          if (result.isSuccess) {
            return from(
              Promise.all(
                result.value.data.map((dto) =>
                  this.imageService.convertGetQuestionDtoToRegularQuestion(dto)
                )
              )
            ).pipe(
              map((convertedData) => ({
                totalItems: result.value.totalItems,
                data: convertedData,
              }))
            );
          } else {
            this.displayErrorToast(result.message!);
            return of({ totalItems: 0, data: [] });
          }
        })
      );
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
        formData.append(`answerImages[${index}]`, file);
        return;
      }

      formData.append(`answerImages[${index}]`, null!);
    });

    return this.http.post<Result>(this.apiUrl + '/question', formData).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  editQuestion(question: Question, id: string): void {}

  removeQuestion(id: string): void {}

  searchForQuestions(questionBaseId: string, key: string): void {}
}

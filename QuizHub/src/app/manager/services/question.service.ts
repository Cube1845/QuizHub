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
      .pipe(this.handlePaginatedResultPatternResponse());
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

  private handlePaginatedResultPatternResponse() {
    return (
      source: Observable<Result<PaginatedData<GetQuestionDTO>>>
    ): Observable<PaginatedData<Question>> =>
      source.pipe(
        switchMap(async (result: Result<PaginatedData<GetQuestionDTO>>) => {
          if (!result.isSuccess) {
            throw new Error(result.message || 'Failed to process questions');
          }

          const dtoPaginatedData = result.value;

          const questions: Question[] = await Promise.all(
            dtoPaginatedData.data.map(async (dto) => {
              const questionImage = dto.imageId
                ? await this.http
                    .get(`${this.apiUrl}/image/${dto.imageId}`, {
                      responseType: 'blob',
                    })
                    .toPromise()
                    .then((blob) => {
                      if (blob) {
                        const displayableImage: DisplayableImage | null =
                          new File([blob], 'image', {
                            type: blob.type,
                          });

                        displayableImage.displayUrl =
                          this.imageService.getImageUrl(displayableImage);

                        return displayableImage;
                      } else {
                        return null;
                      }
                    })
                : null;

              const answers: Answer[] = await Promise.all(
                dto.answers.map(async (answerDto) => {
                  const answerImage = answerDto.imageId
                    ? await this.http
                        .get(`${this.apiUrl}/image/${answerDto.imageId}`, {
                          responseType: 'blob',
                        })
                        .toPromise()
                        .then((blob) => {
                          if (blob) {
                            const displayableImage: DisplayableImage | null =
                              new File([blob], 'image', {
                                type: blob.type,
                              });

                            displayableImage.displayUrl =
                              this.imageService.getImageUrl(displayableImage);

                            return displayableImage;
                          } else {
                            return null;
                          }
                        })
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

          return {
            data: questions,
            totalItems: dtoPaginatedData.totalItems,
          };
        })
      );
  }
}

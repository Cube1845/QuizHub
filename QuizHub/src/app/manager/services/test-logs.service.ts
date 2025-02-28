import { inject, Injectable } from '@angular/core';
import { TestLog, TestLogData } from '../models/testLog';
import {
  SelectedAnswer,
  SelectedAnswersData,
  UsedQuestion,
} from '../models/selectedAnswersData';
import { QuestionType } from '../../common/enums/questionType';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ToastService } from '../../common/services/toast.service';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { PaginatedData } from '../../common/models/paginatedData';
import { ImageService } from '../../common/services/image.service';

type SelectedAnswerWithImageId = Omit<SelectedAnswer, 'image'> & {
  imageId: string | null;
};

type UsedQuestionWithImageId = Omit<Omit<UsedQuestion, 'image'>, 'answers'> & {
  imageId: string | null;
  answers: SelectedAnswerWithImageId[];
};

type GetSelectedAnswersDataResponse = Omit<
  SelectedAnswersData,
  'usedQuestions'
> & {
  usedQuestions: (UsedQuestionWithImageId | null)[];
};

@Injectable({
  providedIn: 'root',
})
export class TestLogsService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly imageService = inject(ImageService);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  clearTestLogs(testId: string): Observable<boolean> {
    return this.http
      .delete<Result>(this.apiUrl + '/test-logs/all/' + testId)
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  deleteTestLog(testId: string, testLogId: string): Observable<boolean> {
    return this.http
      .delete<Result>(
        this.apiUrl +
          '/test-logs' +
          `?testId=${testId}` +
          `&testLogId=${testLogId}`
      )
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  getSelectedAnswersData(
    testLogId: string
  ): Observable<SelectedAnswersData | null> {
    return this.http
      .get<Result<GetSelectedAnswersDataResponse>>(
        this.apiUrl + '/selected-answers/' + testLogId
      )
      .pipe(this.handleSelectedAnswersResultPatternResponse());
  }

  getTestLogData(
    testId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<TestLogData> {
    return this.http
      .get<Result<TestLogData>>(
        this.apiUrl +
          '/test-logs' +
          `?testId=${testId}` +
          `&pageNumber=${pageNumber}` +
          `&pageSize=${pageSize}`
      )
      .pipe(
        handleResultPatternResponse<TestLogData, TestLogData>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  searchForTestLogs(
    testId: string,
    key: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedData<TestLog>> {
    return this.http
      .get<Result<PaginatedData<TestLog>>>(
        this.apiUrl +
          '/test-logs/search' +
          `?testId=${testId}` +
          `&key=${key}` +
          `&pageNumber=${pageNumber}` +
          `&pageSize=${pageSize}`
      )
      .pipe(
        handleResultPatternResponse<
          PaginatedData<TestLog>,
          PaginatedData<TestLog>
        >(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  private handleSelectedAnswersResultPatternResponse() {
    return (
      source: Observable<Result<GetSelectedAnswersDataResponse>>
    ): Observable<SelectedAnswersData | null> =>
      source.pipe(
        switchMap((result: Result<GetSelectedAnswersDataResponse>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return of(null);
          }

          const data = result.value;

          return this.mapGetSelectedAnswersResponseToData(
            data.usedQuestions
          ).pipe(
            map((questions: (UsedQuestion | null)[]) => ({
              usedQuestions: questions,
              testId: data.testId,
              solveDate: data.solveDate,
              durationInSeconds: data.durationInSeconds,
              username: data.username,
              earnedPoints: data.earnedPoints,
              maxPoints: data.maxPoints,
            }))
          );
        })
      );
  }

  private mapGetSelectedAnswersResponseToData(
    usedQuestionList: (UsedQuestionWithImageId | null)[]
  ): Observable<(UsedQuestion | null)[]> {
    const mappedQuestions$ = usedQuestionList.map((uq) => {
      if (uq == null) {
        return of(null);
      }

      const questionImage$ = uq.imageId
        ? this.imageService.getImageFromApi(uq.imageId)
        : of(null);

      const answers$ = this.buildAnswersForUsedQuestions(uq);

      return forkJoin([questionImage$, forkJoin(answers$)]).pipe(
        map(([questionImage, answers]) => ({
          content: uq.content,
          questionType: uq.questionType,
          image: questionImage,
          isScored: uq.isScored,
          answers,
        }))
      );
    });

    return forkJoin(mappedQuestions$);
  }

  private buildAnswersForUsedQuestions(uq: UsedQuestionWithImageId) {
    return uq.answers.map((answer) => {
      const answerImage$ = answer.imageId
        ? this.imageService.getImageFromApi(answer.imageId)
        : of(null);

      return answerImage$.pipe(
        map((answerImage) => ({
          content: answer.content,
          isCorrect: answer.isCorrect,
          image: answerImage,
          isSelected: answer.isSelected,
        }))
      );
    });
  }
}

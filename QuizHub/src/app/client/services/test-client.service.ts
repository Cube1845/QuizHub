import { inject, Injectable } from '@angular/core';
import { QuestionOutDto } from '../models/questionOutDto';
import { Router } from '@angular/router';
import { TestResult } from '../models/testResult';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AnswerOutDto } from '../models/answerOutDto';
import { ImageService } from '../../common/services/image.service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { ToastService } from '../../common/services/toast.service';
import { QuestionInDto } from '../models/questionInDto';
import { SKIP_AUTH } from '../../auth/models/httpContextTokens';

type QuestionOutDtoWithImageId = Omit<
  Omit<QuestionOutDto, 'image'>,
  'answers'
> & {
  imageId: string | null;
  answers: AnswerOutDtoWithImageId[];
};

type AnswerOutDtoWithImageId = Omit<AnswerOutDto, 'image'> & {
  imageId: string | null;
};

type BeginTestResponse = {
  testSolvingId: string;
};

type FinishTestResponse = {
  testLogId: string;
};

@Injectable({
  providedIn: 'root',
})
export class TestClientService {
  private readonly http = inject(HttpClient);
  private readonly imageService = inject(ImageService);
  private readonly toastService = inject(ToastService);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  beginTest(code: string, username: string): Observable<string> {
    const body = {
      code: code,
      username: username,
    };

    return this.http
      .post<Result<BeginTestResponse>>(this.apiUrl + '/client/test', body, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(
        handleResultPatternResponse<BeginTestResponse, string>(
          (value) => value.testSolvingId,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  finishTest(
    questions: QuestionInDto[],
    testSolvingId: string
  ): Observable<string> {
    const body = {
      userQuestions: questions,
      testSolvingId: testSolvingId,
    };

    return this.http
      .post<Result<FinishTestResponse>>(this.apiUrl + '/client/finish', body, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(
        handleResultPatternResponse<FinishTestResponse, string>(
          (value) => value.testLogId,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  getTestResult(testLogId: string): Observable<TestResult> {
    return this.http
      .get<Result<TestResult>>(this.apiUrl + '/client/finish/' + testLogId, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(
        handleResultPatternResponse<TestResult, TestResult>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  getTestQuestions(testSolvingId: string): Observable<QuestionOutDto[] | null> {
    return this.http
      .get<Result<QuestionOutDtoWithImageId[]>>(
        this.apiUrl + '/client/test/' + testSolvingId,
        {
          context: new HttpContext().set(SKIP_AUTH, true),
        }
      )
      .pipe(this.handleQuestionOutDtoResultPatternResponse());
  }

  private handleQuestionOutDtoResultPatternResponse() {
    return (
      source: Observable<Result<QuestionOutDtoWithImageId[]>>
    ): Observable<QuestionOutDto[] | null> =>
      source.pipe(
        switchMap((result: Result<QuestionOutDtoWithImageId[]>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return of(null);
          }

          return this.mapQuestionOutDto(result.value);
        })
      );
  }

  private mapQuestionOutDto(
    questionDtoList: QuestionOutDtoWithImageId[]
  ): Observable<QuestionOutDto[]> {
    const mappedQuestions$ = questionDtoList.map((dto) => {
      const questionImage$ = dto.imageId
        ? this.imageService.getImageFromApi(dto.imageId)
        : of(null);

      const answers$ = this.buildAnswersForQuestionOutDtoList(dto);

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

  private buildAnswersForQuestionOutDtoList(dto: QuestionOutDtoWithImageId) {
    return dto.answers.map((answerDto) => {
      const answerImage$ = answerDto.imageId
        ? this.imageService.getImageFromApi(answerDto.imageId)
        : of(null);

      return answerImage$.pipe(
        map((answerImage) => ({
          id: answerDto.id,
          content: answerDto.content,
          image: answerImage,
          isSelected: false,
        }))
      );
    });
  }
}

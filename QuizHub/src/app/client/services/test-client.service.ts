import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TestResult } from '../models/testResult';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ImageService } from '../../common/services/image.service';
import { Observable, switchMap } from 'rxjs';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { ToastService } from '../../common/services/toast.service';
import { QuestionInDto } from '../models/questionInDto';
import { QuestionOutDto } from '../../common/models/questionOutDto';
import { AnswerOutDto } from '../../common/models/answerOutDto';

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
  private readonly router = inject(Router);
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
        headers: { skipAuth: 'true' },
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
        headers: { skipAuth: 'true' },
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
        headers: { skipAuth: 'true' },
      })
      .pipe(
        handleResultPatternResponse<TestResult, TestResult>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  getTestQuestions(testSolvingId: string): Observable<QuestionOutDto[]> {
    return this.http
      .get<Result<QuestionOutDtoWithImageId[]>>(
        this.apiUrl + '/client/test/' + testSolvingId,
        {
          headers: { skipAuth: 'true' },
        }
      )
      .pipe(this.handleQuestionOutDtoResultPatternResponse());
  }

  private handleQuestionOutDtoResultPatternResponse() {
    return (
      source: Observable<Result<QuestionOutDtoWithImageId[]>>
    ): Observable<QuestionOutDto[]> =>
      source.pipe(
        switchMap(async (result: Result<QuestionOutDtoWithImageId[]>) => {
          if (!result.isSuccess) {
            this.displayErrorToast(result.message || 'Wystąpił błąd');
            return null!;
          }

          const question = result.value;

          const questions: QuestionOutDto[] = await this.mapQuestionOutDto(
            question
          );

          return questions;
        })
      );
  }

  private async mapQuestionOutDto(
    questionDtoList: QuestionOutDtoWithImageId[]
  ): Promise<QuestionOutDto[]> {
    const mappedQuestions: QuestionOutDto[] = await Promise.all(
      questionDtoList.map(async (dto) => {
        const questionImage = dto.imageId
          ? await this.imageService.getImageFromApi(dto.imageId)
          : null;

        const answers: AnswerOutDto[] = await Promise.all(
          dto.answers.map(async (answerDto) => {
            const answerImage = answerDto.imageId
              ? await this.imageService.getImageFromApi(answerDto.imageId)
              : null;

            return {
              id: answerDto.id,
              content: answerDto.content,
              image: answerImage,
              isSelected: false,
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
}

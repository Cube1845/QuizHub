import { inject, Injectable } from '@angular/core';
import { TestLogData } from '../models/testLog';
import { SelectedAnswersData } from '../models/selectedAnswersData';
import { QuestionType } from '../../common/enums/questionType';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ToastService } from '../../common/services/toast.service';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';

@Injectable({
  providedIn: 'root',
})
export class TestLogsService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getSelectedAnswersData(testLogId: string): SelectedAnswersData {
    return {
      testId: 'hahahethrththr',
      durationInSeconds: 125,
      username: 'Ktoś tam',
      earnedPoints: 3,
      maxPoints: 10,
      solveDate: new Date(),
      usedQuestions: [
        null,
        {
          isScored: false,
          content: 'awdawdawd',
          image: null,
          questionType: QuestionType.MultiAnswer,
          answers: [
            {
              content: 'awgawg1awgtjh',
              image: null,
              isSelected: false,
              isCorrect: true,
            },
            {
              content: 'a641wgawgawgtjh',
              image: null,
              isSelected: true,
              isCorrect: true,
            },
            {
              content: 'awgawg162awgtjh',
              image: null,
              isSelected: true,
              isCorrect: false,
            },
            {
              content: 'awgawgawg16tjh',
              image: null,
              isSelected: true,
              isCorrect: false,
            },
          ],
        },
        {
          isScored: true,
          content: 'awd34634634634634awdawd',
          image: null,
          questionType: QuestionType.SingleAnswer,
          answers: [
            {
              content: 'awgawgrthrrthrth1awgtjh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
            {
              content: 'a641hrthrthtrhrhrwgawgawgtjh',
              image: null,
              isSelected: true,
              isCorrect: true,
            },
            {
              content: 'awgawthrtg162awgtjh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
            {
              content: 'awgawgdheh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
          ],
        },
      ],
    };
  }

  getTestLogData(testId: string): Observable<TestLogData> {
    return this.http
      .get<Result<TestLogData>>(this.apiUrl + '/test-logs/' + testId)
      .pipe(
        handleResultPatternResponse<TestLogData, TestLogData>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }
}

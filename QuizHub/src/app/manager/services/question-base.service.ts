import { inject, Injectable } from '@angular/core';
import { QuestionBaseData } from '../models/questionBaseData';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, Subject } from 'rxjs';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { ToastService } from '../../common/services/toast.service';

type AddQuestionBaseResponse = {
  questionBaseId: string;
};

@Injectable({
  providedIn: 'root',
})
export class QuestionBaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly toastService = inject(ToastService);

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getUserQuestionBasesData(): Observable<QuestionBaseData[]> {
    return this.http
      .get<Result<QuestionBaseData[]>>(this.apiUrl + '/question-base')
      .pipe(
        handleResultPatternResponse<QuestionBaseData[], QuestionBaseData[]>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  createUserQuestionBase(name: string): Observable<string> {
    const body = {
      name: name,
    };

    return this.http
      .post<Result<AddQuestionBaseResponse>>(
        this.apiUrl + '/question-base',
        body
      )
      .pipe(
        handleResultPatternResponse<AddQuestionBaseResponse, string>(
          (value) => value.questionBaseId,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  editQuestionBaseName(
    updatedName: string,
    questionBaseId: string
  ): Observable<boolean> {
    const body = {
      updatedName: updatedName,
      questionBaseId: questionBaseId,
    };

    return this.http.put<Result>(this.apiUrl + '/question-base', body).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  removeQuestionBase(questionBaseId: string): Observable<boolean> {
    return this.http
      .delete<Result>(this.apiUrl + '/question-base/' + questionBaseId)
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  exportQuestionBaseFile(questionBaseId: string): void {
    return;
  }

  importQuestionBaseFile(file: File): void {
    return;
  }
}

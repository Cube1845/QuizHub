import { inject, Injectable } from '@angular/core';
import { UnidentifiedQuestion } from '../models/unidentifiedQuestion';
import { Question } from '../models/question';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ToastService } from '../../common/services/toast.service';
import { HttpClient } from '@angular/common/http';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { PaginatedData } from '../../common/models/paginatedData';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getQuestionsFromUserQuestionBase(
    questionBaseId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedData<Question>> {
    return this.http
      .get<Result<PaginatedData<Question>>>(
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
        handleResultPatternResponse<
          PaginatedData<Question>,
          PaginatedData<Question>
        >(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  addQuestion(
    question: UnidentifiedQuestion,
    questionBaseId: string
  ): Observable<boolean> {
    const formData = new FormData();

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

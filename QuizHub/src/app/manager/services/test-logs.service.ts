import { inject, Injectable } from '@angular/core';
import { TestLog, TestLogData } from '../models/testLog';
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
import { PaginatedData } from '../../common/models/paginatedData';

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

  getSelectedAnswersData(testLogId: string): Observable<SelectedAnswersData> {}

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
}

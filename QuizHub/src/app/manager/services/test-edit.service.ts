import { inject, Injectable } from '@angular/core';
import { TestOptions } from '../models/testOptions';
import { QuestionBaseData } from '../models/questionBaseData';
import { Observable } from 'rxjs';
import { ToastService } from '../../common/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { TestOptionsAndData } from '../models/testOptionsAndData';

type CodeResponse = {
  code: string;
};

@Injectable({
  providedIn: 'root',
})
export class TestEditService {
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getTestOptionsAndData(testId: string): Observable<TestOptionsAndData> {
    return this.http
      .get<Result<TestOptionsAndData>>(this.apiUrl + '/test-options/' + testId)
      .pipe(
        handleResultPatternResponse<TestOptionsAndData, TestOptionsAndData>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  saveTestOptions(testId: string, options: TestOptions): Observable<boolean> {
    const body = {
      ...options,
      testId: testId,
    };

    return this.http.put<Result>(this.apiUrl + '/test-options', body).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  changeTestCode(testId: string): Observable<string> {
    const body = {
      testId: testId,
    };

    return this.http
      .put<Result<CodeResponse>>(this.apiUrl + '/test-options/code', body)
      .pipe(
        handleResultPatternResponse<CodeResponse, string>(
          (value) => value.code,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  changeTestActiveState(testId: string): Observable<boolean> {
    const body = {
      testId: testId,
    };

    return this.http
      .put<Result>(this.apiUrl + '/test-options/activity', body)
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }
}

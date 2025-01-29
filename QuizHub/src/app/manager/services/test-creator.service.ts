import { inject, Injectable } from '@angular/core';
import { TestData } from '../models/testData';
import { ToastService } from '../../common/services/toast.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';

type CreateTestResponse = {
  testId: string;
};

@Injectable({
  providedIn: 'root',
})
export class TestCreatorService {
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getUserTests(): Observable<TestData[]> {
    return this.http.get<Result<TestData[]>>(this.apiUrl + '/test').pipe(
      handleResultPatternResponse<TestData[], TestData[]>(
        (value) => value,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  createTest(name: string): Observable<string> {
    const body = {
      name: name,
    };

    return this.http
      .post<Result<CreateTestResponse>>(this.apiUrl + '/test', body)
      .pipe(
        handleResultPatternResponse<CreateTestResponse, string>(
          (value) => value.testId,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }

  editTestName(updatedName: string, testId: string): Observable<boolean> {
    const body = {
      testId: testId,
      updatedName: updatedName,
    };

    return this.http.put<Result>(this.apiUrl + '/test', body).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }

  removeTest(testId: string): Observable<boolean> {
    return this.http.delete<Result>(this.apiUrl + '/test/' + testId).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }
}

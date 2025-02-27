import { inject, Injectable } from '@angular/core';
import { TestHistoryData } from '../models/testHistoryData';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { ToastService } from '../../common/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TestHistoryService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getTestHistoriesNames(): Observable<TestHistoryData[]> {
    return this.http
      .get<Result<TestHistoryData[]>>(this.apiUrl + '/test-history')
      .pipe(
        handleResultPatternResponse<TestHistoryData[], TestHistoryData[]>(
          (value) => value,
          (detail) => this.displayErrorToast(detail)
        )
      );
  }
}

import { inject, Injectable } from '@angular/core';
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
export class UserSettingsService {
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<boolean> {
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    return this.http.put<Result>(this.apiUrl + '/auth/password', body).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail) => this.displayErrorToast(detail)
      )
    );
  }
}

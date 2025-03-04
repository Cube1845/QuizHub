import { Injectable } from '@angular/core';
import { AuthData } from '../../auth/models/authData';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  setAuthData(data: AuthData): void {
    sessionStorage.setItem('userId', data.userId!);
    sessionStorage.setItem('accessToken', data.accessToken!);
    sessionStorage.setItem('accessExpiryDateTime', data.accessExpiryDateTime!);
    sessionStorage.setItem('refreshToken', data.refreshToken!);
  }

  clearAuthData(): void {
    sessionStorage.clear();
  }

  getAuthData(): AuthData {
    const data: AuthData = {
      userId: sessionStorage.getItem('userId'),
      accessToken: sessionStorage.getItem('accessToken'),
      accessExpiryDateTime: sessionStorage.getItem('accessExpiryDateTime'),
      refreshToken: sessionStorage.getItem('refreshToken'),
    };

    return data;
  }

  isAuthDataSet(): boolean {
    return (
      sessionStorage.getItem('userId') != null &&
      sessionStorage.getItem('accessToken') != null &&
      sessionStorage.getItem('accessExpiryDateTime') != null &&
      sessionStorage.getItem('refreshToken') != null
    );
  }
}

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
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessExpiryDateTime');
    sessionStorage.removeItem('refreshToken');
  }

  getAuthData(): AuthData {
    let data: AuthData = {
      userId: sessionStorage.getItem('userId'),
      accessToken: sessionStorage.getItem('accessToken'),
      accessExpiryDateTime: sessionStorage.getItem('accessExpiryDateTime'),
      refreshToken: sessionStorage.getItem('refreshToken'),
    };

    return data;
  }
}

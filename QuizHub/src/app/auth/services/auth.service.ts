import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Result } from '../../common/models/result';
import { AuthData } from '../models/authData';
import { Router } from '@angular/router';
import { AuthDataService } from '../../common/services/auth-data.service';

type AuthRequest = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authDataService = inject(AuthDataService);

  register(email: string, password: string): Observable<Result> {
    let body: AuthRequest = {
      email: email,
      password: password,
    };

    return this.http.post<Result>(this.apiUrl + '/auth/register', body);
  }

  login(email: string, password: string): Observable<Result | AuthData> {
    let body: AuthRequest = {
      email: email,
      password: password,
    };

    return this.http.post<Result>(this.apiUrl + '/auth/login', body);
  }

  signOut(): void {
    this.authDataService.clearAuthData();
    this.router.navigateByUrl('login');
  }
}

import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Result } from '../../common/models/result';
import { AuthData } from '../models/authData';
import { Router } from '@angular/router';
import { AuthDataService } from '../../common/services/auth-data.service';
import { SKIP_AUTH } from '../models/httpContextTokens';

type AuthRequest = {
  username: string;
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

  register(username: string, password: string): Observable<Result> {
    const body: AuthRequest = {
      username: username,
      password: password,
    };

    return this.http.post<Result>(this.apiUrl + '/auth/register', body, {
      context: new HttpContext().set(SKIP_AUTH, true),
    });
  }

  login(username: string, password: string): Observable<Result | AuthData> {
    const body: AuthRequest = {
      username: username,
      password: password,
    };

    return this.http
      .post<Result>(this.apiUrl + '/auth/login', body, {
        context: new HttpContext().set(SKIP_AUTH, true),
      })
      .pipe(
        catchError((err) => {
          if (this.isHttpError(err)) {
            return of(err.error);
          }

          return of(err);
        })
      );
  }

  isHttpError(obj: any): obj is HttpErrorResponse {
    return obj.error != null;
  }

  signOut(): void {
    this.authDataService.clearAuthData();
    this.router.navigateByUrl('login');
  }
}

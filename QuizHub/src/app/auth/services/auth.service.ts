import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  register(email: string, password: string): boolean {
    return false;
  }

  login(email: string, password: string): boolean {
    return false;
  }
}

import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../common/services/toast.service';
import { isResult } from '../../../common/models/result';
import { AuthDataService } from '../../../common/services/auth-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly authDataService = inject(AuthDataService);

  loginButttonLoading: boolean = false;

  loginFormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(environment.minPasswordLength),
    ]),
  });

  login(): void {
    this.authService
      .login(
        this.loginFormGroup.value.email!,
        this.loginFormGroup.value.password!
      )
      .subscribe((result) => {
        if (!isResult(result)) {
          this.authDataService.setAuthData(result);
          this.router.navigateByUrl('manager');
          return;
        }

        this.toastService.displayToast(
          'error',
          'Błąd',
          result.message || 'Wystąpił błąd podczas logowania'
        );
      });
  }
}

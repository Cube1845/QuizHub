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
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(environment.minPasswordLength),
    ]),
  });

  login(): void {
    let apiResponsed = false;

    setTimeout(() => {
      if (!apiResponsed) {
        this.loginButttonLoading = true;
      }
    }, environment.minimalLoadingTimeSpinner);

    this.authService
      .login(
        this.loginFormGroup.value.username!,
        this.loginFormGroup.value.password!
      )
      .subscribe(
        (result) => {
          apiResponsed = true;
          this.loginButttonLoading = false;

          if (!isResult(result)) {
            this.authDataService.setAuthData(result);
            this.router.navigateByUrl('manager/question-bases');
            return;
          }

          this.toastService.displayToast(
            'error',
            'Błąd',
            result.message || 'Wystąpił błąd podczas logowania'
          );
        },
        () => {
          this.loginButttonLoading = false;

          this.toastService.displayToast(
            'error',
            'Błąd',
            'Wystąpił błąd z serwerem'
          );
        }
      );
  }

  goToSolvingTestsPage(): void {
    this.router.navigateByUrl('');
  }
}

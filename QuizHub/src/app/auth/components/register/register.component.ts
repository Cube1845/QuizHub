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
import { AuthService } from '../../services/auth.service';
import { passwordsMatchValidator } from '../../../manager/validators/passwords-match-validator';
import { environment } from '../../../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../common/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  registerButttonLoading: boolean = false;

  registerFormGroup = new FormGroup(
    {
      username: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(environment.minPasswordLength),
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(environment.minPasswordLength),
      ]),
    },
    passwordsMatchValidator
  );

  register(): void {
    let apiResponsed = false;

    setTimeout(() => {
      if (!apiResponsed) {
        this.registerButttonLoading = true;
      }
    }, environment.minimalLoadingTimeSpinner);

    this.authService
      .register(
        this.registerFormGroup.value.username!,
        this.registerFormGroup.value.password!
      )
      .subscribe(
        (result) => {
          apiResponsed = true;
          this.registerButttonLoading = false;

          if (result.isSuccess) {
            this.router.navigateByUrl('login');

            this.toastService.displayToast(
              'success',
              'Sukces',
              'Zarajestrowano, teraz się zaloguj'
            );
          } else {
            this.toastService.displayToast(
              'error',
              'Błąd',
              result.message || 'Wystąpił błąd podczas rejestracji'
            );
          }
        },
        () => {
          this.registerButttonLoading = false;

          this.toastService.displayToast(
            'error',
            'Błąd',
            'Wystąpił błąd z serwerem'
          );
        }
      );
  }
}

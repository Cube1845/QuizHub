import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { passwordsMatchValidator } from '../../../../validators/passwords-match-validator';
import { UserSettingsService } from '../../../../services/user-settings.service';
import { ToastService } from '../../../../../common/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly userSettingsService = inject(UserSettingsService);
  private readonly toastService = inject(ToastService);

  passwordFormGroup = new FormGroup(
    {
      oldPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    passwordsMatchValidator
  );

  changePassword(): void {
    this.userSettingsService
      .changePassword(
        this.passwordFormGroup.value.oldPassword!,
        this.passwordFormGroup.value.password!
      )
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Zmieniono hasło'
          );

          this.passwordFormGroup.reset();
        }
      });
  }
}

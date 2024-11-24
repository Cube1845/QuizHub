import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { passwordsMatchValidator } from '../../../common/validators/passwords-match-validator';
import { environment } from '../../../../environments/environment.development';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  authService = inject(AuthService);
  messageService = inject(MessageService);

  registerButttonLoading: boolean = false;

  registerFormGroup = new FormGroup(
    {
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
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
    this.authService.register(
      this.registerFormGroup.value.email!,
      this.registerFormGroup.value.password!
    );

    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: 'Taki użytkownik już istnieje',
    });
  }
}

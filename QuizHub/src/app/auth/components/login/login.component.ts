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
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  authService = inject(AuthService);
  messageService = inject(MessageService);

  loginButttonLoading: boolean = false;

  loginFormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(environment.minPasswordLength),
    ]),
  });

  login(): void {
    this.authService.login(
      this.loginFormGroup.value.email!,
      this.loginFormGroup.value.password!
    );

    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: 'Taki użytkownik nie istnieje',
    });
  }
}

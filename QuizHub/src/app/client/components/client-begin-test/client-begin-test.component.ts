import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TestClientService } from '../../services/test-client.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-begin-test',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './client-begin-test.component.html',
  styleUrl: './client-begin-test.component.scss',
})
export class ClientBeginTestComponent {
  private readonly testClientService = inject(TestClientService);
  private readonly router = inject(Router);

  dataFormGroup = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    code: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
  });

  beginTest(): void {
    var testSolvingId = this.testClientService.beginTest(
      this.dataFormGroup.value.code!,
      this.dataFormGroup.value.username!
    );

    // to subscribe
    this.router.navigateByUrl('test-solve/' + testSolvingId);
  }
}

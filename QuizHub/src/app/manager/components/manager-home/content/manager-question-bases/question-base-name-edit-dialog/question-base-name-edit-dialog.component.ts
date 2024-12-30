import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-question-base-name-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './question-base-name-edit-dialog.component.html',
  styleUrl: './question-base-name-edit-dialog.component.scss',
})
export class QuestionBaseNameEditDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  questionBaseIndex: number | null = this.config.data?.index;

  addingNewQuestionBase: boolean = this.questionBaseIndex == null;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  addNewQuestionBase(): void {
    this.ref.close(this.nameFormControl.value!);
  }

  saveQuestionBaseName() {
    this.ref.close({
      name: this.nameFormControl.value!,
      questionBaseIndex: this.questionBaseIndex,
    });
  }

  close(): void {
    this.ref.close(null);
  }
}

import { Component, inject, OnInit } from '@angular/core';
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
export class QuestionBaseNameEditDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  currentName: string | null = null;
  questionBaseIndex: number | null = null;

  dialogType!: 'add' | 'edit';

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  ngOnInit(): void {
    const data = this.config.data;

    if (data == null || data == undefined) {
      this.dialogType = 'add';
      return;
    }

    this.currentName = data.currentName;
    this.questionBaseIndex = data.index;

    this.dialogType = 'edit';

    if (this.currentName != null) {
      this.setInputValue();
    }
  }

  setInputValue(): void {
    this.nameFormControl.setValue(this.currentName);
  }

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

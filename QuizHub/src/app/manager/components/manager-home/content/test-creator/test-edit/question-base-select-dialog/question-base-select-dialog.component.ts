import { Component, inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionBaseData } from '../../../../../../models/questionBaseData';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-question-base-select-dialog',
  standalone: true,
  imports: [SelectModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './question-base-select-dialog.component.html',
  styleUrl: './question-base-select-dialog.component.scss',
})
export class QuestionBaseSelectDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  questionBases: QuestionBaseData[] = this.config.data;

  questionBaseFormControl = new FormControl<QuestionBaseData | null>(
    null,
    Validators.required
  );

  close(): void {
    this.ref.close(null);
  }

  select(): void {
    this.ref.close(this.questionBaseFormControl.value);
  }
}

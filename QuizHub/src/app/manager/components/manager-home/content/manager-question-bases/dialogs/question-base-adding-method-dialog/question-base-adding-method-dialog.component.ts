import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-question-base-adding-method-dialog',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './question-base-adding-method-dialog.component.html',
  styleUrl: './question-base-adding-method-dialog.component.scss',
})
export class QuestionBaseAddingMethodDialogComponent {
  private readonly ref = inject(DynamicDialogRef);

  addNewChosen(): void {
    this.ref.close(true);
  }

  importChosen(): void {
    this.ref.close(false);
  }
}

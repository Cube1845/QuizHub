import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { QuestionBaseService } from '../../../../services/question-base.service';
import { PolishWordVariationService } from '../../../../../common/services/polish-word-variation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { QuestionBaseData } from '../../../../../common/models/questionBaseData';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manager-question-bases',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
  templateUrl: './manager-question-bases.component.html',
  styleUrl: './manager-question-bases.component.scss',
  providers: [ConfirmationService],
})
export class ManagerQuestionBasesComponent {
  questionBaseService = inject(QuestionBaseService);
  polishWordVariationService = inject(PolishWordVariationService);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);

  dialogVisible: boolean = false;

  questionBases: QuestionBaseData[] | null = null;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  constructor() {
    this.questionBases = this.questionBaseService.getUserQuestionBasesData();
  }

  displayQuestionBaseRemovalModal(event: Event): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć tę bazę pytań?',
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-success p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {},
      reject: () => {},
    });
  }

  createQuestionBase(): void {
    this.questionBaseService.createUserQuestionBase(
      this.nameFormControl.value!
    );

    this.router.navigateByUrl('manager/question-base-edit/newuuid');
  }
}

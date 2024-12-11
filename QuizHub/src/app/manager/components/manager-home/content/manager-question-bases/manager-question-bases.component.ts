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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  templateUrl: './manager-question-bases.component.html',
  styleUrl: './manager-question-bases.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ManagerQuestionBasesComponent {
  questionBaseService = inject(QuestionBaseService);
  polishWordVariationService = inject(PolishWordVariationService);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  dialogVisible: boolean = false;
  currentEditedQuestionBaseIndex: number = -1;

  questionBases: QuestionBaseData[] | null = null;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25),
  ]);

  constructor() {
    this.questionBases = this.questionBaseService.getUserQuestionBasesData();
  }

  getDialogHeader(): string {
    if (this.currentEditedQuestionBaseIndex >= 0) {
      return 'Edytuj nazwę bazy pytań';
    }

    return 'Dodaj bazę pytań';
  }

  displayQuestionBaseNameEditDialog(event: Event, index: number): void {
    event.stopPropagation();

    this.nameFormControl.setValue(this.questionBases![index].name);
    this.currentEditedQuestionBaseIndex = index;
    this.dialogVisible = true;
  }

  displayQuestionBaseRemovalModal(event: Event, index: number): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć tę bazę pytań?',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.removeQuestionBase(index),
    });
  }

  removeQuestionBase(index: number): void {
    this.questionBaseService.removeQuestionBase(this.questionBases![index].id);

    this.questionBases?.splice(index, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Usunięto bazę pytań',
    });
  }

  createQuestionBase(): void {
    this.questionBaseService.createUserQuestionBase(
      this.nameFormControl.value!
    );

    this.router.navigateByUrl('manager/question-base-edit/newuuid');
  }

  saveQuestionBaseName(): void {
    this.questionBaseService.editQuestionBaseName(
      this.nameFormControl.value!,
      this.questionBases![this.currentEditedQuestionBaseIndex].id
    );

    this.questionBases![this.currentEditedQuestionBaseIndex].name =
      this.nameFormControl.value!;
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Zapisano nazwę',
    });
  }
}

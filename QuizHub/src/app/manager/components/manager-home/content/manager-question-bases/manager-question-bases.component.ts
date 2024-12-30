import { Component, inject, OnDestroy } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { QuestionBaseService } from '../../../../services/question-base.service';
import { PolishWordVariationService } from '../../../../services/polish-word-variation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuestionBaseNameEditDialogComponent } from './question-base-name-edit-dialog/question-base-name-edit-dialog.component';
import { QuestionBaseData } from '../../../../models/questionBaseData';

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
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ManagerQuestionBasesComponent implements OnDestroy {
  private readonly questionBaseService = inject(QuestionBaseService);
  private readonly polishWordVariationService = inject(
    PolishWordVariationService
  );
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);

  questionBases: QuestionBaseData[] | null = null;

  ref: DynamicDialogRef | undefined;

  constructor() {
    this.questionBases = this.questionBaseService.getUserQuestionBasesData();
  }

  goToQuestionEditor(questionBaseId: string) {
    this.router.navigateByUrl('manager/question-base-edit/' + questionBaseId);
  }

  getQuestionWordVariation(questionNumber: number): string {
    return this.polishWordVariationService.getQuestionWordVariation(
      questionNumber
    );
  }

  displayQuestionBaseNameEditDialog(event: Event, index: number): void {
    event.stopPropagation();

    this.ref = this.dialogService.open(QuestionBaseNameEditDialogComponent, {
      header: 'Edytuj nazwę bazy pytań',
      width: '30rem',
      height: '19rem',
      modal: true,
      data: { index: index },
    });

    this.ref.onClose.subscribe((result) => {
      if (result != null) {
        this.saveQuestionBaseName(result.name, result.questionBaseIndex);
        return;
      }
    });
  }

  displayQuestionBaseCreatingDialog(event: Event): void {
    event.stopPropagation();

    this.ref = this.dialogService.open(QuestionBaseNameEditDialogComponent, {
      header: 'Dodaj bazę pytań',
      width: '30rem',
      height: '19rem',
      modal: true,
    });

    this.ref.onClose.subscribe((result) => {
      if (result != null) {
        this.createQuestionBase(result);
        return;
      }
    });
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

  createQuestionBase(name: string): void {
    this.questionBaseService.createUserQuestionBase(name);

    this.router.navigateByUrl('manager/question-base-edit/newuuid');
  }

  saveQuestionBaseName(updatedName: string, questionBaseIndex: number): void {
    this.questionBaseService.editQuestionBaseName(
      updatedName,
      this.questionBases![questionBaseIndex].id
    );

    //temporary, till API
    this.questionBases![questionBaseIndex].name = updatedName;

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Zapisano nazwę',
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}

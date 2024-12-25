import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionBaseService } from '../../../../../services/question-base.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuestionEditDialogComponent } from './question-edit-dialog/question-edit-dialog.component';
import { Question } from '../../../../../models/question';
import { UndefinedQuestion } from '../../../../../models/undefinedQuestion';
import { NgStyle } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorOptions } from '../../../../../models/paginatorOptions';

@Component({
  selector: 'app-question-base-edit',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    ImageModule,
    NgStyle,
    PaginatorModule,
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class QuestionBaseEditComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly questionBaseService = inject(QuestionBaseService);
  private readonly questionService = inject(QuestionService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  ref: DynamicDialogRef | undefined;

  questionBaseId!: string | null;

  questions: Question[] | null = null;

  searchFormControl = new FormControl<string>('', Validators.required);

  paginatorOptions: PaginatorOptions | undefined;

  ngOnInit() {
    this.paginatorOptions = new PaginatorOptions(0, 10, 50, [10, 20, 30]);

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.questionBaseId = paramMap.get('id');

      this.questions =
        this.questionBaseService.getQuestionsFromUserQuestionBase(
          this.questionBaseId!
        );
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  goBack(): void {
    this.router.navigateByUrl('manager/question-bases');
  }

  searchForQuestions(): void {
    this.questionService.searchForQuestions(
      this.questionBaseId!,
      this.searchFormControl.value!
    );
  }

  openQuestionEditor(index: number, event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isNotMainComponent =
      clickedElement.closest('.independent-cilck-action') != null;

    const isNotImage = clickedElement.closest('.p-image-preview-mask') != null;

    const isNotMask = clickedElement.closest('.p-overlay-mask') != null;

    if (isNotMainComponent || isNotImage || isNotMask) {
      event.stopPropagation();
      return;
    }

    this.showEditQuestionDialog(index);
  }

  showEditQuestionDialog(questionIndex: number): void {
    this.ref = this.dialogService.open(QuestionEditDialogComponent, {
      header: 'Edytuj pytanie',
      width: '72rem',
      height: '46rem',
      modal: true,
      data: {
        question: this.questions![questionIndex],
        questionIndex: questionIndex,
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result != null) {
        this.saveQuestion(result.question, result.questionIndex);
        return;
      }
    });
  }

  showCreatingQuestionDialog(): void {
    this.ref = this.dialogService.open(QuestionEditDialogComponent, {
      header: 'Dodaj pytanie',
      width: '72rem',
      height: '46rem',
      modal: true,
    });

    this.ref.onClose.subscribe((result) => {
      if (result != null) {
        this.addQuestion(result);
        return;
      }
    });
  }

  displayQuestionRemovalModal(event: Event, index: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć to pytanie?',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.removeQuestion(index),
    });
  }

  removeQuestion(index: number): void {
    this.questionService.removeQuestion(this.questions![index].id);

    this.questions!.splice(index, 1);

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Usunięto pytanie',
    });
  }

  saveQuestion(question: Question, questionIndex: number): void {
    this.questionService.editQuestion(question, question.id);

    this.questions![questionIndex] = question;

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Zapisano pytanie',
    });
  }

  addQuestion(questionToAdd: UndefinedQuestion): void {
    this.questionService.addQuestion(questionToAdd);

    //temporary solution before API
    let question: Question = {
      content: questionToAdd.content,
      answers: questionToAdd.answers.map((undefinedAnswer) => {
        return {
          content: undefinedAnswer.content,
          image: undefinedAnswer.image,
          isCorrect: undefinedAnswer.isCorrect,
          id: '',
        };
      }),
      image: questionToAdd.image,
      questionType: questionToAdd.questionType,
      id: '',
    };

    this.questions!.push(question);

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Dodano pytanie',
    });
  }

  onPageChange(event: any) {
    const pageNumber = event.page;
  }
}

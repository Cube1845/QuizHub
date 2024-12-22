import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../../../../../common/models/question';
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
import { FileUpload } from 'primeng/fileupload';
import { Image } from 'primeng/image';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { QuestionEditDialogComponent } from './question-edit-dialog/question-edit-dialog.component';

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

  ngOnInit() {
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
    const isMainComponent =
      clickedElement.closest('.independent-cilck-action') !== null;

    if (isMainComponent) {
      event.stopPropagation();
      return;
    }

    this.showEditQuestionDialog(index);
  }

  showEditQuestionDialog(questionIndex: number): void {
    this.ref = this.dialogService.open(QuestionEditDialogComponent, {
      header: 'Edytuj pytanie',
      width: '72rem',
      height: '45rem',
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

  // addQuestion(): void {
  //   //change that to questionDTO something \/

  //   var answers: Answer[] = this.questionFormGroup.controls.answers.controls
  //     .filter((fc) => fc.value != '')
  //     .map((fc, index) => {
  //       if (fc.value! != '') {
  //         return {
  //           content: fc.value!,
  //           isCorrect:
  //             this.questionFormGroup.controls.correctAnswers.controls[index]
  //               .value!,
  //           image: null, //here
  //           id: '',
  //         };
  //       }
  //       return null!;
  //     });

  //   const question: Question = {
  //     content: this.questionFormGroup.controls.content.value!,
  //     answers: answers,
  //     image: null,
  //     id: '',
  //   };

  //   this.questionService.addQuestion(question);

  //   this.questions!.push(question);

  //   this.questionDialogVisible = false;
  //   this.questionFormGroup.reset();

  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Sukces',
  //     detail: 'Dodano pytanie',
  //   });
  // }
}

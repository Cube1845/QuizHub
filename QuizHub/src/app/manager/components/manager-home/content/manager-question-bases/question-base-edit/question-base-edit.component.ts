import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../../../services/question.service';
import { ImageModule } from 'primeng/image';
import { QuestionEditDialogComponent } from './question-edit-dialog/question-edit-dialog.component';
import { Question } from '../../../../../models/question';
import { UnidentifiedQuestion } from '../../../../../models/unidentifiedQuestion';
import { NgStyle } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorOptions } from '../../../../../models/paginatorOptions';
import { ToastService } from '../../../../../../common/services/toast.service';
import { GlobalDialogService } from '../../../../../../common/services/global-dialog.service';

@Component({
  selector: 'app-question-base-edit',
  standalone: true,
  imports: [
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ImageModule,
    NgStyle,
    PaginatorModule,
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
})
export class QuestionBaseEditComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly questionService = inject(QuestionService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly globalDialogService = inject(GlobalDialogService);

  private readonly paginatorItemsPerPage = [10, 20, 30];

  questionBaseId!: string | null;

  questions: Question[] | null = null;

  searchFormControl = new FormControl<string>('', Validators.required);

  paginatorOptions: PaginatorOptions | undefined;

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.questionBaseId = paramMap.get('id');

      this.questionService
        .getQuestionsFromUserQuestionBase(
          this.questionBaseId!,
          1,
          this.paginatorItemsPerPage[0]
        )
        .subscribe((data) => {
          this.questions = data.data;
          this.paginatorOptions = new PaginatorOptions(
            0,
            this.paginatorItemsPerPage[0],
            data.totalItems,
            this.paginatorItemsPerPage
          );
        });
    });
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
    this.globalDialogService
      .displayDialog(QuestionEditDialogComponent, {
        header: 'Edytuj pytanie',
        modal: true,
        data: {
          question: this.questions![questionIndex],
          questionIndex: questionIndex,
        },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveQuestion(result.question, result.questionIndex);
          return;
        }
      });
  }

  showCreatingQuestionDialog(): void {
    this.globalDialogService
      .displayDialog(QuestionEditDialogComponent, {
        header: 'Dodaj pytanie',
        modal: true,
      })
      .subscribe((result) => {
        if (result != null) {
          this.addQuestion(result);
          return;
        }
      });
  }

  displayQuestionRemovalModal(event: Event, index: number): void {
    this.globalDialogService.displayConfirmationDialog({
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

    this.toastService.displayToast('success', 'Sukces', 'Usunięto pytanie');
  }

  saveQuestion(question: Question, questionIndex: number): void {
    this.questionService.editQuestion(question, question.id);

    this.questions![questionIndex] = question;

    this.toastService.displayToast('success', 'Sukces', 'Zapisano pytanie');
  }

  addQuestion(questionToAdd: UnidentifiedQuestion): void {
    this.questionService
      .addQuestion(
        questionToAdd,
        this.questionBaseId!,
        questionToAdd.image,
        questionToAdd.answers.map((answer) => answer.image)
      )
      .subscribe((isSuccess) => {
        if (isSuccess) {
          const lastPageNumber =
            this.paginatorOptions!.getLastPageNumberAfterAddition();

          this.questionService
            .getQuestionsFromUserQuestionBase(
              this.questionBaseId!,
              lastPageNumber,
              this.paginatorOptions!.rows
            )
            .subscribe((data) => {
              this.questions = data.data;

              this.paginatorOptions!.totalItems = data.totalItems;
              this.paginatorOptions!.setFirst(lastPageNumber);

              this.toastService.displayToast(
                'success',
                'Sukces',
                'Dodano pytanie'
              );
            });
        }
      });
  }

  onPageChange(event: any) {
    const pageNumber = event.page;
  }
}

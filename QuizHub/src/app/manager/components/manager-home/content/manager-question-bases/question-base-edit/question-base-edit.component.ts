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
import { SpinnerComponent } from '../../../../../../common/components/spinner/spinner.component';
import { QuestionUpdateDTO } from '../../../../../models/questionUpdateDTO';
import { ImageEditionState } from '../../../../../enums/imageEditionState';
import { DisplayableImage } from '../../../../../../common/models/displayableImage';
import { Answer } from '../../../../../models/answer';
import { QuestionBaseService } from '../../../../../services/question-base.service';
import saveAs from 'file-saver';
import { NameEditDialogComponent } from '../../../../../../common/components/name-edit-dialog/name-edit-dialog.component';

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
    SpinnerComponent,
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
  private readonly questionBaseService = inject(QuestionBaseService);

  private readonly paginatorItemsPerPage = [10, 20, 30];

  questionBaseId!: string | null;
  questionBaseName!: string | null;

  questions: Question[] | null = null;

  searchFormControl = new FormControl<string>('');

  paginatorOptions: PaginatorOptions = new PaginatorOptions(
    1,
    this.paginatorItemsPerPage[0],
    0,
    this.paginatorItemsPerPage,
    () => this.getQuestionsAndSetThem(1)
  );

  questionGetType: 'regular' | 'searched' = 'regular';

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id == null) {
        return;
      }

      this.questionBaseId = id;

      this.getQuestionsAndSetThem(1);
    });
  }

  getQuestionsAndSetThem(pageNumber: number): void {
    this.questionService
      .getQuestionsFromUserQuestionBase(
        this.questionBaseId!,
        pageNumber,
        this.paginatorOptions.rows
      )
      .subscribe((response) => {
        if (!!response) {
          this.searchFormControl.reset();
          this.questionGetType = 'regular';

          this.questions = response.data.data;
          this.paginatorOptions.totalItems = response.data.totalItems;
          this.questionBaseName = response.questionBaseName;
        }
      });
  }

  goBack(): void {
    this.router.navigateByUrl('manager/question-bases');
  }

  searchForQuestions(pageNumber: number = 1): void {
    const key = this.searchFormControl.value;

    if (key == null || key!.trim() == '') {
      this.paginatorOptions.setPage(1);
      this.getQuestionsAndSetThem(1);
      return;
    }

    this.questionService
      .searchForQuestions(
        this.questionBaseId!,
        key!,
        pageNumber,
        this.paginatorOptions.rows
      )
      .subscribe((response) => {
        if (!!response) {
          this.questionGetType = 'searched';
          this.questions = response.data;
          this.paginatorOptions.totalItems = response.totalItems;
        }
      });
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
          this.saveQuestion(
            result.question,
            result.contentImage,
            result.answerImages,
            result.questionIndex
          );
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
        }
      });
  }

  displayQuestionRemovalModal(index: number): void {
    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz usunąć to pytanie?',
      () => this.removeQuestion(index)
    );
  }

  removeQuestion(index: number): void {
    this.questionService
      .removeQuestion(this.questionBaseId!, this.questions![index].id)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.questions!.splice(index, 1);
          this.paginatorOptions!.totalItems--;
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Usunięto pytanie'
          );
        }
      });
  }

  saveQuestion(
    questionDto: QuestionUpdateDTO,
    contentImage: DisplayableImage | null,
    answerImages: (DisplayableImage | null)[],
    questionIndex: number
  ): void {
    this.questionService
      .editQuestion(
        questionDto,
        this.questionBaseId!,
        contentImage,
        answerImages
      )
      .subscribe((isSuccess) => {
        if (isSuccess) {
          const question: Question = {
            content: questionDto.content,
            questionType: questionDto.questionType,
            image:
              questionDto.imageEditionState == ImageEditionState.Modified
                ? contentImage
                : questionDto.image,
            id: questionDto.id,
            answers: questionDto.answers.map((answer, i) => {
              const mappedAnswer: Answer = {
                content: answer.content,
                isCorrect: answer.isCorrect,
                image:
                  answer.imageEditionState == ImageEditionState.Modified
                    ? answerImages[i]
                    : answer.image,
                id: answer.id,
              };

              return mappedAnswer;
            }),
          };

          this.questions![questionIndex] = question;
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Zapisano pytanie'
          );
        }
      });
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
            .subscribe((response) => {
              if (!!response) {
                this.questions = response.data.data;

                this.paginatorOptions!.totalItems = response.data.totalItems;
                this.paginatorOptions!.setPage(lastPageNumber);

                this.toastService.displayToast(
                  'success',
                  'Sukces',
                  'Dodano pytanie'
                );
              }
            });
        }
      });
  }

  displayQuestionBaseRemovalModal(): void {
    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz usunąć tę bazę pytań?',
      () => this.removeThisQuestionBase()
    );
  }

  removeThisQuestionBase(): void {
    this.questionBaseService
      .removeQuestionBase(this.questionBaseId!)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.goBack();
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Usunięto bazę pytań'
          );
        }
      });
  }

  displayQuestionBaseNameEditModal(): void {
    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Edytuj nazwę bazy pytań',
        width: '25rem',
        modal: true,
        data: { index: -1, currentName: this.questionBaseName },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveThisQuestionBaseName(result.name);
        }
      });
  }

  saveThisQuestionBaseName(updatedName: string): void {
    this.questionBaseService
      .editQuestionBaseName(updatedName, this.questionBaseId!)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.questionBaseName = updatedName;
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Zmieniono nazwę'
          );
        }
      });
  }

  displayDownloadingQuestionBaseModal(event: Event): void {
    event.stopPropagation();

    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz pobrać tę bazę pytań do pliku?',
      () => this.downloadQuestionBase()
    );
  }

  downloadQuestionBase(): void {
    this.questionBaseService
      .exportQuestionBaseFile(this.questionBaseId!)
      .subscribe((value) => {
        return saveAs(value, this.questionBaseName!);
      });
  }

  onPageChange(event: any): void {
    const pageNumber = event.page + 1;

    this.questionGetType == 'regular'
      ? this.getQuestionsAndSetThem(pageNumber)
      : this.searchForQuestions(pageNumber);

    this.paginatorOptions.setPage(pageNumber);
  }
}

import { Component, inject, OnInit } from '@angular/core';
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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { requireOneSelectedAnswerValidator } from '../../../../../../common/validators/require-one-selected-answer-validator';
import { correctAnswerSelectionValidator } from '../../../../../../common/validators/correct-answer-selection-validator';
import { QuestionService } from '../../../../../services/question.service';
import { Answer } from '../../../../../../common/models/answer';
import { enforceSequentialAnswersValidator } from '../../../../../../common/validators/enforce-sequential-answers-validator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Image } from 'primeng/image';
import { environment } from '../../../../../../../environments/environment.development';
import { ImagePanelComponent } from './image-panel/image-panel.component';

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
    Image,
    ImagePanelComponent,
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class QuestionBaseEditComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  questionBaseService = inject(QuestionBaseService);
  questionService = inject(QuestionService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  router = inject(Router);

  readonly maxImageSize = environment.maxImageSize;

  questionBaseId: string | null = null;

  questionDialogVisible: boolean = false;
  currentEditedQuestionIndex: number = -1;

  imagePreviewVisible: boolean = false;
  imagePreviewUrl: string | null = null;

  questions: Question[] | null = null;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      contentImage: new FormControl<File | null>(null),
      answers: new FormGroup(
        [
          new FormControl<string>('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          new FormControl<string>('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          new FormControl<string>('', Validators.minLength(3)),
          new FormControl<string>('', Validators.minLength(3)),
        ],
        enforceSequentialAnswersValidator()
      ),
      correctAnswers: new FormGroup(
        [
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
        ],
        requireOneSelectedAnswerValidator()
      ),
      answerImages: new FormGroup([
        new FormControl<File | null>(null),
        new FormControl<File | null>(null),
        new FormControl<File | null>(null),
        new FormControl<File | null>(null),
      ]),
    },
    correctAnswerSelectionValidator()
  );

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

  goBack(): void {
    this.router.navigateByUrl('manager/question-bases');
  }

  searchForQuestions(): void {
    this.questionService.searchForQuestions(
      this.questionBaseId!,
      this.searchFormControl.value!
    );
  }

  getDialogHeader(): string {
    if (this.currentEditedQuestionIndex >= 0) {
      return 'Edytuj pytanie';
    }

    return 'Dodaj pytanie';
  }

  openQuestionEditor(index: number, event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isMainComponent =
      clickedElement.closest('.independent-cilck-action') !== null;

    if (isMainComponent) {
      event.stopPropagation();
      return;
    }

    var answerValues = this.questions![index].answers.map(
      (answer) => answer.content
    );

    while (answerValues.length < 4) {
      answerValues.push('');
    }

    var correctAnswers = this.questions![index].answers.map(
      (answer) => answer.isCorrect
    );

    while (correctAnswers.length < 4) {
      correctAnswers.push(false);
    }

    this.questionFormGroup.setValue({
      content: this.questions![index].content,
      contentImage: null,
      answers: [
        answerValues[0],
        answerValues[1],
        answerValues[2],
        answerValues[3],
      ],
      correctAnswers: [
        correctAnswers[0],
        correctAnswers[1],
        correctAnswers[2],
        correctAnswers[3],
      ],
      answerImages: [null, null, null, null],
    });
    this.questionDialogVisible = true;
  }

  handleSelectedImage(event: any): void {
    const file: File = event.files[0];

    if (file.size > this.maxImageSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Wybrany plik jest zbyt duży.',
      });
      return;
    }
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

  private getAnswerId(questionIndex: number, answerIndex: number): string {
    if (this.questions![questionIndex].answers.length > answerIndex) {
      return this.questions![questionIndex].answers[answerIndex].id;
    }

    return '';
  }

  displayImagePreview(url: string): void {
    this.imagePreviewUrl = url;
    this.imagePreviewVisible = true;
  }

  private buildQuestionFromQuestionFormGroup(): Question {
    var lastAnswerIndex = 0;

    for (let i = 0; i < 4; i++) {
      if (
        this.questionFormGroup.controls.answers.controls[i] != null ||
        this.questionFormGroup.controls.answerImages.controls[i] != null
      ) {
        lastAnswerIndex++;
      }
    }

    var answers: Answer[] = [];

    for (let i = 0; i < lastAnswerIndex; i++) {
      answers.push({
        content: this.questionFormGroup.controls.answers.controls[i].value,
        id: this.getAnswerId(this.currentEditedQuestionIndex, i),
        image: this.questionFormGroup.controls.answerImages.controls[i].value,
        isCorrect:
          this.questionFormGroup.controls.correctAnswers.controls[i].value!,
      });
    }

    var image: File | null = null;

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      id: this.questions![this.currentEditedQuestionIndex].id,
    };

    return question;
  }

  saveQuestion(): void {
    const question = this.buildQuestionFromQuestionFormGroup();

    this.questionService.editQuestion(
      question,
      this.questions![this.currentEditedQuestionIndex].id
    );

    this.questions![this.currentEditedQuestionIndex].content =
      this.questionFormGroup.controls.content.value!;

    this.questions![this.currentEditedQuestionIndex].answers = question.answers;

    this.questions![this.currentEditedQuestionIndex].image = question.image;

    this.questionDialogVisible = false;
    this.questionFormGroup.reset();
    this.currentEditedQuestionIndex = -1;

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Zapisano pytanie',
    });
  }

  addQuestion(): void {
    //change that to questionDTO something \/

    var answers: Answer[] = this.questionFormGroup.controls.answers.controls
      .filter((fc) => fc.value != '')
      .map((fc, index) => {
        if (fc.value! != '') {
          return {
            content: fc.value!,
            isCorrect:
              this.questionFormGroup.controls.correctAnswers.controls[index]
                .value!,
            image: null, //here
            id: '',
          };
        }
        return null!;
      });

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: null,
      id: '',
    };

    this.questionService.addQuestion(question);

    this.questions!.push(question);

    this.questionDialogVisible = false;
    this.questionFormGroup.reset();

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Dodano pytanie',
    });
  }

  closeEditDialog(): void {
    this.questionDialogVisible = false;
    this.questionFormGroup.reset();
    this.currentEditedQuestionIndex = -1;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImagePanelComponent } from './image-panel/image-panel.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { enforceSequentialAnswersValidator } from '../../../../../../validators/enforce-sequential-answers-validator';
import { requireOneSelectedAnswerValidator } from '../../../../../../validators/require-one-selected-answer-validator';
import { correctAnswerSelectionValidator } from '../../../../../../validators/correct-answer-selection-validator';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { requireFirstTwoAnswersValidator } from '../../../../../../validators/require-first-two-answers-validator';
import { Question } from '../../../../../../models/question';
import { DisplayableImage } from '../../../../../../models/displayableImage';
import { Answer } from '../../../../../../models/answer';
import { QuestionType } from '../../../../../../enums/questionType';
import { SelectButton } from 'primeng/selectbutton';
import { UnidentifiedQuestion } from '../../../../../../models/unidentifiedQuestion';
import { UnidentifiedAnswer } from '../../../../../../models/unidentifiedAnswer';

@Component({
  selector: 'app-question-edit-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    ImagePanelComponent,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    SelectButton,
  ],
  templateUrl: './question-edit-dialog.component.html',
  styleUrl: './question-edit-dialog.component.scss',
  providers: [DialogService],
})
export class QuestionEditDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DialogService);

  questionTypes: any[] = [
    { label: 'Pojedyncza odpowiedź', value: QuestionType.SingleAnswer },
    { label: 'Wielokrotna odpowiedź', value: QuestionType.MultiAnswer },
  ];

  question: Question | null = this.config.data?.question;
  questionIndex: number | null = this.config.data?.questionIndex;

  dialogType: 'edit' | 'add' = this.questionIndex == null ? 'add' : 'edit';

  imageDisplayRef: DynamicDialogRef | undefined;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120),
      ]),
      contentImage: new FormControl<DisplayableImage | null>(null),
      answers: new FormGroup<FormControl<string | null>[]>([
        new FormControl<string>('', [
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
        new FormControl<string>('', [
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
        new FormControl<string>('', [
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
        new FormControl<string>('', [
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ]),
      correctAnswers: new FormGroup<FormControl<boolean | null>[]>(
        [
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
        ],
        requireOneSelectedAnswerValidator()
      ),
      answerImages: new FormGroup<FormControl<DisplayableImage | null>[]>([
        new FormControl<DisplayableImage | null>(null),
        new FormControl<DisplayableImage | null>(null),
        new FormControl<DisplayableImage | null>(null),
        new FormControl<DisplayableImage | null>(null),
      ]),
      questionType: new FormControl<QuestionType | null>(
        QuestionType.SingleAnswer,
        Validators.required
      ),
    },
    [
      enforceSequentialAnswersValidator(),
      correctAnswerSelectionValidator(),
      requireFirstTwoAnswersValidator(),
    ]
  );

  ngOnInit(): void {
    this.setInputValues();
  }

  isPreviousAnswerSet(currentAnswerIndex: number): boolean {
    const content =
      this.questionFormGroup.controls.answers.controls[currentAnswerIndex - 1]
        .value;
    const image =
      this.questionFormGroup.controls.answerImages.controls[
        currentAnswerIndex - 1
      ].value;

    if ((content == null || content.trim().length < 3) && image == null) {
      return false;
    }

    return true;
  }

  getAnswerContentValues(): (string | null)[] {
    const answerValues = this.question!.answers.map((answer) => answer.content);

    while (answerValues.length < 4) {
      answerValues.push('');
    }

    return answerValues;
  }

  getCorrectAnswers(): (boolean | null)[] {
    const correctAnswers = this.question!.answers.map(
      (answer) => answer.isCorrect
    );

    while (correctAnswers.length < 4) {
      correctAnswers.push(false);
    }

    return correctAnswers;
  }

  getAnswerImages(): (File | null)[] {
    const answerImages = this.question!.answers.map((answer) => answer.image);

    while (answerImages.length < 4) {
      answerImages.push(null);
    }

    return answerImages;
  }

  setInputValues(): void {
    if (this.dialogType == 'add') {
      return;
    }

    this.questionFormGroup.setValue({
      content: this.question!.content,
      contentImage: this.question!.image,
      answers: this.getAnswerContentValues(),
      correctAnswers: this.getCorrectAnswers(),
      answerImages: this.getAnswerImages(),
      questionType: this.question!.questionType,
    });
  }

  private getAnswerId(answerIndex: number): string {
    if (!!this.question && this.question.answers.length > answerIndex) {
      return this.question!.answers[answerIndex].id;
    }

    return '';
  }

  private buildQuestionFromQuestionFormGroup(): Question {
    const controls = this.questionFormGroup.controls;

    let lastAnswerIndex = 0;

    for (let i = 0; i < 4; i++) {
      if (
        controls.answers.controls[i].value != '' ||
        controls.answerImages.controls[i].value != null
      ) {
        lastAnswerIndex++;
      }
    }

    const answers: Answer[] = [];

    for (let i = 0; i < lastAnswerIndex; i++) {
      answers.push({
        content: controls.answers.controls[i].value,
        id: this.getAnswerId(i),
        image: controls.answerImages.controls[i].value,
        isCorrect: controls.correctAnswers.controls[i].value!,
      });
    }

    const image: DisplayableImage | null =
      this.questionFormGroup.value.contentImage!;

    const question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      questionType: this.questionFormGroup.controls.questionType.value!,
      id: this.question?.id || '',
    };

    return question;
  }

  private buildUndefinedQuestionFromQuestionFormGroup(): UnidentifiedQuestion {
    const controls = this.questionFormGroup.controls;

    let lastAnswerIndex = 0;

    for (let i = 0; i < 4; i++) {
      if (
        controls.answers.controls[i].value != '' ||
        controls.answerImages.controls[i].value != null
      ) {
        lastAnswerIndex++;
      }
    }

    const answers: UnidentifiedAnswer[] = [];

    for (let i = 0; i < lastAnswerIndex; i++) {
      answers.push({
        content: controls.answers.controls[i].value,
        image: controls.answerImages.controls[i].value,
        isCorrect: controls.correctAnswers.controls[i].value!,
      });
    }

    const image: DisplayableImage | null =
      this.questionFormGroup.value.contentImage!;

    const question: UnidentifiedQuestion = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      questionType: this.questionFormGroup.controls.questionType.value!,
    };

    return question;
  }

  displayImagePreview(imageUrl: string): void {
    this.imageDisplayRef = this.dialogService.open(ImagePreviewComponent, {
      width: 'auto',
      height: 'auto',
      modal: true,
      data: imageUrl,
      closable: true,
    });
  }

  addQuestion(): void {
    this.ref.close(this.buildUndefinedQuestionFromQuestionFormGroup());
  }

  save(): void {
    this.ref.close({
      question: this.buildQuestionFromQuestionFormGroup(),
      questionIndex: this.questionIndex,
    });
  }

  close(): void {
    this.ref.close(null);
  }
}

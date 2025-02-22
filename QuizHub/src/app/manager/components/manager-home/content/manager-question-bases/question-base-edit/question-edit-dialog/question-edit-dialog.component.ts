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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { enforceSequentialAnswersValidator } from '../../../../../../validators/enforce-sequential-answers-validator';
import { requireOneSelectedAnswerValidator } from '../../../../../../validators/require-one-selected-answer-validator';
import { correctAnswerSelectionValidator } from '../../../../../../validators/correct-answer-selection-validator';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { requireFirstTwoAnswersValidator } from '../../../../../../validators/require-first-two-answers-validator';
import { Question } from '../../../../../../models/question';
import {
  DisplayableImage,
  DisplayableImageWithChangeTracker,
} from '../../../../../../../common/models/displayableImage';
import { QuestionType } from '../../../../../../../common/enums/questionType';
import { SelectButton } from 'primeng/selectbutton';
import { UnidentifiedQuestion } from '../../../../../../models/unidentifiedQuestion';
import { UnidentifiedAnswer } from '../../../../../../models/unidentifiedAnswer';
import { QuestionUpdateDTO } from '../../../../../../models/questionUpdateDTO';
import { AnswerUpdateDTO } from '../../../../../../models/answerUpdateDTO';
import { ImageEditionState } from '../../../../../../enums/imageEditionState';
import { GlobalDialogService } from '../../../../../../../common/services/global-dialog.service';

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
})
export class QuestionEditDialogComponent implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly globalDialogService = inject(GlobalDialogService);
  private readonly ref = inject(DynamicDialogRef);

  questionTypes: any[] = [
    { label: 'Pojedyncza odpowiedź', value: QuestionType.SingleAnswer },
    { label: 'Wielokrotna odpowiedź', value: QuestionType.MultiAnswer },
  ];

  question: Question | null = this.config.data?.question;
  questionIndex: number | null = this.config.data?.questionIndex;

  dialogType: 'edit' | 'add' = this.questionIndex == null ? 'add' : 'edit';

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(120),
      ]),
      contentImage: new FormControl<DisplayableImageWithChangeTracker | null>(
        null
      ),
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
      answerImages: new FormGroup<
        FormControl<DisplayableImageWithChangeTracker | null>[]
      >([
        new FormControl<DisplayableImageWithChangeTracker | null>(null),
        new FormControl<DisplayableImageWithChangeTracker | null>(null),
        new FormControl<DisplayableImageWithChangeTracker | null>(null),
        new FormControl<DisplayableImageWithChangeTracker | null>(null),
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

  private getAnswerId(answerIndex: number): string | null {
    if (!!this.question && this.question.answers.length > answerIndex) {
      return this.question!.answers[answerIndex].id;
    }

    return null;
  }

  private buildQuestionFromQuestionFormGroup(): QuestionUpdateDTO {
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

    const answers: AnswerUpdateDTO[] = [];

    for (let i = 0; i < lastAnswerIndex; i++) {
      answers.push({
        content: controls.answers.controls[i].value,
        id: this.getAnswerId(i),
        image: controls.answerImages.controls[i].value,
        isCorrect: controls.correctAnswers.controls[i].value!,
        imageEditionState: this.getImageStateForAnswer(i),
      });
    }

    const image: DisplayableImage | null =
      this.questionFormGroup.value.contentImage!;

    const question: QuestionUpdateDTO = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      questionType: this.questionFormGroup.controls.questionType.value!,
      id: this.question!.id,
      imageEditionState: this.getImageStateForContentImage(),
    };

    return question;
  }

  getImageStateForAnswer(answerIndex: number): ImageEditionState {
    if (this.question!.answers.length <= answerIndex) {
      if (
        this.questionFormGroup.controls.answerImages.controls[answerIndex] !=
        null
      ) {
        return ImageEditionState.Modified;
      }

      return ImageEditionState.Untouched;
    }

    if (
      this.question!.answers[answerIndex].image != null &&
      this.questionFormGroup.controls.answerImages.controls[answerIndex]
        .value == null
    ) {
      return ImageEditionState.Removed;
    } else if (
      !this.questionFormGroup.controls.answerImages.controls[answerIndex].value
        ?.wasChangedSinceAssigning
    ) {
      return ImageEditionState.Untouched;
    }

    return ImageEditionState.Modified;
  }

  getImageStateForContentImage(): ImageEditionState {
    if (
      this.question!.image != null &&
      this.questionFormGroup.controls.contentImage.value == null
    ) {
      return ImageEditionState.Removed;
    } else if (
      !this.questionFormGroup.controls.contentImage.value
        ?.wasChangedSinceAssigning
    ) {
      return ImageEditionState.Untouched;
    }

    return ImageEditionState.Modified;
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
    this.globalDialogService.displayDialog(ImagePreviewComponent, {
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
    const question = this.buildQuestionFromQuestionFormGroup();

    const response = {
      question: question,
      contentImage:
        question.imageEditionState == ImageEditionState.Modified
          ? this.questionFormGroup.controls.contentImage.value
          : null,
      answerImages: question.answers.map((answer, i) => {
        return answer.imageEditionState == ImageEditionState.Modified
          ? this.questionFormGroup.controls.answerImages.controls[i].value
          : null;
      }),
      questionIndex: this.questionIndex,
    };

    this.questionFormGroup.reset();

    this.ref.close(response);
  }

  close(): void {
    this.questionFormGroup.reset();
    this.ref.close(null);
  }
}

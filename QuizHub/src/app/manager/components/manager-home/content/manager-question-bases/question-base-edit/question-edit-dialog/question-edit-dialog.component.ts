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
import { enforceSequentialAnswersValidator } from '../../../../../../../common/validators/enforce-sequential-answers-validator';
import { requireOneSelectedAnswerValidator } from '../../../../../../../common/validators/require-one-selected-answer-validator';
import { correctAnswerSelectionValidator } from '../../../../../../../common/validators/correct-answer-selection-validator';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Question } from '../../../../../../../common/models/question';
import { Answer } from '../../../../../../../common/models/answer';

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
  ],
  templateUrl: './question-edit-dialog.component.html',
  styleUrl: './question-edit-dialog.component.scss',
})
export class QuestionEditDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  question: Question = this.config.data.question;
  questionIndex: number = this.config.data.questionIndex;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      contentImage: new FormControl<File | null>(null),
      answers: new FormGroup<FormControl<string | null>[]>(
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
      correctAnswers: new FormGroup<FormControl<boolean | null>[]>(
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

  ngOnInit(): void {
    this.setInputValues();
  }

  setInputValues(): void {
    const answerValues = this.question.answers.map((answer) => answer.content);

    const correctAnswers = this.question.answers.map(
      (answer) => answer.isCorrect
    );

    while (answerValues.length < 4) {
      answerValues.push('');
      correctAnswers.push(false);
    }

    this.questionFormGroup.setValue({
      content: this.question.content,
      contentImage: this.question.image,
      answers: answerValues,
      correctAnswers: correctAnswers,
      answerImages: [null, null, null, null],
    });
  }

  private getAnswerId(answerIndex: number): string {
    if (this.question.answers.length > answerIndex) {
      return this.question.answers[answerIndex].id;
    }

    return '';
  }

  private buildQuestionFromQuestionFormGroup(): Question {
    const controls = this.questionFormGroup.controls;

    let lastAnswerIndex = 0;

    for (let i = 0; i < 4; i++) {
      if (
        controls.answers.controls[i].value != null ||
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

    const image = this.questionFormGroup.value.contentImage!;

    const question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      id: this.question.id,
    };

    return question;
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

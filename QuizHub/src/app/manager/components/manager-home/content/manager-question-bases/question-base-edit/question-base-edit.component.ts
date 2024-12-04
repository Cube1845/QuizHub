import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
  providers: [ConfirmationService],
})
export class QuestionBaseEditComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  questionBaseService = inject(QuestionBaseService);
  questionService = inject(QuestionService);
  confirmationService = inject(ConfirmationService);

  questionDialogVisible: boolean = false;
  currentEditedQuestionIndex: number = -1;

  questions: Question[] | null = null;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
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
    },
    correctAnswerSelectionValidator()
  );

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.questions =
        this.questionBaseService.getQuestionsFromUserQuestionBase(
          paramMap.get('id')!
        );
    });
  }

  getDialogHeader(): string {
    if (this.currentEditedQuestionIndex >= 0) {
      return 'Edytuj pytanie';
    }

    return 'Dodaj pytanie';
  }

  openQuestionEditor(index: number) {
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
    });
    this.questionDialogVisible = true;
  }

  displayQuestionRemovalModal(event: Event, index: number): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć to pytanie?',
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-success p-button-outlined',
      rejectButtonStyleClass: 'p-button-danger p-button-outlined',
      acceptIcon: 'none',
      rejectIcon: 'none',
      defaultFocus: 'reject',

      accept: () => this.removeQuestion(index),
    });
  }

  removeQuestion(index: number): void {
    this.questionService.removeQuestion(this.questions![index].id);

    this.questions!.splice(index, 1);
  }

  private getAnswerId(questionIndex: number, answerIndex: number): string {
    if (this.questions![questionIndex].answers.length > answerIndex) {
      return this.questions![questionIndex].answers[answerIndex].id;
    }

    return '';
  }

  saveQuestion(): void {
    //change that to questionDTO something \/

    var answerFormControls =
      this.questionFormGroup.controls.answers.controls.filter(
        (fc) => fc.value != ''
      );

    var answers: Answer[] = [];

    answerFormControls.forEach((fc, i) => {
      answers.push({
        content: fc.value!,
        id: this.getAnswerId(this.currentEditedQuestionIndex, i),
        isCorrect:
          this.questionFormGroup.controls.correctAnswers.controls[i].value!,
      });
    });

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      id: this.questions![this.currentEditedQuestionIndex].id,
    };

    this.questionService.editQuestion(
      question,
      this.questions![this.currentEditedQuestionIndex].id
    ); // to API

    this.questions![this.currentEditedQuestionIndex].content =
      this.questionFormGroup.controls.content.value!;

    this.questions![this.currentEditedQuestionIndex].answers = answers;
  }

  addQuestion(): void {
    //change that to questionDTO something \/

    var answerFormControls =
      this.questionFormGroup.controls.answers.controls.filter(
        (fc) => fc.value != ''
      );

    var answers: Answer[] = [];

    answerFormControls.forEach((fc, i) => {
      answers.push({
        content: fc.value!,
        id: '',
        isCorrect:
          this.questionFormGroup.controls.correctAnswers.controls[i].value!,
      });
    });

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      id: '',
    };

    this.questionService.addQuestion(question); // to API

    var answers: Answer[] = this.questionFormGroup.controls.answers.controls
      .filter((fc) => fc.value != '')
      .map((fc, index) => {
        if (fc.value! != '') {
          return {
            content: fc.value!,
            isCorrect:
              this.questionFormGroup.controls.correctAnswers.controls[index]
                .value!,
            id: '',
          };
        }
        return null!;
      });

    var newQuestion: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      id: '',
    };

    this.questions!.push(newQuestion);
  }
}

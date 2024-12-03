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
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
})
export class QuestionBaseEditComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  questionBaseService = inject(QuestionBaseService);
  questionService = inject(QuestionService);

  questionDialogVisible: boolean = false;
  currentEditedQuestionIndex: number = -1;

  questions: Question[] | null = null;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      answers: new FormGroup([
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
      ]),
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

  saveQuestion(): void {
    this.questionService.saveQuestion(); // to API

    this.questions![this.currentEditedQuestionIndex].content =
      this.questionFormGroup.controls.content.value!;

    this.questions![this.currentEditedQuestionIndex].answers[0].content =
      this.questionFormGroup.controls.answers.controls[0].value!;
    this.questions![this.currentEditedQuestionIndex].answers[0].isCorrect =
      this.questionFormGroup.controls.correctAnswers.controls[0].value!;

    this.questions![this.currentEditedQuestionIndex].answers[1].content =
      this.questionFormGroup.controls.answers.controls[1].value!;
    this.questions![this.currentEditedQuestionIndex].answers[1].isCorrect =
      this.questionFormGroup.controls.correctAnswers.controls[1].value!;

    if (this.questions![this.currentEditedQuestionIndex].answers.length > 2) {
      this.questions![this.currentEditedQuestionIndex].answers[2].content =
        this.questionFormGroup.controls.answers.controls[2].value!;
      this.questions![this.currentEditedQuestionIndex].answers[2].isCorrect =
        this.questionFormGroup.controls.correctAnswers.controls[2].value!;
    }

    if (this.questions![this.currentEditedQuestionIndex].answers.length > 3) {
      this.questions![this.currentEditedQuestionIndex].answers[3].content =
        this.questionFormGroup.controls.answers.controls[3].value!;
      this.questions![this.currentEditedQuestionIndex].answers[3].isCorrect =
        this.questionFormGroup.controls.correctAnswers.controls[3].value!;
    }
  }

  addQuestion(): void {
    this.questionService.addQuestion(); // to API

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

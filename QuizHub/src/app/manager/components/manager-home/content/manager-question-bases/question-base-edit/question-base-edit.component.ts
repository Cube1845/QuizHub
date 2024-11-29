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

  editQuestionDialogVisible: boolean = false;

  newQuestionDialogVisible: boolean = false;

  questions: Question[] | null = null;

  editQuestionFormGroup = new FormGroup({
    content: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    answers: new FormGroup({
      A: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      B: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      C: new FormControl<string>('', [Validators.minLength(3)]),
      D: new FormControl<string>('', [Validators.minLength(3)]),
    }),
    correctAnswers: new FormGroup({
      A: new FormControl<boolean>(false),
      B: new FormControl<boolean>(false),
      C: new FormControl<boolean>(false),
      D: new FormControl<boolean>(false),
    }),
  });

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.questions =
        this.questionBaseService.getQuestionsFromUserQuestionBase(
          paramMap.get('id')!
        );
    });
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

    this.editQuestionFormGroup.setValue({
      content: this.questions![index].content,
      answers: {
        A: answerValues[0],
        B: answerValues[1],
        C: answerValues[2],
        D: answerValues[3],
      },
      correctAnswers: {
        A: correctAnswers[0],
        B: correctAnswers[1],
        C: correctAnswers[2],
        D: correctAnswers[3],
      },
    });
    this.editQuestionDialogVisible = true;
  }
}

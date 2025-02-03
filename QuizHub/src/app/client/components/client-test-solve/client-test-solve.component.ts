import { Component, inject } from '@angular/core';
import { AnswerTileComponent } from './answer-tile/answer-tile.component';
import { ButtonModule } from 'primeng/button';
import { TestClientService } from '../../services/test-client.service';
import { QuestionInterface } from '../../models/questionInterface';
import { QuestionType } from '../../../common/enums/questionType';
import { GlobalDialogService } from '../../../common/services/global-dialog.service';

@Component({
  selector: 'app-client-test-solve',
  standalone: true,
  imports: [AnswerTileComponent, ButtonModule],
  templateUrl: './client-test-solve.component.html',
  styleUrl: './client-test-solve.component.scss',
})
export class ClientTestSolveComponent {
  private readonly testClientService = inject(TestClientService);
  private readonly globalDialogService = inject(GlobalDialogService);

  questions!: QuestionInterface[];

  currentQuestionIndex: number = 0;

  constructor() {
    this.questions = this.testClientService.getTestQuestions();
  }

  displayFinishingTestDialog(): void {
    let message = 'Na pewno chcesz zakończyć test?';

    if (!this.everyQuestionHasSelectedAnswers()) {
      message =
        'Nie zaznaczyłeś odpowiedzi na wszystkie pytania. Czy na pewno chcesz zakończyć test?';
    }

    this.globalDialogService.displayConfirmationDialog(message, () =>
      this.finishTest()
    );
  }

  finishTest(): void {
    this.testClientService.finishTest(this.questions);
  }

  everyQuestionHasSelectedAnswers(): boolean {
    return this.questions.every((question) =>
      question.answers.some((answer) => answer.isSelected)
    );
  }

  previousPage(): void {
    if (this.currentQuestionIndex - 1 >= 0) {
      this.currentQuestionIndex--;
    }
  }

  nextPage(): void {
    if (this.questions.length > this.currentQuestionIndex + 1) {
      this.currentQuestionIndex++;
    }
  }

  selectAnswer(answerIndex: number, state: boolean): void {
    if (
      answerIndex >= this.questions[this.currentQuestionIndex].answers.length
    ) {
      return;
    }

    if (
      this.questions[this.currentQuestionIndex].questionType ==
      QuestionType.MultiAnswer
    ) {
      this.questions[this.currentQuestionIndex].answers[
        answerIndex
      ].isSelected = state;
      return;
    }

    if (state) {
      this.questions[this.currentQuestionIndex].answers.forEach((answer) => {
        if (answer.isSelected) {
          answer.isSelected = false;
        }
      });
    }

    this.questions[this.currentQuestionIndex].answers[answerIndex].isSelected =
      state;
  }
}

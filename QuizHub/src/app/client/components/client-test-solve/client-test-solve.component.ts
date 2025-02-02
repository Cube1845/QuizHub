import { Component, inject } from '@angular/core';
import { AnswerTileComponent } from './answer-tile/answer-tile.component';
import { ButtonModule } from 'primeng/button';
import { TestClientService } from '../../services/test-client.service';
import { QuestionInterface } from '../../models/questionInterface';
import { QuestionType } from '../../../common/enums/questionType';

@Component({
  selector: 'app-client-test-solve',
  standalone: true,
  imports: [AnswerTileComponent, ButtonModule],
  templateUrl: './client-test-solve.component.html',
  styleUrl: './client-test-solve.component.scss',
})
export class ClientTestSolveComponent {
  private readonly testClientService = inject(TestClientService);

  currentQuestion!: QuestionInterface;

  currentQuestionIndex: number = 0;

  questionLength!: number;

  constructor() {
    this.currentQuestion = this.testClientService.getQuestion(0)!;
    this.questionLength = this.testClientService.getQuestionsLength();
  }

  previousPage(): void {
    if (this.currentQuestionIndex - 1 >= 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.testClientService.getQuestion(
        this.currentQuestionIndex
      );
    }
  }

  nextPage(): void {
    if (this.questionLength > this.currentQuestionIndex + 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.testClientService.getQuestion(
        this.currentQuestionIndex
      );
    }
  }

  selectAnswer(answerIndex: number, state: boolean): void {
    this.currentQuestion = this.testClientService.changeQuestionSelectedState(
      this.currentQuestionIndex,
      answerIndex,
      state
    );
  }
}

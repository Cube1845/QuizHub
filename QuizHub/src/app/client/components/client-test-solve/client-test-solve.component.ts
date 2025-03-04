import { Component, inject } from '@angular/core';
import { AnswerTileComponent } from './answer-tile/answer-tile.component';
import { ButtonModule } from 'primeng/button';
import { TestClientService } from '../../services/test-client.service';
import { QuestionType } from '../../../common/enums/questionType';
import { GlobalDialogService } from '../../../common/services/global-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionOutDto } from '../../../common/models/questionOutDto';
import { SpinnerComponent } from '../../../common/components/spinner/spinner.component';

@Component({
  selector: 'app-client-test-solve',
  standalone: true,
  imports: [AnswerTileComponent, ButtonModule, SpinnerComponent],
  templateUrl: './client-test-solve.component.html',
  styleUrl: './client-test-solve.component.scss',
})
export class ClientTestSolveComponent {
  private readonly testClientService = inject(TestClientService);
  private readonly globalDialogService = inject(GlobalDialogService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  questions!: QuestionOutDto[] | null;

  currentQuestionIndex: number = 0;

  testSolvingId!: string | null;

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id == null) {
        return;
      }

      this.testSolvingId = id;

      this.testClientService
        .getTestQuestions(this.testSolvingId!)
        .subscribe((value) => {
          if (value) {
            this.questions = value;
          } else {
            this.router.navigateByUrl('');
          }
        });
    });
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
    const questionInDtos = this.questions!.map((question) => {
      return {
        id: question.id,
        selectedAnswerIds: question.answers
          .filter((answer) => answer.isSelected)
          .map((answer) => answer.id),
      };
    });

    this.testClientService
      .finishTest(questionInDtos, this.testSolvingId!)
      .subscribe((value) => {
        if (value) {
          this.router.navigateByUrl('test-finish/' + value);
        }
      });
  }

  everyQuestionHasSelectedAnswers(): boolean {
    return this.questions!.every((question) =>
      question.answers.some((answer) => answer.isSelected)
    );
  }

  previousPage(): void {
    if (this.currentQuestionIndex - 1 >= 0) {
      this.currentQuestionIndex--;
    }
  }

  nextPage(): void {
    if (this.questions!.length > this.currentQuestionIndex + 1) {
      this.currentQuestionIndex++;
    }
  }

  selectAnswer(answerIndex: number, state: boolean): void {
    if (
      answerIndex >= this.questions![this.currentQuestionIndex].answers.length
    ) {
      return;
    }

    if (
      this.questions![this.currentQuestionIndex].questionType ==
      QuestionType.MultiAnswer
    ) {
      this.questions![this.currentQuestionIndex].answers[
        answerIndex
      ].isSelected = state;
      return;
    }

    if (state) {
      this.questions![this.currentQuestionIndex].answers.forEach((answer) => {
        if (answer.isSelected) {
          answer.isSelected = false;
        }
      });
    }

    this.questions![this.currentQuestionIndex].answers[answerIndex].isSelected =
      state;
  }
}

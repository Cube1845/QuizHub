import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TestLogsService } from '../../../../../../services/test-logs.service';
import {
  SelectedAnswersData,
  UsedQuestion,
} from '../../../../../../models/selectedAnswersData';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { convertTimeInSecondsToTimeString } from '../../../../../../../common/globalFunctions';

@Component({
  selector: 'app-selected-answers-display',
  standalone: true,
  imports: [ButtonModule, DatePipe],
  templateUrl: './selected-answers-display.component.html',
  styleUrl: './selected-answers-display.component.scss',
})
export class SelectedAnswersDisplayComponent {
  private readonly testLogsService = inject(TestLogsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly answerChars = ['A', 'B', 'C', 'D'];

  selectedAnswersData!: SelectedAnswersData | null;

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      const testLogId = paramMap.get('id');

      this.selectedAnswersData = this.testLogsService.getSelectedAnswersData(
        testLogId!
      );
    });
  }

  goBack(): void {
    this.router.navigateByUrl(
      'manager/test-logs/' + this.selectedAnswersData!.testId
    );
  }

  convertTimeInSecondsToTimeString(seconds: number): string {
    return convertTimeInSecondsToTimeString(seconds);
  }

  getSpecifiedAnswerChars(
    usedQuestion: UsedQuestion,
    key: 'isCorrect' | 'isSelected'
  ): string {
    var allAnswerChars = usedQuestion.answers.map((answer, i) => {
      if (answer[key]) {
        return this.answerChars[i];
      }

      return null;
    });

    const selectedAnswerChars = allAnswerChars.filter(
      (answer) => answer != null
    );

    return selectedAnswerChars.join(', ');
  }
}

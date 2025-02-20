import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TestLogsService } from '../../../../../../services/test-logs.service';
import {
  SelectedAnswer,
  SelectedAnswersData,
  UsedQuestion,
} from '../../../../../../models/selectedAnswersData';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { convertTimeInSecondsToTimeString } from '../../../../../../../common/globalFunctions';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-selected-answers-display',
  standalone: true,
  imports: [ButtonModule, DatePipe, ImageModule],
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

  getAnswerClass(selectedAnswer: SelectedAnswer): string {
    if (selectedAnswer.isCorrect && selectedAnswer.isSelected) {
      return ' selected-correct';
    }

    if (selectedAnswer.isSelected && !selectedAnswer.isCorrect) {
      return ' selected-incorrect';
    }

    if (!selectedAnswer.isSelected && selectedAnswer.isCorrect) {
      return ' correct';
    }

    return '';
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

    var stringBeginning;

    if (key == 'isCorrect') {
      if (selectedAnswerChars.length > 1) {
        stringBeginning = 'Poprawne odpowiedzi: ';
      } else {
        stringBeginning = 'Poprawna odpowiedź: ';
      }
    } else {
      if (selectedAnswerChars.length > 1) {
        stringBeginning = 'Zaznaczone odpowiedzi: ';
      } else {
        stringBeginning = 'Zaznaczona odpowiedź: ';
      }
    }

    const finalString =
      stringBeginning +
      (selectedAnswerChars.length > 0
        ? selectedAnswerChars.join(', ')
        : 'Brak');

    return finalString;
  }
}

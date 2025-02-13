import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PolishWordVariationService {
  getQuestionWordVariation(questionCount: number): string {
    const lastDigit = questionCount % 10;

    if (questionCount == 1) {
      return 'Pytanie';
    } else if (lastDigit == 2 || lastDigit == 3 || lastDigit == 4) {
      return 'Pytania';
    } else {
      return 'Pytań';
    }
  }

  getSolveWordVariation(solveCount: number): string {
    const lastDigit = solveCount % 10;

    if (solveCount == 1) {
      return 'Rozwiązanie';
    } else if (lastDigit == 2 || lastDigit == 3 || lastDigit == 4) {
      return 'Rozwiązania';
    } else {
      return 'Rozwiązań';
    }
  }
}

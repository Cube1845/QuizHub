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
}

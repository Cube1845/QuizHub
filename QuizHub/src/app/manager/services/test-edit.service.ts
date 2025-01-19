import { Injectable } from '@angular/core';
import { TestOptions } from '../models/testOptions';

@Injectable({
  providedIn: 'root',
})
export class TestEditService {
  getTestOptions(testId: string): TestOptions {
    return {
      name: 'Test 1',
      questionCount: 10,
      usedQuestionBases: [
        {
          questionBaseId: 'awdada',
          questionBaseName: 'Pytania testowe',
          minimalQuestionCount: 2,
        },
        {
          questionBaseId: 'awdadaga',
          questionBaseName: 'Pytania testowe 2',
          minimalQuestionCount: 5,
        },
      ],
      isActive: false,
      code: 'aeg234ged',
    };
  }
}

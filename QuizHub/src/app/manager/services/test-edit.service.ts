import { Injectable } from '@angular/core';
import { TestOptions } from '../models/testOptions';

export type TestOptionsAndData = {
  testOptions: TestOptions;
  code: string;
  isActive: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class TestEditService {
  getTestOptionsAndData(testId: string): TestOptionsAndData {
    return {
      testOptions: {
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
      },
      code: 'js6fA820',
      isActive: false,
    };
  }
}

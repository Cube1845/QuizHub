import { inject, Injectable } from '@angular/core';
import { QuestionInterface } from '../models/questionInterface';
import { QuestionType } from '../../common/enums/questionType';
import { Router } from '@angular/router';
import { TestResult } from '../models/testResult';

@Injectable({
  providedIn: 'root',
})
export class TestClientService {
  private readonly router = inject(Router);

  beginTest(code: string, username: string): string {
    // api call

    return 'a1231szefa-1fwasf-awegfaw';
  }

  finishTest(questions: QuestionInterface[]): TestResult {
    // api call

    this.router.navigateByUrl('test-finish');

    return {
      earnedPoints: 2,
      maxPoints: 10,
      time: new Date(),
      username: 'uzerr',
    };
  }

  getTestQuestions(): QuestionInterface[] {
    //api call

    return [
      {
        questionType: QuestionType.MultiAnswer,
        content: 'awdawdawdaw',
        id: 'dawdawd',
        image: null,
        answers: [
          {
            content: 'hsdhsthsd',
            id: 'tjsfdjdfj',
            image: null,
            isSelected: false,
          },
          {
            content: 'dfjdftjdft',
            id: 'jdftjd',
            image: null,
            isSelected: false,
          },
          {
            content: 'd1126f1d13616136tjdft',
            id: 'j1dftjd',
            image: null,
            isSelected: false,
          },
        ],
      },
      {
        questionType: QuestionType.SingleAnswer,
        content: '1a125dawdawdaw',
        id: 'dawda16wd',
        image: null,
        answers: [
          {
            content: 'hsd234hsthsd',
            id: 'tjs16136fdjdfj',
            image: null,
            isSelected: false,
          },
          {
            content: 'dfjd163ftjdft',
            id: 'jdf1236tjd',
            image: null,
            isSelected: false,
          },
          {
            content: 'd11213616f1d13616136tjdft',
            id: 'j1361dftjd',
            image: null,
            isSelected: false,
          },
          {
            content: 'd11213616f1d136161361231tjdft',
            id: 'j1361dftjd',
            image: null,
            isSelected: false,
          },
        ],
      },
    ];
  }
}

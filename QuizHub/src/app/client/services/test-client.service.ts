import { inject, Injectable } from '@angular/core';
import { QuestionInterface } from '../models/questionInterface';
import { QuestionType } from '../../common/enums/questionType';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TestClientService {
  private readonly router = inject(Router);
  private testQuestions!: QuestionInterface[] | null;

  getQuestionsLength(): number {
    return this.testQuestions!.length;
  }

  getQuestion(index: number): QuestionInterface {
    if (this.testQuestions == null) {
      // api call to end test
      this.router.navigateByUrl('start');
      return null!;
    }

    if (index >= this.testQuestions.length) {
      return null!;
    }

    return this.testQuestions[index];
  }

  changeQuestionSelectedState(
    questionIndex: number,
    answerIndex: number,
    state: boolean
  ): QuestionInterface {
    if (questionIndex >= this.testQuestions!.length) {
      return this.testQuestions![questionIndex];
    }

    if (answerIndex >= this.testQuestions![questionIndex].answers.length) {
      return this.testQuestions![questionIndex];
    }

    if (
      this.testQuestions![questionIndex].questionType ==
      QuestionType.MultiAnswer
    ) {
      this.testQuestions![questionIndex].answers[answerIndex].isSelected =
        state;

      return this.testQuestions![questionIndex];
    }

    if (state) {
      this.testQuestions![questionIndex].answers.forEach((answer) => {
        if (answer.isSelected) {
          answer.isSelected = false;
        }
      });
    }

    this.testQuestions![questionIndex].answers[answerIndex].isSelected = state;

    return this.testQuestions![questionIndex];
  }

  beginTest(code: string, username: string): boolean {
    // api call
    this.testQuestions = this.testQuestions = this.getTestQuestions();

    this.router.navigateByUrl('test-solve');

    return true;
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

import { Injectable } from '@angular/core';
import { TestLogData } from '../models/testLog';
import { SelectedAnswersData } from '../models/selectedAnswersData';
import { QuestionType } from '../../common/enums/questionType';

@Injectable({
  providedIn: 'root',
})
export class TestLogsService {
  getSelectedAnswersData(testLogId: string): SelectedAnswersData {
    return {
      testId: 'hahahethrththr',
      testLogId: 'awdawdaw',
      durationInSeconds: 125,
      username: 'Ktoś tam',
      earnedPoints: 3,
      maxPoints: 10,
      solveDate: new Date(),
      usedQuestions: [
        {
          id: 'awdawdagae',
          isScored: false,
          content: 'awdawdawd',
          image: null,
          questionType: QuestionType.MultiAnswer,
          answers: [
            {
              id: 'awdawd',
              content: 'awgawg1awgtjh',
              image: null,
              isSelected: false,
              isCorrect: true,
            },
            {
              id: 'a16wdawd',
              content: 'a641wgawgawgtjh',
              image: null,
              isSelected: true,
              isCorrect: true,
            },
            {
              id: 'aw16awd',
              content: 'awgawg162awgtjh',
              image: null,
              isSelected: true,
              isCorrect: false,
            },
            {
              id: 'awd1awd',
              content: 'awgawgawg16tjh',
              image: null,
              isSelected: true,
              isCorrect: false,
            },
          ],
        },
        {
          id: 'awda3465346wdagae',
          isScored: true,
          content: 'awd34634634634634awdawd',
          image: null,
          questionType: QuestionType.SingleAnswer,
          answers: [
            {
              id: 'aw5125',
              content: 'awgawgrthrrthrth1awgtjh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
            {
              id: 'a16w126513613dawd',
              content: 'a641hrthrthtrhrhrwgawgawgtjh',
              image: null,
              isSelected: true,
              isCorrect: true,
            },
            {
              id: 'aw1613616awd',
              content: 'awgawthrtg162awgtjh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
            {
              id: 'awd16136awd',
              content: 'awgawgdheh',
              image: null,
              isSelected: false,
              isCorrect: false,
            },
          ],
        },
      ],
    };
  }

  getTestLogData(testId: string): TestLogData {
    return {
      testId: 'awdawdawdaw',
      testName: 'Test',
      testLogs: [
        {
          id: 'awdawdagae',
          durationInSeconds: 200,
          username: 'awaseggawg',
          earnedPoints: 5,
          maxPoints: 10,
          solveDate: new Date(),
        },
        {
          id: 'awdhthhdtae',
          durationInSeconds: 150,
          username: 'tasergdjg',
          earnedPoints: 6,
          maxPoints: 11,
          solveDate: new Date(),
        },
        {
          id: 'awdaw5dagae',
          durationInSeconds: 200,
          username: 'awgawgawg',
          earnedPoints: 4,
          maxPoints: 10,
          solveDate: new Date(),
        },
        {
          id: 'awdh1thhdtae',
          durationInSeconds: 150,
          username: 'tdgawgjg',
          earnedPoints: 6,
          maxPoints: 11,
          solveDate: new Date(),
        },
        {
          id: 'awda2wdagae',
          durationInSeconds: 200,
          username: 'awgasegasegawg',
          earnedPoints: 1,
          maxPoints: 10,
          solveDate: new Date(),
        },
      ],
    };
  }
}

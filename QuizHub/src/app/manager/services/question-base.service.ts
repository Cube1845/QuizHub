import { Injectable } from '@angular/core';
import { QuestionBase } from '../../common/models/questionBase';

@Injectable({
  providedIn: 'root',
})
export class QuestionBaseService {
  getUserQuestionBases(): QuestionBase[] {
    return [
      {
        name: 'Baza pytań 1',
        questions: [
          {
            content: 'Pytanie 1',
            answers: [
              {
                content: 'Odpowiedź a',
                isCorrect: false,
              },
              {
                content: 'Odpowiedź b',
                isCorrect: false,
              },
              {
                content: 'Odpowiedź c',
                isCorrect: true,
              },
              {
                content: 'Odpowiedź d',
                isCorrect: false,
              },
            ],
          },
          {
            content: 'Pytanie 2',
            answers: [
              {
                content: 'O1dpowiedź a',
                isCorrect: false,
              },
              {
                content: 'O1dpowiedź b',
                isCorrect: true,
              },
              {
                content: 'O1dpowiedź c',
                isCorrect: false,
              },
              {
                content: 'O1dpowiedź d',
                isCorrect: false,
              },
            ],
          },
          {
            content: 'Pytanie 3',
            answers: [
              {
                content: 'O2dpowiedź a',
                isCorrect: false,
              },
              {
                content: 'O2dpowiedź b',
                isCorrect: false,
              },
              {
                content: 'O2dpowiedź c',
                isCorrect: false,
              },
              {
                content: 'O2dpowiedź d',
                isCorrect: true,
              },
            ],
          },
        ],
      },
      {
        name: 'Baza pytań 2',
        questions: [
          {
            content: 'Pytanie 11',
            answers: [
              {
                content: '1Odpowiedź a',
                isCorrect: false,
              },
              {
                content: '1Odpowiedź b',
                isCorrect: false,
              },
              {
                content: '1Odpowiedź c',
                isCorrect: true,
              },
              {
                content: '1Odpowiedź d',
                isCorrect: false,
              },
            ],
          },
          {
            content: 'Pytanie 12',
            answers: [
              {
                content: '1O1dpowiedź a',
                isCorrect: false,
              },
              {
                content: '1O1dpowiedź b',
                isCorrect: true,
              },
              {
                content: '1O1dpowiedź c',
                isCorrect: false,
              },
              {
                content: '1O1dpowiedź d',
                isCorrect: false,
              },
            ],
          },
          {
            content: 'Pytanie 13',
            answers: [
              {
                content: '1O2dpowiedź a',
                isCorrect: false,
              },
              {
                content: '1O2dpowiedź b',
                isCorrect: false,
              },
              {
                content: '1O2dpowiedź c',
                isCorrect: false,
              },
              {
                content: '1O2dpowiedź d',
                isCorrect: true,
              },
            ],
          },
        ],
      },
    ];
  }
}

import { Injectable } from '@angular/core';
import { QuestionBaseData } from '../../common/models/questionBaseData';
import { Question } from '../../common/models/question';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class QuestionBaseService {
  getUserQuestionBasesData(): QuestionBaseData[] {
    return [
      {
        name: 'Baza pytań 1',
        questionCount: 3,
        id: 'fac1a691-6ae4-45d5-a4d6-797e7a3540ac',
      },
      {
        name: 'Baza pytań 2',
        questionCount: 5,
        id: 'e03fdc2f-fddd-4c54-a865-ea9f3311c553',
      },
    ];
  }

  createUserQuestionBase(name: string): void {
    return;
  }

  editQuestionBaseName(name: string, questionBaseId: string): void {
    return;
  }

  removeQuestionBase(questionBaseId: string): void {
    return;
  }

  getQuestionsFromUserQuestionBase(questionBaseId: string): Question[] | null {
    if (questionBaseId == 'fac1a691-6ae4-45d5-a4d6-797e7a3540ac') {
      return [
        {
          content: 'Pytanie 1',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz a',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz b',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz c',
              isCorrect: true,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 2',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz a1',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz b1',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz c1',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz d1',
              isCorrect: false,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 3',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz a2',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz b2',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz c2',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz d2',
              isCorrect: false,
              id: uuidv4(),
            },
          ],
        },
      ];
    }

    if (questionBaseId == 'e03fdc2f-fddd-4c54-a865-ea9f3311c553') {
      return [
        {
          content: 'Pytanie 11',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz 1a',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1b',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1c',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1d',
              isCorrect: false,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 12',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz 1a1',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1b1',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1c1',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1d1',
              isCorrect: false,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 13',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz 1a2',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1b2',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1c2',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1d2',
              isCorrect: true,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 14',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz 1a3',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1b3',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1c3',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1d3',
              isCorrect: false,
              id: uuidv4(),
            },
          ],
        },
        {
          content: 'Pytanie 15',
          id: uuidv4(),
          imageId: null,
          answers: [
            {
              content: 'Odpowiedz 1a4',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1b4',
              isCorrect: true,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1c4',
              isCorrect: false,
              id: uuidv4(),
            },
            {
              content: 'Odpowiedz 1d4',
              isCorrect: true,
              id: uuidv4(),
            },
          ],
        },
      ];
    }

    return null;
  }
}

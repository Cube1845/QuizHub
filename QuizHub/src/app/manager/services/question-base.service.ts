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
          image: null,
          answers: [
            {
              content: 'Odpowiedz a',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz b',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz c',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Pytanie 2',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Odpowiedz a1',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz b1',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz c1',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz d1',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Pytanie 3',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Odpowiedz a2',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz b2',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz c2',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odpowiedz d2',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
      ];
    }

    if (questionBaseId == 'e03fdc2f-fddd-4c54-a865-ea9f3311c553') {
      return [
        {
          content: 'Jakie zwierzę widać na tym obrazku?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Lew',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Tygrys',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Koala',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Jaki jest najwyższy szczyt w Polsce?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Giewont',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Rysy',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Śnieżka',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Kto napisał "Pana Tadeusza"?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Władysław Reymont',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Juliusz Słowacki',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Henryk Sienkiewicz',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Adam Mickiewicz',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Kiedy Polska uzyskała niepodległość?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: '11 listopada 1918',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: '3 maja 1791',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Co jest stolicą Polski?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Kraków',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Gdańsk',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Warszawa',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Jakie jest najdłuższe rzeka w Polsce?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Warta',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Odra',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Wisła',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Bóbr',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Jakie miasto jest znane z Wawelu?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Kraków',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Wrocław',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Co oznacza "Solidarność"?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Partia polityczna',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Grupa muzyczna',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Ruch społeczny i związkowy',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Które z miast w Polsce nie leży nad morzem?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Szczecin',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Warszawa',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Gdańsk',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Gdynia',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Kto był pierwszym królem Polski?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Kazimierz Wielki',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Bolesław Chrobry',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Mieszko I',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
        {
          content: 'Co to jest "żubr" w kontekście Polski?',
          id: uuidv4(),
          image: null,
          answers: [
            {
              content: 'Miasto w Polsce',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Rodzaj piwa',
              isCorrect: false,
              id: uuidv4(),
              image: null,
            },
            {
              content: 'Zwierzę – największy ssak lądowy w Polsce',
              isCorrect: true,
              id: uuidv4(),
              image: null,
            },
          ],
        },
      ];
    }

    return [];
  }
}

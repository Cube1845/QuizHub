import { inject, Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { QuestionBaseData } from '../models/questionBaseData';
import { Question } from '../models/question';
import { QuestionType } from '../enums/questionType';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable, switchMap } from 'rxjs';
import {
  handleResultPatternResponse,
  Result,
} from '../../common/models/result';
import { ToastService } from '../../common/services/toast.service';

type AddQuestionBaseResponse = {
  questionBaseId: string;
};

@Injectable({
  providedIn: 'root',
})
export class QuestionBaseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly toastService = inject(ToastService);

  displayErrorToast(detail: string): void {
    this.toastService.displayToast('error', 'Błąd', detail);
  }

  getUserQuestionBasesData(): Observable<QuestionBaseData[]> {
    return this.http
      .get<Result<QuestionBaseData[]>>(this.apiUrl + '/question-base')
      .pipe(
        handleResultPatternResponse<QuestionBaseData[], QuestionBaseData[]>(
          (value: QuestionBaseData[]) => value,
          (detail: string) => this.displayErrorToast(detail)
        )
      );
  }

  createUserQuestionBase(name: string): Observable<string> {
    const body = {
      name: name,
    };

    return this.http
      .post<Result<AddQuestionBaseResponse>>(
        this.apiUrl + '/question-base',
        body
      )
      .pipe(
        handleResultPatternResponse<AddQuestionBaseResponse, string>(
          (value: AddQuestionBaseResponse) => value.questionBaseId,
          (detail: string) => this.displayErrorToast(detail)
        )
      );
  }

  editQuestionBaseName(
    updatedName: string,
    questionBaseId: string
  ): Observable<boolean> {
    const body = {
      updatedName: updatedName,
      questionBaseId: questionBaseId,
    };

    return this.http.put<Result>(this.apiUrl + '/question-base', body).pipe(
      handleResultPatternResponse<null, boolean>(
        () => true,
        (detail: string) => this.displayErrorToast(detail)
      )
    );
  }

  removeQuestionBase(questionBaseId: string): Observable<boolean> {
    return this.http
      .delete<Result>(this.apiUrl + '/question-base/' + questionBaseId)
      .pipe(
        handleResultPatternResponse<null, boolean>(
          () => true,
          (detail: string) => this.displayErrorToast(detail)
        )
      );
  }

  exportQuestionBaseFile(questionBaseId: string): void {
    return;
  }

  importQuestionBaseFile(file: File): void {
    return;
  }

  // move to question
  getQuestionsFromUserQuestionBase(questionBaseId: string): Question[] | null {
    if (questionBaseId == 'fac1a691-6ae4-45d5-a4d6-797e7a3540ac') {
      return [
        {
          content: 'Pytanie 1',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Odpowiedz a',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz b',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz c',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Pytanie 2',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Odpowiedz a1',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz b1',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz c1',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz d1',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Pytanie 3',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Odpowiedz a2',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz b2',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz c2',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odpowiedz d2',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
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
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Lew',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Tygrys',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Koala',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Jaki jest najwyższy szczyt w Polsce?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Giewont',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Rysy',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Śnieżka',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Kto napisał "Pana Tadeusza"?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Władysław Reymont',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Juliusz Słowacki',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Henryk Sienkiewicz',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Adam Mickiewicz',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Kiedy Polska uzyskała niepodległość?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: '11 listopada 1918',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: '3 maja 1791',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Co jest stolicą Polski?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Kraków',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Gdańsk',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Warszawa',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Jakie jest najdłuższe rzeka w Polsce?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Warta',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Odra',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Wisła',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Bóbr',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Jakie miasto jest znane z Wawelu?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Kraków',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Wrocław',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Co oznacza "Solidarność"?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Partia polityczna',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Grupa muzyczna',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Ruch społeczny i związkowy',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Które z miast w Polsce nie leży nad morzem?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Szczecin',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Warszawa',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Gdańsk',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Gdynia',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Kto był pierwszym królem Polski?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Kazimierz Wielki',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Bolesław Chrobry',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Mieszko I',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
        {
          content: 'Co to jest "żubr" w kontekście Polski?',
          id: uuidv4(),
          questionType: QuestionType.SingleAnswer,
          image: null,
          answers: [
            {
              content: 'Miasto w Polsce',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Rodzaj piwa',
              isCorrect: false,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
            {
              content: 'Zwierzę – największy ssak lądowy w Polsce',
              isCorrect: true,
              id: uuidv4(),
              questionType: QuestionType.SingleAnswer,
              image: null,
            },
          ],
        },
      ];
    }

    return [];
  }
}

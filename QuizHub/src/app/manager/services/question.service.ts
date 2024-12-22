import { Injectable } from '@angular/core';
import { Question } from '../../common/models/question';
import { UndefinedQuestion } from '../../common/models/undefinedQuestion';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  addQuestion(question: UndefinedQuestion): void {}

  editQuestion(question: Question, id: string): void {}

  removeQuestion(id: string): void {}

  searchForQuestions(questionBaseId: string, key: string): void {}
}

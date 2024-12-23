import { Injectable } from '@angular/core';
import { UndefinedQuestion } from '../models/undefinedQuestion';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  addQuestion(question: UndefinedQuestion): void {}

  editQuestion(question: Question, id: string): void {}

  removeQuestion(id: string): void {}

  searchForQuestions(questionBaseId: string, key: string): void {}
}

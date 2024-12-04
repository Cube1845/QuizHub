import { Injectable } from '@angular/core';
import { Question } from '../../common/models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  addQuestion(question: Question): void {}

  editQuestion(question: Question, id: string): void {}

  removeQuestion(id: string): void {}

  searchForQuestions(questionBaseId: string, key: string): void {}
}

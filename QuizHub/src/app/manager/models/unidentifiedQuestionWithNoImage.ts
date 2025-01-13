import { QuestionType } from '../enums/questionType';
import { UnidentifiedAnswerWithNoImage } from './unidentifiedAnswerWithNoImage';

export type UnidentifiedQuestionWithNoImage = {
  content: string;
  answers: UnidentifiedAnswerWithNoImage[];
  questionType: QuestionType;
};

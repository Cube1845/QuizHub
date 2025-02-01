import { QuestionType } from '../../common/enums/questionType';
import { UnidentifiedAnswerWithNoImage } from './unidentifiedAnswerWithNoImage';

export type UnidentifiedQuestionWithNoImage = {
  content: string;
  answers: UnidentifiedAnswerWithNoImage[];
  questionType: QuestionType;
};

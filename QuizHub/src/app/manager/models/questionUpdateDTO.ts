import { ImageEditionState } from '../enums/imageEditionState';
import { AnswerUpdateDTO } from './answerUpdateDTO';
import { Question } from './question';

export type QuestionUpdateDTO = Omit<Question, 'answers'> & {
  answers: AnswerUpdateDTO[];
  imageEditionState: ImageEditionState;
};

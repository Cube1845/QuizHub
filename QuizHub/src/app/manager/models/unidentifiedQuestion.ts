import { QuestionType } from '../enums/questionType';
import { DisplayableImage } from './displayableImage';
import { UnidentifiedAnswer } from './unidentifiedAnswer';

export type UnidentifiedQuestion = {
  content: string;
  answers: UnidentifiedAnswer[];
  image: DisplayableImage | null;
  questionType: QuestionType;
};

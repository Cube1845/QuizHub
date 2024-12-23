import { DisplayableImage } from './displayableImage';
import { UndefinedAnswer } from './undefinedAnswer';

export type UndefinedQuestion = {
  content: string;
  answers: UndefinedAnswer[];
  image: DisplayableImage | null;
};

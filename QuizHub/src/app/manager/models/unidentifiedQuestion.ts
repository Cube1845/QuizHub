import { DisplayableImage } from './displayableImage';
import { UnidentifiedAnswer } from './unidentifiedAnswer';
import { UnidentifiedQuestionWithNoImage } from './unidentifiedQuestionWithNoImage';

export type UnidentifiedQuestion = Omit<
  UnidentifiedQuestionWithNoImage,
  'answers'
> & {
  image: DisplayableImage | null;
  answers: UnidentifiedAnswer[];
};

import { DisplayableImage } from './displayableImage';
import { UnidentifiedAnswerWithNoImage } from './unidentifiedAnswerWithNoImage';

export type UnidentifiedAnswer = UnidentifiedAnswerWithNoImage & {
  image: DisplayableImage | null;
};

import { DisplayableImage } from '../../common/models/displayableImage';
import { UnidentifiedAnswerWithNoImage } from './unidentifiedAnswerWithNoImage';

export type UnidentifiedAnswer = UnidentifiedAnswerWithNoImage & {
  image: DisplayableImage | null;
};

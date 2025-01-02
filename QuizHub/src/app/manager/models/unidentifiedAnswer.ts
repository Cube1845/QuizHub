import { DisplayableImage } from './displayableImage';

export type UnidentifiedAnswer = {
  content: string | null;
  isCorrect: boolean;
  image: DisplayableImage | null;
};

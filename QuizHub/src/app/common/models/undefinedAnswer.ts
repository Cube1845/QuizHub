import { DisplayableImage } from './displayableImage';

export type UndefinedAnswer = {
  content: string | null;
  isCorrect: boolean;
  image: DisplayableImage | null;
};

import { NamedImage } from './namedImage';

export type Answer = {
  content: string;
  isCorrect: boolean;
  image: NamedImage | null;
  id: string;
};

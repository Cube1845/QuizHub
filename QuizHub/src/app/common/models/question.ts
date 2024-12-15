import { Answer } from './answer';
import { NamedImage } from './namedImage';

export type Question = {
  content: string;
  answers: Answer[];
  image: NamedImage | null;
  id: string;
};

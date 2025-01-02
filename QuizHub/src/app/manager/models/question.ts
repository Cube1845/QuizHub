import { Answer } from './answer';
import { UnidentifiedQuestion } from './unidentifiedQuestion';

export type Question = UnidentifiedQuestion & {
  answers: Answer[];
  id: string;
};

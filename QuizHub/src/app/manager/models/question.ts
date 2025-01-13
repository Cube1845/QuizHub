import { Answer } from './answer';
import { UnidentifiedQuestion } from './unidentifiedQuestion';

export type Question = Omit<UnidentifiedQuestion, 'answers'> & {
  answers: Answer[];
  id: string;
};

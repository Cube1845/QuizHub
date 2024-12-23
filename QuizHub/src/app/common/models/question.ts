import { Answer } from './answer';
import { UndefinedQuestion } from './undefinedQuestion';

export type Question = UndefinedQuestion & {
  answers: Answer[];
  id: string;
};

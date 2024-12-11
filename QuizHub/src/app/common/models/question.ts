import { Answer } from './answer';

export type Question = {
  content: string;
  answers: Answer[];
  image: string | null;
  id: string;
};

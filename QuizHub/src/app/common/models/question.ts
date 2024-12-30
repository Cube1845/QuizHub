import { Answer } from './answer';

export type Question = {
  content: string;
  answers: Answer[];
  image: File | null;
  id: string;
};

import { Answer } from './answer';

export type Question = {
  content: string;
  answers: Answer[];
  imageId: string | null;
  id: string;
};

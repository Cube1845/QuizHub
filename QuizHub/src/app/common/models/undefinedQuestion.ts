import { UndefinedAnswer } from './undefinedAnswer';

export type UndefinedQuestion = {
  content: string;
  answers: UndefinedAnswer[];
  image: File | null;
};

import { Answer } from './answer';

export type GetAnswerDTO = Omit<Answer, 'image'> & {
  imageId: string | null;
};

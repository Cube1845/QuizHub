import { GetAnswerDTO } from './getAnswerDto';
import { Question } from './question';

export type GetQuestionDTO = Omit<Omit<Question, 'image'>, 'answers'> & {
  imageId: string | null;
  answers: GetAnswerDTO[];
};

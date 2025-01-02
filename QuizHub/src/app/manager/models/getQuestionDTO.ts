import { ImageResponse } from '../../common/models/imageResponse';
import { GetAnswerDTO } from './getAnswerDto';
import { Question } from './question';

export type GetQuestionDTO = Question & {
  image: ImageResponse;
  answers: GetAnswerDTO[];
};

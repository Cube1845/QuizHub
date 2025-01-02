import { ImageResponse } from '../../common/models/imageResponse';
import { Answer } from './answer';

export type GetAnswerDTO = Answer & {
  image: ImageResponse;
};

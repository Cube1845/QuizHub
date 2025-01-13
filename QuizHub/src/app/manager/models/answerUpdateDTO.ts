import { ImageEditionState } from '../enums/imageEditionState';
import { Answer } from './answer';

export type AnswerUpdateDTO = Answer & {
  imageEditionState: ImageEditionState;
};

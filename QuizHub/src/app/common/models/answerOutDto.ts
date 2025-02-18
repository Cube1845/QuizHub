import { DisplayableImage } from '../../common/models/displayableImage';

export type AnswerOutDto = {
  content: string;
  id: string;
  image: DisplayableImage | null;
  isSelected: boolean;
};

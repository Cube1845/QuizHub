import { DisplayableImage } from '../../common/models/displayableImage';

export type AnswerOutDto = {
  content: string | null;
  id: string;
  image: DisplayableImage | null;
  isSelected: boolean;
};

import { DisplayableImage } from '../../common/models/displayableImage';

export type AnswerInterface = {
  content: string;
  id: string;
  image: DisplayableImage | null;
  isSelected: boolean;
};

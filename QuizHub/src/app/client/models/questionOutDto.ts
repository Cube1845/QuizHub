import { DisplayableImage } from '../../common/models/displayableImage';
import { QuestionType } from '../../common/enums/questionType';
import { AnswerOutDto } from './answerOutDto';

export type QuestionOutDto = {
  content: string;
  questionType: QuestionType;
  id: string;
  image: DisplayableImage | null;
  answers: AnswerOutDto[];
};

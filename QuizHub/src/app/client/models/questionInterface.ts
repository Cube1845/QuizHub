import { DisplayableImage } from '../../common/models/displayableImage';
import { QuestionType } from '../../common/enums/questionType';
import { AnswerInterface } from './answerInterface';

export type QuestionInterface = {
  content: string;
  questionType: QuestionType;
  id: string;
  image: DisplayableImage | null;
  answers: AnswerInterface[];
};

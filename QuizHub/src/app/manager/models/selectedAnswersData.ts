import { AnswerOutDto } from '../../common/models/answerOutDto';
import { QuestionOutDto } from '../../common/models/questionOutDto';

export type SelectedAnswersData = {
  testId: string;
  solveDate: Date;
  durationInSeconds: number;
  username: string;
  earnedPoints: number;
  maxPoints: number;
  usedQuestions: UsedQuestion[];
};

export type UsedQuestion = Omit<QuestionOutDto, 'answers'> & {
  isScored: boolean;
  answers: SelectedAnswer[];
};

export type SelectedAnswer = AnswerOutDto & {
  isCorrect: boolean;
};

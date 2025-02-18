import { QuestionOutDto } from '../../common/models/questionOutDto';

export type SelectedAnswersData = {
  testLogId: string;
  solveDate: Date;
  durationInSeconds: number;
  username: string;
  earnedPoints: number;
  maxPoints: number;
  usedQuestions: UsedQuestion[];
};

export type UsedQuestion = QuestionOutDto & {
  isScored: boolean;
};

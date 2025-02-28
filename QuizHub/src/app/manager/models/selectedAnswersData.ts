import { AnswerOutDto } from '../../common/models/answerOutDto';
import { QuestionOutDto } from '../../common/models/questionOutDto';

export type SelectedAnswersData = {
  testId: string;
  solveDate: Date;
  durationInSeconds: number;
  username: string;
  earnedPoints: number;
  maxPoints: number;
  usedQuestions: (UsedQuestion | null)[];
};

export type UsedQuestion = Omit<Omit<QuestionOutDto, 'answers'>, 'id'> & {
  isScored: boolean;
  answers: SelectedAnswer[];
};

export type SelectedAnswer = Omit<AnswerOutDto, 'id'> & {
  isCorrect: boolean;
};

export type TestOptions = {
  questionCount: number;
  usedQuestionBases: QuestionBasesWithMinimalQuestions[];
  isActive: boolean;
  code: string;
};

export type QuestionBasesWithMinimalQuestions = {
  questionBaseId: string;
  questionBaseName: string;
  minimalQuestionCount: number | null;
};

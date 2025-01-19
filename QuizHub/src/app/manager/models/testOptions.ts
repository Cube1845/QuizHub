export type TestOptions = {
  name: string;
  isActive: boolean;
  code: string;
  questionCount: number;
  usedQuestionBases: QuestionBasesWithMinimalQuestions[];
};

export type QuestionBasesWithMinimalQuestions = {
  questionBaseId: string;
  questionBaseName: string;
  minimalQuestionCount: number | null;
};

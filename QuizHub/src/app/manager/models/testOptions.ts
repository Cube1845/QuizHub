export type TestOptions = {
  questionCount: number;
  usedQuestionBases: QuestionBasesWithMinimalQuestions[];
};

export type QuestionBasesWithMinimalQuestions = {
  questionBaseId: string;
  questionBaseName: string;
  minimalQuestionCount: number | null;
};

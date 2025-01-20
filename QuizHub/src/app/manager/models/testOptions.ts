export type TestOptions = {
  name: string;
  questionCount: number;
  usedQuestionBases: QuestionBasesWithMinimalQuestions[];
};

export type QuestionBasesWithMinimalQuestions = {
  questionBaseId: string;
  questionBaseName: string;
  minimalQuestionCount: number | null;
};

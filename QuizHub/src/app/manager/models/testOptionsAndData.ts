import { QuestionBaseData } from './questionBaseData';
import { TestOptions } from './testOptions';

export type TestOptionsAndData = {
  testOptions: TestOptions;
  code: string;
  isActive: boolean;
  name: string;
  userQuestionBases: QuestionBaseData[];
};

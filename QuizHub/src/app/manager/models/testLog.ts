import { PaginatedData } from "../../common/models/paginatedData";

export type TestLogData = {
  testLogs: PaginatedData<TestLog>;
  testName: string;
};

export type TestLog = {
  id: string;
  durationInSeconds: number;
  solveDate: Date;
  username: string;
  earnedPoints: number;
  maxPoints: number;
};

export type TestLogData = {
  testLogs: TestLog[];
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

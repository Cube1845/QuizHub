import { Injectable } from '@angular/core';
import { TestLog } from '../models/testLog';

@Injectable({
  providedIn: 'root',
})
export class TestLogsService {
  getTestLogs(): TestLog[] {
    return [
      {
        id: 'awdawdagae',
        durationInSeconds: 200,
        username: 'awaseggawg',
        earnedPoints: 5,
        maxPoints: 10,
        solveDate: new Date(),
      },
      {
        id: 'awdhthhdtae',
        durationInSeconds: 150,
        username: 'tasergdjg',
        earnedPoints: 6,
        maxPoints: 11,
        solveDate: new Date(),
      },
      {
        id: 'awdaw5dagae',
        durationInSeconds: 200,
        username: 'awgawgawg',
        earnedPoints: 4,
        maxPoints: 10,
        solveDate: new Date(),
      },
      {
        id: 'awdh1thhdtae',
        durationInSeconds: 150,
        username: 'tdgawgjg',
        earnedPoints: 6,
        maxPoints: 11,
        solveDate: new Date(),
      },
      {
        id: 'awda2wdagae',
        durationInSeconds: 200,
        username: 'awgasegasegawg',
        earnedPoints: 1,
        maxPoints: 10,
        solveDate: new Date(),
      },
      {
        id: 'aw23dhthhdtae',
        durationInSeconds: 150,
        username: 'tdjasegg',
        earnedPoints: 2,
        maxPoints: 11,
        solveDate: new Date(),
      },
    ];
  }
}

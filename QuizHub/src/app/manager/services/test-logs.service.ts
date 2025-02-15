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
        username: 'awgawg',
        earnedPoints: 5,
        maxPoints: 10,
      },
      {
        id: 'awdhthhdtae',
        durationInSeconds: 150,
        username: 'tdjg',
        earnedPoints: 6,
        maxPoints: 11,
      },
    ];
  }
}

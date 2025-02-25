import { Injectable } from '@angular/core';
import { TestHistoryData } from '../models/testHistoryData';

@Injectable({
  providedIn: 'root',
})
export class TestHistoryService {
  getTestHistoriesNames(): TestHistoryData[] {
    //api call

    return [
      {
        testId: 'awdawdawda',
        testName: 'Testowy test',
        solveCount: 6,
      },
    ];
  }
}

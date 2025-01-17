import { Injectable } from '@angular/core';
import { TestData } from '../models/testData';

@Injectable({
  providedIn: 'root',
})
export class TestCreatorService {
  //for now hard coded data
  getUserTests(): TestData[] {
    return [
      {
        name: 'Test 1',
        code: '4e6JkIet',
        id: 'dadadadada-dadada-dadada',
      },
    ];
  }
}

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
        isActive: false,
        id: '8c5dcda0-dc44-4f79-a6d9-08dd37007596',
      },
    ];
  }
}

import { Component, inject } from '@angular/core';
import { TestHistoryService } from '../../../../services/test-history.service';
import { TestHistoryData } from '../../../../models/testHistoryData';
import { PolishWordVariationService } from '../../../../services/polish-word-variation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-history',
  standalone: true,
  imports: [],
  templateUrl: './test-history.component.html',
  styleUrl: './test-history.component.scss',
})
export class TestHistoryComponent {
  private readonly testHistoryService = inject(TestHistoryService);
  private readonly polishWordVariation = inject(PolishWordVariationService);
  private readonly router = inject(Router);

  testHistoryDatas!: TestHistoryData[] | null;

  constructor() {
    this.testHistoryDatas = this.testHistoryService.getTestHistoriesNames();
  }

  getSolveWordVariation(solveCount: number): string {
    return this.polishWordVariation.getSolveWordVariation(solveCount);
  }

  goToTestLogs(clickedIndex: number): void {
    this.router.navigateByUrl(
      'manager/test-logs/' + this.testHistoryDatas![clickedIndex].testId
    );
  }
}

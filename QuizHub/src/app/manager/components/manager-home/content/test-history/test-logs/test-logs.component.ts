import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TestLogsService } from '../../../../../services/test-logs.service';
import { TestLog } from '../../../../../models/testLog';
import { convertTimeInSecondsToTimeString } from '../../../../../../common/global-functions';
import { DatePipe } from '@angular/common';
import { PaginatorOptions } from '../../../../../models/paginatorOptions';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-test-logs',
  standalone: true,
  imports: [ButtonModule, InputTextModule, DatePipe, PaginatorModule],
  templateUrl: './test-logs.component.html',
  styleUrl: './test-logs.component.scss',
})
export class TestLogsComponent {
  private readonly router = inject(Router);
  private readonly testLogsService = inject(TestLogsService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly paginatorItemsPerPage = [60, 90, 120];

  logsGetType: 'regular' | 'searched' = 'regular';

  testName!: string | null;

  testLogs!: TestLog[] | null;

  testId!: string | null;

  paginatorOptions: PaginatorOptions = new PaginatorOptions(
    1,
    this.paginatorItemsPerPage[0],
    0,
    this.paginatorItemsPerPage,
    () => this.getTestLogsAndSetThem(1)
  );

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id == null) {
        return;
      }

      this.testId = id;

      this.getTestLogsAndSetThem(1);
    });
  }

  openSelectedAnswersDisplay(index: number): void {
    this.router.navigateByUrl(
      'manager/selected-answers-display/' + this.testLogs![index].id
    );
  }

  getTestLogsAndSetThem(pageNumber: number): void {
    const testLogData = this.testLogsService.getTestLogData(this.testId!);

    this.logsGetType = 'regular';

    this.testLogs = testLogData.testLogs;
    this.paginatorOptions.totalItems = testLogData.testLogs.length;
    this.testName = testLogData.testName;
  }

  goBack(): void {
    this.router.navigateByUrl('manager/test-history');
  }

  convertTimeInSecondsToTimeString(totalSeconds: number): string {
    return convertTimeInSecondsToTimeString(totalSeconds);
  }

  searchForTestLogs(pageNumber: number = 1): void {}

  onPageChange(event: any): void {
    const pageNumber = event.page + 1;

    this.logsGetType == 'regular'
      ? this.getTestLogsAndSetThem(pageNumber)
      : this.searchForTestLogs(pageNumber);

    this.paginatorOptions.setPage(pageNumber);
  }
}

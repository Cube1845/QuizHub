import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TestLogsService } from '../../../../../services/test-logs.service';
import { TestLog } from '../../../../../models/testLog';
import { convertTimeInSecondsToTimeString } from '../../../../../../common/globalFunctions';
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

  private readonly paginatorItemsPerPage = [60, 90, 120];

  logsGetType: 'regular' | 'searched' = 'regular';

  testName!: string | null;

  $rowIndex = 0;

  testLogs!: TestLog[] | null;

  paginatorOptions: PaginatorOptions = new PaginatorOptions(
    1,
    this.paginatorItemsPerPage[0],
    0,
    this.paginatorItemsPerPage,
    () => this.getTestLogsAndSetThem(1)
  );

  constructor() {
    this.getTestLogsAndSetThem(1);
  }

  getTestLogsAndSetThem(pageNumber: number): void {
    const testLogs = this.testLogsService.getTestLogs();

    this.logsGetType = 'regular';

    this.testLogs = testLogs;
    this.paginatorOptions.totalItems = testLogs.length;
    this.testName = 'Test';
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

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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlobalDialogService } from '../../../../../../common/services/global-dialog.service';
import { SpinnerComponent } from '../../../../../../common/components/spinner/spinner.component';

@Component({
  selector: 'app-test-logs',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    DatePipe,
    PaginatorModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './test-logs.component.html',
  styleUrl: './test-logs.component.scss',
})
export class TestLogsComponent {
  private readonly router = inject(Router);
  private readonly testLogsService = inject(TestLogsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly globalDialogService = inject(GlobalDialogService);

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

  searchFormControl = new FormControl<string>('');

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
    this.testLogsService
      .getTestLogData(this.testId!, pageNumber, this.paginatorOptions.rows)
      .subscribe((response) => {
        if (!!response) {
          this.searchFormControl.reset();
          this.logsGetType = 'regular';

          this.testLogs = response.testLogs.data;
          this.paginatorOptions.totalItems = response.testLogs.totalItems;
          this.testName = response.testName;
        }
      });
  }

  goBack(): void {
    this.router.navigateByUrl('manager/test-history');
  }

  convertTimeInSecondsToTimeString(totalSeconds: number): string {
    return convertTimeInSecondsToTimeString(totalSeconds);
  }

  searchForTestLogs(pageNumber: number = 1): void {
    const key = this.searchFormControl.value;

    if (key == null || key!.trim() == '') {
      this.paginatorOptions.setPage(1);
      this.getTestLogsAndSetThem(1);
      return;
    }

    this.testLogsService
      .searchForTestLogs(
        this.testId!,
        key!,
        pageNumber,
        this.paginatorOptions.rows
      )
      .subscribe((response) => {
        if (!!response) {
          this.logsGetType = 'searched';
          this.testLogs = response.data;
          this.paginatorOptions.totalItems = response.totalItems;
        }
      });
  }

  goToTestSettings(): void {
    this.router.navigateByUrl('manager/test-edit/' + this.testId);
  }

  displayClearLogsConfirmation(): void {
    this.globalDialogService.displayConfirmationDialog(
      'Czy na pewno chcesz wyczyścić wszystkie rozwiązania tego testu?',
      () => this.clearTestLogs()
    );
  }

  clearTestLogs(): void {
    this.testLogsService.clearTestLogs(this.testId!).subscribe((isSuccess) => {
      if (isSuccess) {
        this.router.navigateByUrl('manager/test-history');
      }
    });
  }

  displayDeleteLogConfirmation(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService.displayConfirmationDialog(
      'Czy na pewno chcesz usunąć to rozwiązanie testu z historii?',
      () => this.deleteTestLog(index)
    );
  }

  deleteTestLog(index: number): void {
    this.testLogsService
      .deleteTestLog(this.testId!, this.testLogs![index].id)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.testLogs!.splice(index, 1);
          this.paginatorOptions!.totalItems--;
        }
      });
  }

  onPageChange(event: any): void {
    const pageNumber = event.page + 1;

    this.logsGetType == 'regular'
      ? this.getTestLogsAndSetThem(pageNumber)
      : this.searchForTestLogs(pageNumber);

    this.paginatorOptions.setPage(pageNumber);
  }
}

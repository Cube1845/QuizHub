import { Component, inject } from '@angular/core';
import { TestData } from '../../../../models/testData';
import { TestCreatorService } from '../../../../services/test-creator.service';
import { SpinnerComponent } from '../../../../../common/components/spinner/spinner.component';
import { Router } from '@angular/router';
import { GlobalDialogService } from '../../../../../common/services/global-dialog.service';
import { ToastService } from '../../../../../common/services/toast.service';
import { NameEditDialogComponent } from '../../../../../common/components/name-edit-dialog/name-edit-dialog.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-test-creator',
  standalone: true,
  imports: [SpinnerComponent, TooltipModule],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.scss',
})
export class TestCreatorComponent {
  private readonly testCreatorService = inject(TestCreatorService);
  private readonly router = inject(Router);
  private readonly globalDialogService = inject(GlobalDialogService);
  private readonly toastService = inject(ToastService);

  tests: TestData[] | null = null;

  constructor() {
    this.testCreatorService
      .getUserTests()
      .subscribe((response) => (this.tests = response));
  }

  goToTestEditor(testId: string) {
    this.router.navigateByUrl('manager/test-edit/' + testId);
  }

  displayTestNameEditDialog(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Edytuj nazwę testu',
        width: '25rem',
        modal: true,
        data: { index: index, currentName: this.tests![index].name },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveTestName(result.name, result.itemIndex);
        }
      });
  }

  copyCode(index: number, event: Event): void {
    event.stopPropagation();

    navigator.clipboard
      .writeText(this.tests![index].code)
      .then(() =>
        this.toastService.displayToast(
          'success',
          'Sukces',
          'Skopiowano kod testu'
        )
      );
  }

  displayTestCreatingDialog(): void {
    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Dodaj test',
        width: '25rem',
        modal: true,
      })
      .subscribe((result) => {
        if (result != null) {
          this.createTest(result);
        }
      });
  }

  displayTestRemovalModal(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz usunąć ten test?',
      () => this.removeTest(index)
    );
  }

  removeTest(index: number): void {
    this.testCreatorService
      .removeTest(this.tests![index].id)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.tests!.splice(index, 1);
          this.toastService.displayToast('success', 'Sukces', 'Usunięto test');
        }
      });
  }

  createTest(name: string): void {
    this.testCreatorService
      .createTest(name)
      .subscribe((newId) =>
        this.router.navigateByUrl('manager/test-edit/' + newId)
      );
  }

  saveTestName(updatedName: string, testIndex: number): void {
    if (updatedName == this.tests![testIndex].name) {
      return;
    }

    this.testCreatorService
      .editTestName(updatedName, this.tests![testIndex].id)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.tests![testIndex].name = updatedName;
          this.toastService.displayToast('success', 'Sukces', 'Zapisano nazwę');
        }
      });
  }
}

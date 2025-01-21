import { Component, inject } from '@angular/core';
import { TestData } from '../../../../models/testData';
import { TestCreatorService } from '../../../../services/test-creator.service';
import { SpinnerComponent } from '../../../../../common/components/spinner/spinner.component';
import { Router } from '@angular/router';
import { GlobalDialogService } from '../../../../../common/services/global-dialog.service';
import { TestNameEditDialogComponent } from './test-edit/test-name-edit-dialog/test-name-edit-dialog.component';
import { ToastService } from '../../../../../common/services/toast.service';

@Component({
  selector: 'app-test-creator',
  standalone: true,
  imports: [SpinnerComponent],
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
    this.tests = this.testCreatorService.getUserTests();
  }

  goToTestEditor(testId: string) {
    this.router.navigateByUrl('manager/test-edit/' + testId);
  }

  displayTestNameEditDialog(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService
      .displayDialog(TestNameEditDialogComponent, {
        header: 'Edytuj nazwę testu',
        width: '25rem',
        modal: true,
        data: { index: index, currentName: this.tests![index].name },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveTestName(result.name, result.testIndex);
        }
      });
  }

  displayTestCreatingDialog(): void {
    this.globalDialogService
      .displayDialog(TestNameEditDialogComponent, {
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

    this.globalDialogService.displayConfirmationDialog({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć ten test?',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.removeTest(index),
    });
  }

  removeTest(index: number): void {
    this.testCreatorService.removeTest(this.tests![index].id);
    //after api merging
    // .subscribe((isSuccess) => {
    //   if (isSuccess) {
    //     this.tests?.splice(index, 1);
    //     this.toastService.displayToast(
    //       'success',
    //       'Sukces',
    //       'Usunięto test'
    //     );
    //   }
    // });

    this.tests?.splice(index, 1);
    this.toastService.displayToast('success', 'Sukces', 'Usunięto test');
  }

  createTest(name: string): void {
    this.testCreatorService.createTest(name);
    //after api merging
    // .subscribe((newId) =>
    //   this.router.navigateByUrl('manager/test-edit/' + newId)
    // );

    this.router.navigateByUrl('manager/test-edit/' + 'xd');
  }

  saveTestName(updatedName: string, testIndex: number): void {
    if (updatedName == this.tests![testIndex].name) {
      return;
    }

    this.testCreatorService.editTestName(
      updatedName,
      this.tests![testIndex].id
    );
    // after api merging
    // .subscribe((isSuccess) => {
    //   if (isSuccess) {
    //     this.tests![testIndex].name = updatedName;
    //     this.toastService.displayToast('success', 'Sukces', 'Zapisano nazwę');
    //   }
    // });

    this.tests![testIndex].name = updatedName;
    this.toastService.displayToast('success', 'Sukces', 'Zapisano nazwę');
  }
}

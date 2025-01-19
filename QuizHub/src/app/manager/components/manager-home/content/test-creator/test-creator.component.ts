import { Component, inject } from '@angular/core';
import { TestData } from '../../../../models/testData';
import { TestCreatorService } from '../../../../services/test-creator.service';
import { SpinnerComponent } from '../../../../../common/components/spinner/spinner.component';
import { Router } from '@angular/router';

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

  tests: TestData[] | null = null;

  constructor() {
    this.tests = this.testCreatorService.getUserTests();
  }

  goToTestEditor(testId: string) {
    this.router.navigateByUrl('manager/test-edit/' + testId);
  }
}

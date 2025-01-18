import { Component, inject } from '@angular/core';
import { TestData } from '../../../../models/testData';
import { TestCreatorService } from '../../../../services/test-creator.service';
import { SpinnerComponent } from '../../../../../common/components/spinner/spinner.component';

@Component({
  selector: 'app-test-creator',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.scss',
})
export class TestCreatorComponent {
  private readonly testCreatorService = inject(TestCreatorService);

  tests: TestData[] | null = null;

  constructor() {
    this.tests = this.testCreatorService.getUserTests();
  }
}

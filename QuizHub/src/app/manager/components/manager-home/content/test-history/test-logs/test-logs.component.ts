import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TestLogsService } from '../../../../../services/test-logs.service';
import { TestLog } from '../../../../../models/testLog';
import { splitArrayIntoChunks } from '../../../../../../common/globalFunctions';

@Component({
  selector: 'app-test-logs',
  standalone: true,
  imports: [ButtonModule, InputTextModule],
  templateUrl: './test-logs.component.html',
  styleUrl: './test-logs.component.scss',
})
export class TestLogsComponent {
  private readonly router = inject(Router);
  private readonly testLogsService = inject(TestLogsService);

  $rowIndex = 0;

  testLogs!: TestLog[] | null;

  constructor() {
    this.testLogs = this.testLogsService.getTestLogs();
  }

  getTestLogsRows(): TestLog[][] {
    return splitArrayIntoChunks(this.testLogs!, 3);
  }

  goBack(): void {
    this.router.navigateByUrl('manager/test-history');
  }
}

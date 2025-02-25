import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestClientService } from '../../services/test-client.service';
import { TestResult } from '../../models/testResult';
import { ButtonModule } from 'primeng/button';
import { convertTimeInSecondsToTimeString } from '../../../common/global-functions';

@Component({
  selector: 'app-client-test-finish',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './client-test-finish.component.html',
  styleUrl: './client-test-finish.component.scss',
})
export class ClientTestFinishComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly testClientService = inject(TestClientService);
  private readonly router = inject(Router);

  result: TestResult | null = null;

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id == null) {
        return;
      }

      const testLogId = id;
      this.testClientService.getTestResult(testLogId!).subscribe((value) => {
        if (value) {
          this.result = value;
        }
      });
    });
  }

  return(): void {
    this.router.navigateByUrl('start');
  }

  getScorePercentage(earned: number, max: number): string {
    return ((earned / max) * 100).toFixed(2);
  }

  convertTimeInSecondsToTimeString(totalSeconds: number): string {
    return convertTimeInSecondsToTimeString(totalSeconds);
  }
}

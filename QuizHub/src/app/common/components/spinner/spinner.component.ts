import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule, NgStyle],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  @Input() spinnerSize: number = 120;
  @Input() spinnerWidth: number = 3;

  loading: boolean = false;

  constructor() {
    setTimeout(() => {
      this.loading = true;
    }, environment.minimalLoadingTimeSpinner);
  }
}

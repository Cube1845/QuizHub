import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastData } from './common/models/toastData';
import { ToastService } from './common/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent {
  private readonly messageService = inject(MessageService);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.toastService.onToast$
      .pipe(takeUntilDestroyed())
      .subscribe((options) => {
        this.displayToast(options);
      });
  }

  displayToast(options: ToastData): void {
    this.messageService.add(options);
  }
}

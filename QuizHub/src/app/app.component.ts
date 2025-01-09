import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastData } from './common/models/toastData';
import { ToastService } from './common/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { GlobalDialogService } from './common/services/global-dialog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class AppComponent {
  private readonly messageService = inject(MessageService);
  private readonly toastService = inject(ToastService);

  private readonly globalDialogService = inject(GlobalDialogService);
  private readonly confirmationService = inject(ConfirmationService);

  constructor() {
    this.toastService.onToast$
      .pipe(takeUntilDestroyed())
      .subscribe((options) => this.displayToast(options));

    this.globalDialogService.onConfirmationDialog$
      .pipe(takeUntilDestroyed())
      .subscribe((options) => this.displayConfirmationDialog(options));
  }

  displayToast(options: ToastData): void {
    this.messageService.add(options);
  }

  displayConfirmationDialog(confirmation: Confirmation): void {
    this.confirmationService.confirm(confirmation);
  }
}

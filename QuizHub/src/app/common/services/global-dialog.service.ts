import { inject, Injectable, Type } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { DialogConfig } from '../models/dialogConfig';
import { Confirmation } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class GlobalDialogService {
  private dialogSubject = new Subject<DialogConfig<any>>();
  onDialog$ = this.dialogSubject.asObservable();

  private confirmationDialogSubject = new Subject<Confirmation>();
  onConfirmationDialog$ = this.confirmationDialogSubject.asObservable();

  private readonly dialogService = inject(DialogService);

  ref: DynamicDialogRef | undefined;

  displayDialog<T>(
    type: Type<T>,
    config: DynamicDialogConfig
  ): Observable<any> {
    const ref = this.dialogService.open(type, config);
    return ref.onClose;
  }

  displayConfirmationDialog(confirmation: Confirmation): void {
    this.confirmationDialogSubject.next(confirmation);
  }
}

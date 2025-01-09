import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastData } from '../models/toastData';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastData>();
  onToast$ = this.toastSubject.asObservable();

  displayToast(
    severity: 'success' | 'error',
    summary: string,
    detail: string,
    lifeTime: number = 3000
  ): void {
    const options: ToastData = {
      severity: severity,
      summary: summary,
      detail: detail,
      life: lifeTime,
    };

    this.toastSubject.next(options);
  }
}

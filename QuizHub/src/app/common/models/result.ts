import { inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ToastService } from '../services/toast.service';

export class Result<T = null> {
  value!: T;
  isSuccess!: boolean;
  message?: string;
}

export function isResult<T>(obj: any): obj is Result<T> {
  return obj && typeof obj.isSuccess === 'boolean';
}

export function handleResultPatternResponse<T, U>(
  successHandlingFunction: (value: T) => U,
  errorHandlingFunction: (message: string) => void
) {
  return (source: Observable<Result<T>>): Observable<U> =>
    source.pipe(
      catchError((err) => of(err)),
      map((result: Result<T>) => {
        if (result.isSuccess) {
          return successHandlingFunction(result.value);
        } else {
          errorHandlingFunction(result.message!);
          return null as U;
        }
      })
    );
}

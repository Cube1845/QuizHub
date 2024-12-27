export class Result<T = null> {
  value!: T;
  isSuccess!: boolean;
  message?: string;
}

export function isResult<T>(obj: any): obj is Result<T> {
  return obj && typeof obj.isSuccess === 'boolean';
}

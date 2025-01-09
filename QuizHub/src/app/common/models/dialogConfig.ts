import { Type } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

export type DialogConfig<T> = {
  type: Type<T>;
  config: DynamicDialogConfig;
};

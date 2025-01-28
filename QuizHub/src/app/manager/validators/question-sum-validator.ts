import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function questionSumValidator(
  group: AbstractControl
): ValidationErrors | null {
  const questionCount = group.get('questionCount')?.value;
  const minimalQuestionCountsArray = group.get(
    'minimalQuestionCounts'
  ) as FormArray;

  if (questionCount === undefined || minimalQuestionCountsArray === undefined) {
    return null;
  }

  const sum = minimalQuestionCountsArray.controls.reduce((total, control) => {
    const value = control.value;
    return value !== null ? total + value : total;
  }, 0);

  return sum > questionCount ? { sumExceedsQuestionCount: true } : null;
}

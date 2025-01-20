import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

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

  let sum = 0;
  minimalQuestionCountsArray.controls.forEach((control) => {
    const value = control.value;
    if (value !== null) {
      sum += value;
    }
  });

  return sum > questionCount ? { sumExceedsQuestionCount: true } : null;
}

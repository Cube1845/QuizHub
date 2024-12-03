import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function requireOneSelectedAnswerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const hasAtLeastOneTrue = Object.values(control.controls).some(
      (ctrl) => ctrl.value === true
    );

    return hasAtLeastOneTrue ? null : { atLeastOneTrue: true };
  };
}

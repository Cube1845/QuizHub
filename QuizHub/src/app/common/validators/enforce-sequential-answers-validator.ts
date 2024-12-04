import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export function enforceSequentialAnswersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null; // Only works on FormGroup
    }

    const controls = Object.values(control.controls);
    let lastNonEmptyIndex = -1;

    for (let i = 0; i < controls.length; i++) {
      const currentControl = controls[i];

      if (currentControl.value && lastNonEmptyIndex < i - 1) {
        return {
          sequentialViolation: `Answer ${i} is set but Answer ${
            i - 1
          } is empty.`,
        };
      }

      if (currentControl.value) {
        lastNonEmptyIndex = i;
      }
    }

    return null;
  };
}

import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export function requireFirstTwoAnswersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const answers = control.get('answers') as FormGroup;
    const answerImages = control.get('answerImages') as FormGroup;

    if (!answers || !answerImages) {
      return null;
    }

    const answer0 = answers.get('0')?.value;
    const answer1 = answers.get('1')?.value;

    const answerImage0 = answerImages.get('0')?.value;
    const answerImage1 = answerImages.get('1')?.value;

    const isFirstValid = answer0?.trim() || answerImage0;
    const isSecondValid = answer1?.trim() || answerImage1;

    if (!isFirstValid || !isSecondValid) {
      return { requireFirstTwoAnswers: true };
    }

    return null;
  };
}

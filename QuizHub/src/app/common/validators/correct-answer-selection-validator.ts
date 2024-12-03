import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function correctAnswerSelectionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const answers = control.get('answers') as FormGroup;
    const correctAnswers = control.get('correctAnswers') as FormGroup;

    if (!answers || !correctAnswers) {
      return null;
    }

    const errors: ValidationErrors = {};

    Object.keys(correctAnswers.controls).forEach((key) => {
      const correctAnswer = correctAnswers.get(key);
      const answer = answers.get(key);

      if (
        correctAnswer?.value &&
        (!answer || answer.invalid || !answer.value)
      ) {
        errors[`invalidCorrectAnswer${key}`] = true;
      }
    });

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

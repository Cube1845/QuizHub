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
    const answerImages = control.get('answerImages') as FormGroup;

    if (!answers || !correctAnswers || !answerImages) {
      return null;
    }

    const errors: ValidationErrors = {};

    Object.keys(correctAnswers.controls).forEach((key) => {
      const correctAnswer = correctAnswers.get(key);
      const answer = answers.get(key);
      const answerImage = answerImages.get(key);

      if (
        correctAnswer?.value &&
        (!answer || !answer.value.trim()) &&
        (!answerImage || !answerImage.value)
      ) {
        errors[`invalidCorrectAnswer${key}`] = true;
      }
    });

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

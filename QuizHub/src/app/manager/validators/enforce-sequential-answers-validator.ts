import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export function enforceSequentialAnswersValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!(formGroup instanceof FormGroup)) {
      throw new Error('sequentialAnswerValidator must be used on a FormGroup');
    }

    const answers = formGroup.get('answers') as FormGroup;
    const answerImages = formGroup.get('answerImages') as FormGroup;

    if (!answers || !answerImages) {
      return null;
    }

    const answerKeys = Object.keys(answers.controls);
    const imageKeys = Object.keys(answerImages.controls);

    for (let i = 1; i < answerKeys.length; i++) {
      const prevAnswer = answers.get(answerKeys[i - 1])?.value;
      const prevImage = answerImages.get(imageKeys[i - 1])?.value;

      const currentAnswer = answers.get(answerKeys[i])?.value;
      const currentImage = answerImages.get(imageKeys[i])?.value;

      if ((currentAnswer || currentImage) && !(prevAnswer || prevImage)) {
        return { sequentialInvalid: true };
      }
    }

    return null;
  };
}

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../../../../../common/models/question';
import { QuestionBaseService } from '../../../../../services/question-base.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { requireOneSelectedAnswerValidator } from '../../../../../../common/validators/require-one-selected-answer-validator';
import { correctAnswerSelectionValidator } from '../../../../../../common/validators/correct-answer-selection-validator';
import { QuestionService } from '../../../../../services/question.service';
import { Answer } from '../../../../../../common/models/answer';
import { enforceSequentialAnswersValidator } from '../../../../../../common/validators/enforce-sequential-answers-validator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FileUpload } from 'primeng/fileupload';
import { Image } from 'primeng/image';
import { environment } from '../../../../../../../environments/environment.development';
import { NamedImage } from '../../../../../../common/models/namedImage';

@Component({
  selector: 'app-question-base-edit',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule,
    FileUpload,
    Image,
  ],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class QuestionBaseEditComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  questionBaseService = inject(QuestionBaseService);
  questionService = inject(QuestionService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  router = inject(Router);

  readonly maxImageSize = environment.maxImageSize;

  questionBaseId: string | null = null;

  questionDialogVisible: boolean = false;
  currentEditedQuestionIndex: number = -1;

  imagePreviewVisible: boolean = false;

  temporaryContentImage: NamedImage | null = null;

  questions: Question[] | null = null;

  questionFormGroup = new FormGroup(
    {
      content: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      answers: new FormGroup(
        [
          new FormControl<string>('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          new FormControl<string>('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          new FormControl<string>('', Validators.minLength(3)),
          new FormControl<string>('', Validators.minLength(3)),
        ],
        enforceSequentialAnswersValidator()
      ),
      correctAnswers: new FormGroup(
        [
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
          new FormControl<boolean>(false),
        ],
        requireOneSelectedAnswerValidator()
      ),
    },
    correctAnswerSelectionValidator()
  );

  searchFormControl = new FormControl<string>('', Validators.required);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.questionBaseId = paramMap.get('id');

      this.questions =
        this.questionBaseService.getQuestionsFromUserQuestionBase(
          this.questionBaseId!
        );
    });
  }

  goBack(): void {
    this.router.navigateByUrl('manager/question-bases');
  }

  searchForQuestions(): void {
    this.questionService.searchForQuestions(
      this.questionBaseId!,
      this.searchFormControl.value!
    );
  }

  getDialogHeader(): string {
    if (this.currentEditedQuestionIndex >= 0) {
      return 'Edytuj pytanie';
    }

    return 'Dodaj pytanie';
  }

  previewRawImage(imageString: string, event: Event): void {
    event.stopPropagation();
    this.imagePreviewVisible = true;
  }

  openQuestionEditor(index: number) {
    var answerValues = this.questions![index].answers.map(
      (answer) => answer.content
    );

    while (answerValues.length < 4) {
      answerValues.push('');
    }

    var correctAnswers = this.questions![index].answers.map(
      (answer) => answer.isCorrect
    );

    while (correctAnswers.length < 4) {
      correctAnswers.push(false);
    }

    this.questionFormGroup.setValue({
      content: this.questions![index].content,
      answers: [
        answerValues[0],
        answerValues[1],
        answerValues[2],
        answerValues[3],
      ],
      correctAnswers: [
        correctAnswers[0],
        correctAnswers[1],
        correctAnswers[2],
        correctAnswers[3],
      ],
    });
    this.questionDialogVisible = true;
  }

  private resizeImage(
    base64String: string,
    targetHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetWidth = targetHeight * aspectRatio;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const resizedBase64 = canvas.toDataURL('image/png');
        resolve(resizedBase64);
      };
      img.onerror = (error) => reject(new Error(`Image load error: ${error}`));

      img.src = base64String;
    });
  }

  getContentImageFileUploaderText(): string {
    const defaultString = 'Wybierz obraz';

    if (
      this.questions == null ||
      this.questions.length == 0 ||
      this.currentEditedQuestionIndex == -1
    ) {
      return defaultString;
    }

    if (
      this.questions![this.currentEditedQuestionIndex].image == null &&
      (this.temporaryContentImage == null ||
        this.temporaryContentImage.imageBase64 == '')
    ) {
      return defaultString;
    }

    if (
      this.temporaryContentImage != null &&
      this.temporaryContentImage.imageBase64 == ''
    ) {
      return defaultString;
    }

    if (this.temporaryContentImage != null) {
      return this.temporaryContentImage!.imageName;
    }

    return this.questions![this.currentEditedQuestionIndex].image!.imageName;
  }

  handleSelectedContentImage(event: any): void {
    const file: File = event.files[0];

    if (file.size > this.maxImageSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd',
        detail: 'Wybrany plik jest zbyt duży.',
      });
      return;
    }
  }

  setTemporaryContentImage(fileUploader: any): void {
    const files = fileUploader.files;
    if (!files || files.length === 0) {
      console.error('No file selected to upload!');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.resizeImage(base64String, environment.defaultImageHeight).then(
        (resizedBase64) => {
          this.temporaryContentImage = {
            imageBase64: resizedBase64,
            imageName: file.name,
          };
        }
      );
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }

  displayQuestionRemovalModal(event: Event, index: number): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć to pytanie?',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.removeQuestion(index),
    });
  }

  removeQuestion(index: number): void {
    this.questionService.removeQuestion(this.questions![index].id);

    this.questions!.splice(index, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Usunięto pytanie',
    });
  }

  private getAnswerId(questionIndex: number, answerIndex: number): string {
    if (this.questions![questionIndex].answers.length > answerIndex) {
      return this.questions![questionIndex].answers[answerIndex].id;
    }

    return '';
  }

  private buildQuestionFromQuestionFormGroup(): Question {
    var answerFormControls =
      this.questionFormGroup.controls.answers.controls.filter(
        (fc) => fc.value != ''
      );

    var answers: Answer[] = [];

    answerFormControls.forEach((fc, i) => {
      answers.push({
        content: fc.value!,
        id: this.getAnswerId(this.currentEditedQuestionIndex, i),
        isCorrect:
          this.questionFormGroup.controls.correctAnswers.controls[i].value!,
      });
    });

    var image: NamedImage | null = null;

    if (
      this.temporaryContentImage?.imageBase64 != '' &&
      this.temporaryContentImage != null
    ) {
      image = {
        imageBase64: this.temporaryContentImage.imageBase64,
        imageName: this.temporaryContentImage.imageName,
      };
    } else if (
      this.temporaryContentImage == null &&
      this.questions![this.currentEditedQuestionIndex].image != null
    ) {
      image = this.questions![this.currentEditedQuestionIndex].image!;
    }

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: image,
      id: this.questions![this.currentEditedQuestionIndex].id,
    };

    return question;
  }

  saveQuestion(): void {
    const question = this.buildQuestionFromQuestionFormGroup();

    this.questionService.editQuestion(
      question,
      this.questions![this.currentEditedQuestionIndex].id
    );

    this.questions![this.currentEditedQuestionIndex].content =
      this.questionFormGroup.controls.content.value!;

    this.questions![this.currentEditedQuestionIndex].answers = question.answers;

    this.questions![this.currentEditedQuestionIndex].image = question.image;

    this.questionDialogVisible = false;
    this.questionFormGroup.reset();
    this.currentEditedQuestionIndex = -1;
    this.temporaryContentImage = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Zapisano pytanie',
    });
  }

  addQuestion(): void {
    //change that to questionDTO something \/

    var answers: Answer[] = this.questionFormGroup.controls.answers.controls
      .filter((fc) => fc.value != '')
      .map((fc, index) => {
        if (fc.value! != '') {
          return {
            content: fc.value!,
            isCorrect:
              this.questionFormGroup.controls.correctAnswers.controls[index]
                .value!,
            id: '',
          };
        }
        return null!;
      });

    var question: Question = {
      content: this.questionFormGroup.controls.content.value!,
      answers: answers,
      image: null,
      id: '',
    };

    this.questionService.addQuestion(question);

    this.questions!.push(question);

    this.questionDialogVisible = false;
    this.questionFormGroup.reset();
    this.temporaryContentImage = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Dodano pytanie',
    });
  }

  closeEditDialog(): void {
    this.questionDialogVisible = false;
    this.questionFormGroup.reset();
    this.currentEditedQuestionIndex = -1;
    this.temporaryContentImage = null;
  }
}

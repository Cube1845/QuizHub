import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../../../../../../common/components/spinner/spinner.component';
import { ButtonModule } from 'primeng/button';
import {
  QuestionBasesWithMinimalQuestions,
  TestOptions,
} from '../../../../../models/testOptions';
import { TestEditService } from '../../../../../services/test-edit.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TableModule } from 'primeng/table';
import { QuestionBaseData } from '../../../../../models/questionBaseData';
import { GlobalDialogService } from '../../../../../../common/services/global-dialog.service';
import { QuestionBaseSelectDialogComponent } from './question-base-select-dialog/question-base-select-dialog.component';
import { questionSumValidator } from '../../../../../validators/question-sum-validator';
import { NameEditDialogComponent } from '../../../../../../common/components/name-edit-dialog/name-edit-dialog.component';
import { TestCreatorService } from '../../../../../services/test-creator.service';
import { ToastService } from '../../../../../../common/services/toast.service';

@Component({
  selector: 'app-test-edit',
  standalone: true,
  imports: [
    SpinnerComponent,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    IftaLabelModule,
    TableModule,
  ],
  templateUrl: './test-edit.component.html',
  styleUrl: './test-edit.component.scss',
})
export class TestEditComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly testEditService = inject(TestEditService);
  private readonly router = inject(Router);
  private readonly globalDialogService = inject(GlobalDialogService);
  private readonly testCreatorService = inject(TestCreatorService);
  private readonly toastService = inject(ToastService);

  testId!: string | null;
  testName!: string | null;

  testOptions!: TestOptions | null;

  isTestActive!: boolean | null;

  userQuestionBases!: QuestionBaseData[] | null;

  testOptionsFormGroup = new FormGroup(
    {
      questionCount: new FormControl<number>(0, [
        Validators.required,
        Validators.min(1),
      ]),
      minimalQuestionCounts: new FormArray<FormControl<number | null>>([]),
    },
    questionSumValidator
  );

  codeFormControl = new FormControl<string>('');

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.testId = paramMap.get('id');

      //temporary
      const testOptionsAndData = this.testEditService.getTestOptionsAndData(
        this.testId!
      );

      this.testOptions = testOptionsAndData.testOptions;
      this.isTestActive = testOptionsAndData.isActive;

      this.setInputValues(
        this.testOptions!.questionCount,
        this.testOptions.usedQuestionBases,
        testOptionsAndData.code
      );
      this.testName = testOptionsAndData.name;
      this.userQuestionBases = [
        {
          name: 'Pytania testowe',
          questionCount: 10,
          id: 'awdawdawdagswegwea',
        },
        {
          name: 'Pytania testowe 1',
          questionCount: 10,
          id: 'awdawdawdegwea',
        },
        {
          name: 'Pytania testowe 2',
          questionCount: 10,
          id: 'awdawdawwegwea',
        },
        {
          name: 'Pytania testowe 3',
          questionCount: 10,
          id: 'awdawdawdagswa',
        },
      ];
    });
  }

  goBack(): void {
    this.router.navigateByUrl('manager/tests');
  }

  saveTestOptions(): void {
    this.testEditService.saveTestOptions(this.testId!, this.testOptions!);

    //temporary
    this.toastService.displayToast('success', 'Sukces', 'Zapisano ustawienia');
  }

  changeTestCode(): void {
    this.testEditService.changeTestCode(this.testId!);

    //temporary
    this.codeFormControl.setValue('hu4Ay2ga');
    this.toastService.displayToast('success', 'Sukces', 'Zmieniono kod testu');
  }

  changeTestActiveState(): void {
    this.testEditService.changeTestActiveState(this.testId!);

    //temporary
    this.isTestActive = !this.isTestActive;
  }

  copyCode(): void {
    navigator.clipboard
      .writeText(this.codeFormControl.value!)
      .then(() =>
        this.toastService.displayToast(
          'success',
          'Sukces',
          'Skopiowano kod testu'
        )
      );
  }

  setInputValues(
    questionCount: number,
    usedQuestionBases: QuestionBasesWithMinimalQuestions[],
    code: string
  ): void {
    usedQuestionBases.forEach((questionBase) => {
      this.testOptionsFormGroup.controls.minimalQuestionCounts.push(
        new FormControl(questionBase.minimalQuestionCount)
      );
    });

    this.testOptionsFormGroup.controls.questionCount.setValue(questionCount);

    this.codeFormControl.setValue(code);
  }

  displayTestRemovalModal(event: Event): void {
    this.globalDialogService.displayConfirmationDialog({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz usunąć ten test?',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.removeThisTest(),
    });
  }

  removeThisTest(): void {
    this.testCreatorService.removeTest(this.testId!);
    // .subscribe((isSuccess) => {
    //   if (isSuccess) {
    //     this.goBack();
    //     this.toastService.displayToast(
    //       'success',
    //       'Sukces',
    //       'Usunięto bazę pytań'
    //     );
    //   }
    // });

    this.goBack();
    this.toastService.displayToast('success', 'Sukces', 'Usunięto bazę pytań');
  }

  displayTestNameEditDialog(): void {
    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Edytuj nazwę testu',
        width: '25rem',
        modal: true,
        data: { index: -1, currentName: this.testName },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveThisTestName(result.name);
        }
      });
  }

  saveThisTestName(updatedName: string): void {
    this.testCreatorService.editTestName(updatedName, this.testId!);
    // .subscribe((isSuccess) => {
    //   if (isSuccess) {
    //     this.questionBaseName = updatedName;
    //     this.toastService.displayToast(
    //       'success',
    //       'Sukces',
    //       'Zmieniono nazwę'
    //     );
    //   }
    // });

    this.testName = updatedName;
    this.toastService.displayToast('success', 'Sukces', 'Zmieniono nazwę');
  }

  displayQuestionBaseUnselectingDialog(index: number, event: Event): void {
    this.globalDialogService.displayConfirmationDialog({
      target: event.target as EventTarget,
      message: 'Na pewno chcesz odznaczyć tą bazę pytań',
      header: 'Potwierdzenie',
      icon: '',
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptIcon: '',
      rejectIcon: '',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',

      accept: () => this.unselectQuestionBase(index),
    });
  }

  unselectQuestionBase(index: number): void {
    this.testOptions!.usedQuestionBases.splice(index, 1);
  }

  openQuestionBaseSelectingDialog(): void {
    const usedQuestionBasesIds = this.testOptions!.usedQuestionBases.map(
      (questionBase) => questionBase.questionBaseId
    );

    const notAlreadyUsedQuestionBases = this.userQuestionBases!.filter(
      (questionBase) => !usedQuestionBasesIds.includes(questionBase.id)
    );

    this.globalDialogService
      .displayDialog(QuestionBaseSelectDialogComponent, {
        data: notAlreadyUsedQuestionBases,
        closable: true,
        modal: true,
        width: '20rem',
        header: 'Wybierz bazę pytań',
      })
      .subscribe((result) => {
        if (result) {
          this.testOptionsFormGroup.controls.minimalQuestionCounts.controls.push(
            new FormControl<number | null>(null)
          );

          this.testOptions!.usedQuestionBases.push({
            questionBaseId: result.id,
            questionBaseName: result.name,
            minimalQuestionCount: null,
          });
        }
      });
  }
}

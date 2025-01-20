import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private readonly globalDialogService = inject(GlobalDialogService);

  testId!: string | null;
  testName!: string | null;

  testOptions!: TestOptions | null;

  isTestActive!: boolean;
  testCode!: string;

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
      this.testCode = testOptionsAndData.code;
      this.isTestActive = testOptionsAndData.isActive;

      this.setInputValues(
        this.testOptions!.questionCount,
        this.testOptions.usedQuestionBases,
        this.testCode
      );
      this.testName = this.testOptions.name;
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

  saveTestOptions(): void {}

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

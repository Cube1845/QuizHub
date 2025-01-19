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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TableModule } from 'primeng/table';
import { QuestionBaseData } from '../../../../../models/questionBaseData';
import { GlobalDialogService } from '../../../../../../common/services/global-dialog.service';
import { QuestionBaseSelectDialogComponent } from './question-base-select-dialog/question-base-select-dialog.component';

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

  userQuestionBases!: QuestionBaseData[] | null;

  testOptionsFormGroup = new FormGroup({
    questionCount: new FormControl<number>(0),
    minimalQuestionCounts: new FormGroup<FormControl<number | null>[]>([]),
  });

  constructor() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('id') == null) {
        return;
      }

      this.testId = paramMap.get('id');

      //temporary
      this.testOptions = this.testEditService.getTestOptions(this.testId!);
      this.setInputValues(
        this.testOptions!.questionCount,
        this.testOptions.usedQuestionBases
      );
      this.testName = paramMap.get('id');
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

  setInputValues(
    questionCount: number,
    usedQuestionBases: QuestionBasesWithMinimalQuestions[]
  ): void {
    usedQuestionBases.forEach((questionBase) => {
      this.testOptionsFormGroup.controls.minimalQuestionCounts.controls.push(
        new FormControl<number | null>(questionBase.minimalQuestionCount)
      );
    });

    this.testOptionsFormGroup.controls.questionCount.setValue(questionCount);
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

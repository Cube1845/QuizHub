import { Component, inject } from '@angular/core';
import { QuestionBaseService } from '../../../../services/question-base.service';
import { PolishWordVariationService } from '../../../../services/polish-word-variation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { QuestionBaseData } from '../../../../models/questionBaseData';
import { QuestionBaseAddingMethodDialogComponent } from './dialogs/question-base-adding-method-dialog/question-base-adding-method-dialog.component';
import { ImportQuestionBaseDialogComponent } from './dialogs/import-question-base-dialog/import-question-base-dialog.component';
import { ToastService } from '../../../../../common/services/toast.service';
import { GlobalDialogService } from '../../../../../common/services/global-dialog.service';
import { SpinnerComponent } from '../../../../../common/components/spinner/spinner.component';
import { saveAs } from 'file-saver';
import { NameEditDialogComponent } from '../../../../../common/components/name-edit-dialog/name-edit-dialog.component';

@Component({
  selector: 'app-manager-question-bases',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FloatLabelModule, SpinnerComponent],
  templateUrl: './manager-question-bases.component.html',
  styleUrl: './manager-question-bases.component.scss',
})
export class ManagerQuestionBasesComponent {
  private readonly questionBaseService = inject(QuestionBaseService);
  private readonly polishWordVariationService = inject(
    PolishWordVariationService
  );
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly globalDialogService = inject(GlobalDialogService);

  questionBases: QuestionBaseData[] | null = null;

  constructor() {
    this.questionBaseService
      .getUserQuestionBasesData()
      .subscribe((data) => (this.questionBases = data));
  }

  goToQuestionEditor(questionBaseId: string) {
    this.router.navigateByUrl('manager/question-base-edit/' + questionBaseId);
  }

  getQuestionWordVariation(questionNumber: number): string {
    return this.polishWordVariationService.getQuestionWordVariation(
      questionNumber
    );
  }

  displayQuestionBaseNameEditDialog(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Edytuj nazwę bazy pytań',
        width: '25rem',
        modal: true,
        data: { index: index, currentName: this.questionBases![index].name },
      })
      .subscribe((result) => {
        if (result != null) {
          this.saveQuestionBaseName(result.name, result.itemIndex);
        }
      });
  }

  displayQuestionBaseImportingDialog(): void {
    this.globalDialogService
      .displayDialog(ImportQuestionBaseDialogComponent, {
        header: 'Zaimportuj bazę pytań z pliku',
        modal: true,
        closable: true,
      })
      .subscribe((result) => {
        if (result == null) {
          return;
        }

        this.questionBaseService
          .importQuestionBaseFile(result)
          .subscribe((id) =>
            this.router.navigateByUrl('manager/question-base-edit/' + id)
          );
      });
  }

  displayQuestionBaseAddingMethodDialog(): void {
    this.globalDialogService
      .displayDialog(QuestionBaseAddingMethodDialogComponent, {
        header: 'Jak chcesz dodać bazę pytań?',
        modal: true,
        closable: true,
      })
      .subscribe((result) => {
        if (result == null) {
          return;
        }

        if (result) {
          this.displayQuestionBaseCreatingDialog();
          return;
        }

        this.displayQuestionBaseImportingDialog();
      });
  }

  displayQuestionBaseCreatingDialog(): void {
    this.globalDialogService
      .displayDialog(NameEditDialogComponent, {
        header: 'Dodaj bazę pytań',
        width: '25rem',
        modal: true,
      })
      .subscribe((result) => {
        if (result != null) {
          this.createQuestionBase(result);
        }
      });
  }

  displayQuestionBaseRemovalModal(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz usunąć tę bazę pytań?',
      () => this.removeQuestionBase(index)
    );
  }

  removeQuestionBase(index: number): void {
    this.questionBaseService
      .removeQuestionBase(this.questionBases![index].id)
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.questionBases?.splice(index, 1);
          this.toastService.displayToast(
            'success',
            'Sukces',
            'Usunięto bazę pytań'
          );
        }
      });
  }

  createQuestionBase(name: string): void {
    this.questionBaseService
      .createUserQuestionBase(name)
      .subscribe((newId) =>
        this.router.navigateByUrl('manager/question-base-edit/' + newId)
      );
  }

  saveQuestionBaseName(updatedName: string, questionBaseIndex: number): void {
    if (updatedName == this.questionBases![questionBaseIndex].name) {
      return;
    }

    this.questionBaseService
      .editQuestionBaseName(
        updatedName,
        this.questionBases![questionBaseIndex].id
      )
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.questionBases![questionBaseIndex].name = updatedName;
          this.toastService.displayToast('success', 'Sukces', 'Zapisano nazwę');
        }
      });
  }

  downloadQuestionBase(index: number): void {
    this.questionBaseService
      .exportQuestionBaseFile(this.questionBases![index].id)
      .subscribe((value) => {
        return saveAs(value, this.questionBases![index].name);
      });
  }

  displayDownloadingQuestionBaseModal(event: Event, index: number): void {
    event.stopPropagation();

    this.globalDialogService.displayConfirmationDialog(
      'Na pewno chcesz pobrać tę bazę pytań do pliku?',
      () => this.downloadQuestionBase(index)
    );
  }
}

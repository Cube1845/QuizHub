import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { QuestionBase } from '../../../../../common/models/questionBase';
import { QuestionBaseService } from '../../../../services/question-base.service';
import { PolishWordVariationService } from '../../../../../common/services/polish-word-variation.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-manager-question-bases',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, FloatLabelModule],
  templateUrl: './manager-question-bases.component.html',
  styleUrl: './manager-question-bases.component.scss',
})
export class ManagerQuestionBasesComponent {
  questionBaseService = inject(QuestionBaseService);
  polishWordVariationService = inject(PolishWordVariationService);

  dialogVisible: boolean = false;

  questionBases: QuestionBase[] = [];

  constructor() {
    this.questionBases = this.questionBaseService.getUserQuestionBases();
  }
}

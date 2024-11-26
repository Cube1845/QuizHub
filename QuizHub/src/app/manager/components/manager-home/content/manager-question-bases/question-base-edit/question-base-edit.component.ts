import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../../../../../common/models/question';
import { QuestionBaseService } from '../../../../../services/question-base.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-question-base-edit',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './question-base-edit.component.html',
  styleUrl: './question-base-edit.component.scss',
})
export class QuestionBaseEditComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  questionBaseService = inject(QuestionBaseService);

  questions: Question[] | null = null;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.questions =
        this.questionBaseService.getQuestionsFromUserQuestionBase(
          paramMap.get('id')!
        );
    });
  }
}

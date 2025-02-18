import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-selected-answers-display',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './selected-answers-display.component.html',
  styleUrl: './selected-answers-display.component.scss',
})
export class SelectedAnswersDisplayComponent {}

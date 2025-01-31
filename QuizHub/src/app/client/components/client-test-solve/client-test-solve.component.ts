import { Component } from '@angular/core';
import { AnswerTileComponent } from './answer-tile/answer-tile.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-test-solve',
  standalone: true,
  imports: [AnswerTileComponent, ButtonModule],
  templateUrl: './client-test-solve.component.html',
  styleUrl: './client-test-solve.component.scss',
})
export class ClientTestSolveComponent {}

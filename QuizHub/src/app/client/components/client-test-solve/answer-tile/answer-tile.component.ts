import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AnswerInterface } from '../../../models/answerInterface';

@Component({
  selector: 'app-answer-tile',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './answer-tile.component.html',
  styleUrl: './answer-tile.component.scss',
})
export class AnswerTileComponent {
  hovered!: boolean;

  @Input({ required: true }) answer!: AnswerInterface;

  getBackgroundColor(): string {
    if (this.hovered) {
      return 'var(--p-zinc-800)';
    }

    return 'var(--p-zinc-850)';
  }
}

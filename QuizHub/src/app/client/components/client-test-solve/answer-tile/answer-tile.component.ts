import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onClick = new EventEmitter<boolean>();

  getBackgroundColor(): string {
    if (this.answer.isSelected) {
      if (this.hovered) {
        return 'var(--p-primary-800)';
      }

      return 'var(--p-primary-900)';
    }

    if (this.hovered) {
      return 'var(--p-zinc-800)';
    }

    return 'var(--p-zinc-850)';
  }

  onAnswerTileClick(): void {
    this.onClick.emit(!this.answer.isSelected);
  }
}

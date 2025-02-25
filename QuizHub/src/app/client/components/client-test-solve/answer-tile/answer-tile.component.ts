import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerOutDto } from '../../../../common/models/answerOutDto';

@Component({
  selector: 'app-answer-tile',
  standalone: true,
  imports: [],
  templateUrl: './answer-tile.component.html',
  styleUrl: './answer-tile.component.scss',
})
export class AnswerTileComponent {
  hovered!: boolean;

  @Input({ required: true }) answer!: AnswerOutDto;
  @Output() onClick = new EventEmitter<boolean>();

  getClass(): string {
    if (this.answer.isSelected) {
      if (this.hovered) {
        return ' hovered-selected';
      }

      return ' selected';
    }

    if (this.hovered) {
      return ' hovered';
    }

    return '';
  }

  onAnswerTileClick(): void {
    this.onClick.emit(!this.answer.isSelected);
  }
}

import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { environment } from '../../../../../../../../../environments/environment.development';
import { ImageService } from '../../../../../../../../common/services/image.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-image-panel',
  standalone: true,
  imports: [ButtonModule, NgStyle],
  templateUrl: './image-panel.component.html',
  styleUrl: './image-panel.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePanelComponent),
      multi: true,
    },
  ],
})
export class ImagePanelComponent implements ControlValueAccessor {
  private onChange!: (value: any) => void;

  private readonly imageService = inject(ImageService);

  maxImageSize = environment.maxImageSize;

  uuid = uuidv4();

  selectedFile!: File | null;

  @Output() onDisplayPreview = new EventEmitter<string>();

  @Input() uploaderDisabled!: boolean;
  @Input() smaller: boolean = false;

  getComponentHeight(): string {
    if (this.smaller) {
      return '24px';
    }

    return '30px';
  }

  getFontSize(): string {
    if (this.smaller) {
      return '12px';
    }

    return '14px';
  }

  async onUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files![0];

    if (!file) {
      console.error('File error');
      return;
    }

    let defaultHeight = environment.defaultContentImageHeight;

    if (this.smaller) {
      defaultHeight = environment.defaultAnswerImageHeight;
    }

    const resizedBlob = await this.imageService.resizeImage(
      file,
      defaultHeight
    );

    this.selectedFile = new File([resizedBlob], file.name, { type: file.type });

    this.onChange(this.selectedFile);
  }

  getFileUploaderContentText(): string {
    if (this.selectedFile == null) {
      return 'Dodaj obraz';
    }

    return this.selectedFile.name;
  }

  removeImage(): void {
    this.selectedFile = null;
    this.onChange(this.selectedFile);
  }

  emitDisplayImageEvent(): void {
    this.onDisplayPreview.emit(
      this.imageService.getImageUrl(this.selectedFile!)
    );
  }

  writeValue(obj: any): void {
    this.selectedFile = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

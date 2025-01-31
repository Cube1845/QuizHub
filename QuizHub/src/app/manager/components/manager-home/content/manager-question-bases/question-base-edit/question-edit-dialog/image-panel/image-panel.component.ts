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
import { ImageService } from '../../../../../../../services/image.service';
import { v4 as uuidv4 } from 'uuid';
import {
  DisplayableImage,
  DisplayableImageWithChangeTracker,
} from '../../../../../../../../common/models/displayableImage';

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

  selectedImage!: DisplayableImageWithChangeTracker | null;

  @Output() onDisplayPreview = new EventEmitter<string>();

  @Input() uploaderDisabled!: boolean;
  @Input() smaller: boolean = false;

  getComponentHeight(): string {
    return this.smaller ? '24px' : '30px';
  }

  getFontSize(): string {
    return this.smaller ? '12px' : '14px';
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

    this.selectedImage = new File([resizedBlob], file.name, {
      type: file.type,
    });

    this.selectedImage.displayUrl = this.imageService.getImageUrl(
      this.selectedImage
    );

    this.selectedImage.wasChangedSinceAssigning = true;

    this.onChange(this.selectedImage);
  }

  getFileUploaderContentText(): string {
    if (this.selectedImage == null) {
      return 'Dodaj obraz';
    }

    return this.selectedImage.name;
  }

  removeImage(): void {
    this.selectedImage = null;
    this.onChange(this.selectedImage);
  }

  emitDisplayImageEvent(): void {
    this.onDisplayPreview.emit(this.selectedImage!.displayUrl);
  }

  writeValue(obj: any): void {
    this.selectedImage = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

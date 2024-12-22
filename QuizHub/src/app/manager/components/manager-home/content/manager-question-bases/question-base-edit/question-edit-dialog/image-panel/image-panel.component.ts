import {
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { ImageService } from '../../../../../../../../common/services/image.service';
import { environment } from '../../../../../../../../../environments/environment.development';

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

  selectedFile!: File | null;

  @Output() onDisplayPreview = new EventEmitter<string>();

  @Input() componentHeight: string = '30';
  @Input() uploaderDisabled!: boolean;

  @HostBinding('style.--comp-height') compHeight = this.componentHeight + 'px';
  @HostBinding('style.--comp-font-size') compFontSize = this.getFontSize();

  getFontSize(): string {
    return (Number(this.componentHeight) / 2).toString() + 'px';
  }

  async onUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files![0];

    if (!file) {
      console.error('File error');
      return;
    }

    const resizedBlob = await this.imageService.resizeImage(
      file,
      environment.defaultImageHeight
    );

    this.selectedFile = new File([resizedBlob], file.name, { type: file.type });

    this.onChange(this.selectedFile);
  }

  getFileUploaderContentText(): string {
    if (this.selectedFile == null) {
      return 'Wybierz obraz';
    }

    return this.selectedFile.name;
  }

  removeImage(): void {
    this.selectedFile = null;
  }

  emitDisplayImageEvent(): void {
    this.onDisplayPreview.emit(URL.createObjectURL(this.selectedFile as File));
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

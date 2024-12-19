import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { environment } from '../../../../../../../../environments/environment.development';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-panel',
  standalone: true,
  imports: [ButtonModule, FileUpload],
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

  maxImageSize = environment.maxImageSize;

  selectedFile: File | null = null;

  @Output() displayPreviewEvent = new EventEmitter<string>();

  @Input() componentHeight: string = '30px';
  @Input() uploaderDisabled: boolean = false;

  async onUpload(event: any): Promise<void> {
    const file = event.files[0];

    if (!file) {
      console.error('File error');
      return;
    }

    const resizedBlob = await this.resizeImage(
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

  // ChatGPT function
  async resizeImage(file: File, targetHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetWidth = targetHeight * aspectRatio;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          file.type,
          1 // Quality: 1 (maximum)
        );
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  emitDisplayImageEvent(): void {
    this.displayPreviewEvent.emit(
      URL.createObjectURL(this.selectedFile as File)
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

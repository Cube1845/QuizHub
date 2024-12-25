import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-import-question-base-dialog',
  standalone: true,
  imports: [FileUpload, ButtonModule],
  templateUrl: './import-question-base-dialog.component.html',
  styleUrl: './import-question-base-dialog.component.scss',
})
export class ImportQuestionBaseDialogComponent {
  private readonly ref = inject(DynamicDialogRef);

  private selectedFile!: File | null;

  onUpload(fileUploader: any): void {
    const file = fileUploader.files[0];

    if (!file) {
      console.error('File error');
      return;
    }

    this.selectedFile = file;
  }

  isAnyFileSelected(): boolean {
    return this.selectedFile != null;
  }

  getFileUploaderContentText(): string {
    return this.selectedFile == null ? 'Wybierz plik' : this.selectedFile.name;
  }

  import(): void {
    this.ref.close(this.selectedFile!);
  }

  close(): void {
    this.ref.close(null);
  }
}

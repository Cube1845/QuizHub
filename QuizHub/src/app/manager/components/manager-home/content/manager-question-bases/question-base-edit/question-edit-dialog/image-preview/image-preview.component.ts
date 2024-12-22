import { Component, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss',
})
export class ImagePreviewComponent {
  private readonly config = inject(DynamicDialogConfig);

  imagePreviewUrl: string = this.config.data;
}

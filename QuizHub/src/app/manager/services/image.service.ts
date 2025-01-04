import { Injectable } from '@angular/core';
import { ImageResponse } from '../../common/models/imageResponse';
import { DisplayableImage } from '../models/displayableImage';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageResponseToFile(
    imageResponse: ImageResponse | null
  ): DisplayableImage | null {
    if (imageResponse == null) {
      return null;
    }

    const file: DisplayableImage = new File(
      [imageResponse.data],
      imageResponse.name,
      {
        type: imageResponse.contentType,
      }
    );

    file.displayUrl = this.getImageUrl(file);

    return file;
  }

  getResizedCanvas(
    reject: (reason?: any) => void,
    img: HTMLImageElement,
    targetHeight: number
  ): HTMLCanvasElement | undefined {
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

    return canvas;
  }

  async resizeImage(file: File, targetHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () =>
        this.getImageBlob(resolve, reject, img, targetHeight, file.type);

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  getImageUrl(image: File): string {
    return URL.createObjectURL(image as File);
  }

  private readonly getImageBlob = (
    resolve: (value: Blob | PromiseLike<Blob>) => void,
    reject: (reason?: any) => void,
    img: HTMLImageElement,
    targetHeight: number,
    fileType: string
  ): Promise<Blob> => {
    return new Promise(() => {
      const canvas = this.getResizedCanvas(reject, img, targetHeight)!;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        },
        fileType,
        1
      );
    });
  };
}

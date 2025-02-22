import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DisplayableImage } from '../../common/models/displayableImage';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

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

  public getImageFromApi(imageId: string): Observable<DisplayableImage | null> {
    return this.http
      .get(`${this.apiUrl}/image/${imageId}`, {
        responseType: 'blob',
      })
      .pipe(
        map((blob) => {
          if (blob) {
            const displayableImage: DisplayableImage | null =
              new DisplayableImage([blob], 'Obraz', {
                type: blob.type,
              });

            return displayableImage;
          } else {
            return null;
          }
        })
      );
  }
}

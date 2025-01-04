import { inject, Injectable } from '@angular/core';
import { GetQuestionDTO } from '../models/getQuestionDto';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';
import { DisplayableImage } from '../models/displayableImage';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  async convertGetQuestionDtoToRegularQuestion(
    dto: GetQuestionDTO
  ): Promise<Question> {
    const question: Question = {
      id: dto.id,
      content: dto.content,
      questionType: dto.questionType,
      image:
        dto.imageId == null ? null : await this.getImageFromApi(dto.imageId),
      answers: await Promise.all(
        dto.answers.map(async (answer) => {
          return {
            content: answer.content,
            isCorrect: answer.isCorrect,
            id: answer.id,
            image:
              answer.imageId == null
                ? null
                : await this.getImageFromApi(answer.imageId),
          };
        })
      ),
    };

    return question;
  }

  private async getImageFromApi(
    imageId: string
  ): Promise<DisplayableImage | null> {
    return this.http
      .get<File>(this.apiUrl + '/image/' + imageId)
      .pipe(
        map((file) => {
          const displayableImage: DisplayableImage = file;
          displayableImage.displayUrl = this.getImageUrl(displayableImage);

          return displayableImage;
        })
      )
      .toPromise()
      .then((responseFile) => {
        if (responseFile == null || responseFile == undefined) {
          return null;
        }

        return responseFile;
      });
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

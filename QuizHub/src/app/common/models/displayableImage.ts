export class DisplayableImage extends File {
  displayUrl?: string;

  constructor(
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag
  ) {
    super(fileBits, fileName, options);

    this.displayUrl = URL.createObjectURL(this as File);
  }
}

export type DisplayableImageWithChangeTracker = DisplayableImage & {
  wasChangedSinceAssigning?: boolean;
};

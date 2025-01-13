export type DisplayableImage = File & {
  displayUrl?: string;
};

export type DisplayableImageWithChangeTracker = DisplayableImage & {
  wasChangedSinceAssigning?: boolean;
};

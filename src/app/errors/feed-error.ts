/** Error codes thrown by {@link FeedService} operations. */
export enum FeedErrorCode {
  /** The requested post ID does not exist. */
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  /** Comment content is empty or whitespace-only. */
  EMPTY_COMMENT = 'EMPTY_COMMENT',
}

const FEED_ERROR_MESSAGES: Record<FeedErrorCode, string> = {
  [FeedErrorCode.POST_NOT_FOUND]: 'Post not found.',
  [FeedErrorCode.EMPTY_COMMENT]: 'Comment content cannot be empty.',
};

/** Typed error thrown by feed service operations. Carries a {@link FeedErrorCode} and a human-readable message. */
export class FeedError extends Error {
  constructor(readonly code: FeedErrorCode) {
    super(FEED_ERROR_MESSAGES[code]);
    this.name = 'FeedError';
  }
}

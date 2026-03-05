export enum FeedErrorCode {
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  EMPTY_COMMENT = 'EMPTY_COMMENT',
}

const FEED_ERROR_MESSAGES: Record<FeedErrorCode, string> = {
  [FeedErrorCode.POST_NOT_FOUND]: 'Post not found.',
  [FeedErrorCode.EMPTY_COMMENT]: 'Comment content cannot be empty.',
};

export class FeedError extends Error {
  constructor(readonly code: FeedErrorCode) {
    super(FEED_ERROR_MESSAGES[code]);
    this.name = 'FeedError';
  }
}

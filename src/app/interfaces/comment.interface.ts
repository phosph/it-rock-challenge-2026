import type { PostAuthor } from './post.interface';

export interface Comment {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
}

export interface CommentInput {
  content: string;
}

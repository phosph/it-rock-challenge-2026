import type { Comment } from '../../../interfaces/comment.interface';
import type { Post, PostArticle, PostAuthor, PostEvent, PostImage, PostInput, PostType } from '../../../interfaces/post.interface';

/** Shape of post data as stored in localStorage / mock JSON */
export interface StoredPost {
  id: string;
  type: PostType;
  content: string;
  meta?: string;
  image?: PostImage;
  article?: PostArticle;
  quote?: string;
  event?: PostEvent;
  author: PostAuthor;
  createdAt: string;
  likedBy: string[];
  shares: number;
  comments?: Comment[];
}

export class PostEntity {
  readonly id: string;
  readonly type: PostType;
  readonly content: string;
  readonly meta?: string;
  readonly image?: PostImage;
  readonly article?: PostArticle;
  readonly quote?: string;
  readonly event?: PostEvent;
  readonly author: PostAuthor;
  readonly createdAt: string;
  readonly likedBy: Set<string>;
  comments: Comment[];
  shares: number;

  constructor(data: StoredPost) {
    this.id = data.id;
    this.type = data.type;
    this.content = data.content;
    this.meta = data.meta;
    this.image = data.image;
    this.article = data.article;
    this.quote = data.quote;
    this.event = data.event;
    this.author = data.author;
    this.createdAt = data.createdAt;
    this.likedBy = new Set(data.likedBy);
    this.comments = data.comments ?? [];
    this.shares = data.shares;
  }

  static fromInput(input: PostInput, id: string, author: PostAuthor): PostEntity {
    return new PostEntity({
      ...structuredClone(input),
      id,
      author,
      createdAt: new Date().toISOString(),
      likedBy: [],
      shares: 0,
      comments: [],
    });
  }

  toPost(currentUserId: string, tagged: boolean): Post {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      meta: this.meta,
      image: this.image ? structuredClone(this.image) : undefined,
      article: this.article ? structuredClone(this.article) : undefined,
      quote: this.quote,
      event: this.event ? structuredClone(this.event) : undefined,
      author: { ...this.author },
      createdAt: this.createdAt,
      stats: {
        likes: this.likedBy.size,
        comments: this.comments.length,
        shares: this.shares,
      },
      liked: this.likedBy.has(currentUserId),
      tagged,
      comments: this.comments.map(c => ({ ...c, author: { ...c.author } })),
    };
  }

  toStorable(): StoredPost {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      meta: this.meta,
      image: this.image,
      article: this.article,
      quote: this.quote,
      event: this.event,
      author: this.author,
      createdAt: this.createdAt,
      likedBy: [...this.likedBy],
      shares: this.shares,
      comments: this.comments,
    };
  }
}

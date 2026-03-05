import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { Comment, CommentInput } from '../../../interfaces/comment.interface';
import { FeedError, FeedErrorCode } from '../../../interfaces/feed-error';
import type { FeedService } from '../../../interfaces/feed-service.interface';
import type { Post, PostAuthor, PostInput } from '../../../interfaces/post.interface';
import { AUTH_SERVICE } from '../../auth';
import { AUTH_TOKEN } from '@src/app/store/auth.store';
import mockPosts from '../feeds.mock.json';
import { PostEntity, type StoredPost } from './post-entity';

const STORAGE_KEY = 'feed_posts';

@Injectable()
export class MockFeedServiceImpl implements FeedService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #authService = inject(AUTH_SERVICE);
  readonly #authToken = inject(AUTH_TOKEN);
  readonly #mockedDb: Map<string, PostEntity>;

  constructor() {
    const seed = this.#isBrowser ? this.#loadFromStorage() : null;
    const stored = seed ?? (mockPosts as StoredPost[]);
    this.#mockedDb = new Map(stored.map(s => [s.id, new PostEntity(s)]));
  }

  async getAll(): Promise<Post[]> {
    const userId = await this.#resolveUserId();
    return Iterator.from(this.#mockedDb.values())
      .map(entity => {
        const post = entity.toPost(userId);
        delete post.comments;
        return post;
      })
      .toArray()
      .reverse();
  }

  async getPost(postId: string): Promise<Post> {
    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);
    const userId = await this.#resolveUserId();
    return entity.toPost(userId);
  }

  async uploadPost(postInput: PostInput): Promise<Post> {
    const user = await this.#authService.getAuthenticatedUser(this.#authToken());
    const author: PostAuthor = {
      id: user.id,
      name: user.displayName,
      avatarUrl: user.avatar,
    };

    const entity = PostEntity.fromInput(postInput, crypto.randomUUID(), author);
    this.#mockedDb.set(entity.id, entity);
    this.#persist();

    return entity.toPost(user.id);
  }

  async addComment(postId: string, commentInput: CommentInput): Promise<Comment> {
    if (!commentInput.content.trim()) throw new FeedError(FeedErrorCode.EMPTY_COMMENT);

    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);

    const user = await this.#authService.getAuthenticatedUser(this.#authToken());
    const comment: Comment = {
      id: crypto.randomUUID(),
      author: { id: user.id, name: user.displayName, avatarUrl: user.avatar },
      content: commentInput.content,
      createdAt: new Date().toISOString(),
    };

    entity.comments.unshift(comment);
    this.#persist();

    return structuredClone(comment);
  }

  async toggleLike(postId: string): Promise<Post> {
    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);

    const user = await this.#authService.getAuthenticatedUser(this.#authToken());

    if (entity.likedBy.has(user.id)) {
      entity.likedBy.delete(user.id);
    } else {
      entity.likedBy.add(user.id);
    }

    this.#persist();
    return entity.toPost(user.id);
  }

  async sharePost(postId: string): Promise<Post> {
    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);

    entity.shares++;
    this.#persist();

    const userId = await this.#resolveUserId();
    return entity.toPost(userId);
  }

  async #resolveUserId(): Promise<string> {
    const user = await this.#authService.getAuthenticatedUser(this.#authToken());
    return user.id;
  }

  #loadFromStorage(): StoredPost[] | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const posts = JSON.parse(raw) as StoredPost[];
      return posts.length > 0 ? posts : null;
    } catch {
      return null;
    }
  }

  #persist(): void {
    if (!this.#isBrowser) return;
    const stored = Iterator.from(this.#mockedDb.values())
      .map(entity => entity.toStorable())
      .toArray();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
}

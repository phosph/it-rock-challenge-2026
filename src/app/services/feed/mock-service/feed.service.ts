import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AUTH_TOKEN } from '@src/app/store/auth.store';
import type { Comment, CommentInput } from '../../../interfaces/comment.interface';
import { FeedError, FeedErrorCode } from '../../../errors/feed-error';
import type { FeedFilter, FeedService } from '../../../interfaces/feed-service.interface';
import type { Post, PostAuthor, PostInput } from '../../../interfaces/post.interface';
import { AUTH_SERVICE } from '../../auth';
import mockPosts from '../feeds.mock.json';
import { PostEntity, type StoredPost } from './post-entity';

const STORAGE_KEY = 'feed_posts';
const TAGS_STORAGE_KEY = 'feed_tags';

/**
 * Mock implementation of {@link FeedService}. Uses an in-memory `Map` seeded from
 * `feeds.mock.json` and persisted to `localStorage`. Tracks likes per user via `Set`,
 * bookmarks in a separate localStorage key, and resolves the current user from the auth token.
 */
@Injectable()
export class MockFeedServiceImpl implements FeedService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #authService = inject(AUTH_SERVICE);
  readonly #authToken = inject(AUTH_TOKEN);
  readonly #mockedDb: Map<string, PostEntity>;
  readonly #tags: Map<string, Set<string>>;

  constructor() {
    const seed = this.#isBrowser ? this.#loadFromStorage() : null;
    const stored = seed ?? (mockPosts as StoredPost[]);
    this.#mockedDb = new Map(stored.map(s => [s.id, new PostEntity(s)]));
    this.#tags = this.#isBrowser ? this.#loadTags() : new Map();
  }

  async getAll(filter?: FeedFilter): Promise<Post[]> {
    const userId = await this.#resolveUserId();

    return (
      filter?.tagged
        // tagged
        ? Iterator.from(this.#tags.get(userId) ?? [])
          .map(postId => this.#mockedDb.get(postId))
          .filter(p => !!p)
        // all
        : Iterator.from(this.#mockedDb.values())
    ).map(entity => {
      const post = entity.toPost(userId, this.#isTagged(userId, entity.id));
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
    return entity.toPost(userId, this.#isTagged(userId, entity.id));
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

    return entity.toPost(user.id, false);
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
    return entity.toPost(user.id, this.#isTagged(user.id, postId));
  }

  async sharePost(postId: string): Promise<Post> {
    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);

    entity.shares++;
    this.#persist();

    const userId = await this.#resolveUserId();
    return entity.toPost(userId, this.#isTagged(userId, postId));
  }

  async toggleTag(postId: string): Promise<Post> {
    const entity = this.#mockedDb.get(postId);
    if (!entity) throw new FeedError(FeedErrorCode.POST_NOT_FOUND);

    const userId = await this.#resolveUserId();
    let userTags = this.#tags.get(userId);

    if (!userTags) {
      userTags = new Set();
      this.#tags.set(userId, userTags);
    }

    if (userTags.has(postId)) {
      userTags.delete(postId);
    } else {
      userTags.add(postId);
    }

    this.#persistTags();
    return entity.toPost(userId, userTags.has(postId));
  }

  /** Checks whether a post is bookmarked by the given user. */
  #isTagged(userId: string, postId: string): boolean {
    return this.#tags.get(userId)?.has(postId) ?? false;
  }

  /** Resolves the current user's ID from the auth token. */
  async #resolveUserId(): Promise<string> {
    const user = await this.#authService.getAuthenticatedUser(this.#authToken());
    return user.id;
  }

  /** Loads posts from localStorage. Returns `null` if empty or invalid. */
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

  /** Loads per-user bookmark sets from localStorage. */
  #loadTags(): Map<string, Set<string>> {
    const raw = localStorage.getItem(TAGS_STORAGE_KEY);
    if (!raw) return new Map();
    try {
      const data = JSON.parse(raw) as Record<string, string[]>;
      return new Map(Object.entries(data).map(([k, v]) => [k, new Set(v)]));
    } catch {
      return new Map();
    }
  }

  /** Serializes all posts to localStorage. */
  #persist(): void {
    if (!this.#isBrowser) return;
    const stored = Iterator.from(this.#mockedDb.values())
      .map(entity => entity.toStorable())
      .toArray();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  /** Serializes per-user bookmark sets to localStorage. */
  #persistTags(): void {
    if (!this.#isBrowser) return;
    const data: Record<string, string[]> = {};
    for (const [userId, postIds] of this.#tags) {
      data[userId] = [...postIds];
    }
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(data));
  }
}

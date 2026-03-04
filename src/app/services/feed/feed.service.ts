import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { FeedService } from '../../interfaces/feed-service.interface';
import type { Post, PostInput } from '../../interfaces/post.interface';
import { AUTH_SERVICE } from '../auth';
import mockPosts from './feeds.mock.json';

const STORAGE_KEY = 'feed_posts';

@Injectable()
export class MockFeedServiceImpl implements FeedService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #authService = inject(AUTH_SERVICE);
  readonly #mockedDb: Map<Post['id'], Post>;

  constructor() {
    const seed = this.#isBrowser ? this.#loadFromStorage() : null;
    const posts = seed ?? (mockPosts as Post[]);
    this.#mockedDb = new Map(posts.map(p => [p.id, p]));
  }

  async getPost(postId: Post['id']): Promise<Post> {
    const post = this.#mockedDb.get(postId);
    if (!post) throw new Error(`Post ${postId} not found`);
    return structuredClone(post);
  }

  async uploadPost(postInput: PostInput, token: string): Promise<Post> {
    const author = await this.#authService.getAuthenticatedUser(token)
      .then((user): Post['author'] => ({
        id: user.id,
        name: user.displayName,
        avatarUrl: user.avatar
      }));

    const post: Post = {
      ...structuredClone(postInput),
      id: crypto.randomUUID(),
      author,
      createdAt: new Date().toISOString(),
      stats: { likes: 0, comments: 0, shares: 0 },
      liked: false,
    };

    this.#mockedDb.set(post.id, post);
    this.#persist();

    return structuredClone(post);
  }

  async getAll(): Promise<Post[]> {
    return Iterator.from(this.#mockedDb.values())
      .map(post => structuredClone(post))
      .toArray()
      .reverse();
  }

  #loadFromStorage(): Post[] | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const posts = JSON.parse(raw) as Post[];
      return posts.length > 0 ? posts : null;
    } catch {
      return null;
    }
  }

  #persist(): void {
    if (!this.#isBrowser) return;
    const posts = Iterator.from(this.#mockedDb.values()).toArray();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }
}

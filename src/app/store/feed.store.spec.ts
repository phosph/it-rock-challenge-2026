import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Comment } from '@src/app/interfaces/comment.interface';
import type { FeedService } from '@src/app/interfaces/feed-service.interface';
import type { Post } from '@src/app/interfaces/post.interface';
import type { ShareRequest } from '@src/app/interfaces/share-request.interface';
import { FEED_SERVICE } from '@src/app/services/feed';
import { FeedStore, SHARE_REQUEST } from './feed.store';

const MOCK_POST: Post = {
  id: 'post-1',
  type: 'text',
  content: 'Hello world',
  author: { id: 'usr-001', name: 'Galangal', avatarUrl: 'avatar.jpg' },
  createdAt: '2025-06-01T00:00:00Z',
  stats: { likes: 5, comments: 2, shares: 1 },
  liked: false,
  tagged: false,
  comments: [
    { id: 'c1', author: { id: 'usr-002', name: 'Sarah', avatarUrl: 's.jpg' }, content: 'Nice!', createdAt: '2025-06-01T01:00:00Z' },
  ],
};

const MOCK_POST_2: Post = {
  id: 'post-2',
  type: 'text',
  content: 'Second post',
  author: { id: 'usr-002', name: 'Sarah', avatarUrl: 's.jpg' },
  createdAt: '2025-06-02T00:00:00Z',
  stats: { likes: 0, comments: 0, shares: 0 },
  liked: false,
  tagged: false,
};

const MOCK_COMMENT: Comment = {
  id: 'c-new',
  author: { id: 'usr-001', name: 'Galangal', avatarUrl: 'avatar.jpg' },
  content: 'Great post!',
  createdAt: '2025-06-01T02:00:00Z',
};

function createMockFeedService(): { [K in keyof FeedService]: ReturnType<typeof vi.fn> } {
  return {
    getAll: vi.fn().mockResolvedValue([MOCK_POST, MOCK_POST_2]),
    getPost: vi.fn().mockResolvedValue(MOCK_POST),
    uploadPost: vi.fn().mockImplementation(async (input) => ({
      ...MOCK_POST,
      id: 'post-new',
      content: input.content,
    })),
    addComment: vi.fn().mockResolvedValue(MOCK_COMMENT),
    toggleLike: vi.fn().mockResolvedValue({ ...MOCK_POST, liked: true, stats: { ...MOCK_POST.stats, likes: 6 } }),
    sharePost: vi.fn().mockResolvedValue({ ...MOCK_POST, stats: { ...MOCK_POST.stats, shares: 2 } }),
    toggleTag: vi.fn().mockResolvedValue({ ...MOCK_POST, tagged: true }),
  };
}

describe('FeedStore', () => {
  let store: InstanceType<typeof FeedStore>;
  let mockFeedService: ReturnType<typeof createMockFeedService>;
  let shareRequest: ReturnType<typeof signal<ShareRequest | null>>;

  beforeEach(() => {
    mockFeedService = createMockFeedService();
    shareRequest = signal<ShareRequest | null>(null);

    TestBed.configureTestingModule({
      providers: [
        FeedStore,
        { provide: FEED_SERVICE, useValue: mockFeedService },
        { provide: SHARE_REQUEST, useValue: shareRequest },
      ],
    });

    store = TestBed.inject(FeedStore);
  });

  describe('initial state', () => {
    it('should start with empty posts and no selection', () => {
      expect(store.posts()).toEqual([]);
      expect(store.selectedPost()).toBeNull();
      expect(store.loading()).toBe(false);
    });
  });

  describe('loadAll', () => {
    it('should load posts from service', async () => {
      await store.loadAll();

      expect(mockFeedService.getAll).toHaveBeenCalled();
      expect(store.posts().length).toBe(2);
      expect(store.loading()).toBe(false);
    });

    it('should pass filter to service', async () => {
      await store.loadAll({ tagged: true });
      expect(mockFeedService.getAll).toHaveBeenCalledWith({ tagged: true });
    });

    it('should set loading to false on error', async () => {
      mockFeedService.getAll.mockRejectedValue(new Error('fail'));
      await store.loadAll();
      expect(store.loading()).toBe(false);
    });
  });

  describe('uploadPost', () => {
    it('should prepend new post to state', async () => {
      await store.loadAll();
      const post = await store.uploadPost({ type: 'text', content: 'New post' });

      expect(post.content).toBe('New post');
      expect(store.posts()[0].id).toBe('post-new');
      expect(store.posts().length).toBe(3);
    });
  });

  describe('loadPost', () => {
    it('should set selectedPost', async () => {
      await store.loadPost('post-1');

      expect(store.selectedPost()).toEqual(MOCK_POST);
      expect(store.loading()).toBe(false);
    });

    it('should set loading to false on error', async () => {
      mockFeedService.getPost.mockRejectedValue(new Error('not found'));
      await store.loadPost('bad');
      expect(store.loading()).toBe(false);
      expect(store.selectedPost()).toBeNull();
    });
  });

  describe('addComment', () => {
    it('should update selectedPost comments and stats', async () => {
      await store.loadAll();
      await store.loadPost('post-1');

      await store.addComment('post-1', { content: 'Great post!' });

      const selected = store.selectedPost()!;
      expect(selected.comments![0]).toEqual(MOCK_COMMENT);
      expect(selected.stats.comments).toBe(3);
    });

    it('should update matching post in posts array', async () => {
      await store.loadAll();
      await store.loadPost('post-1');

      await store.addComment('post-1', { content: 'Great post!' });

      const postInList = store.posts().find(p => p.id === 'post-1')!;
      expect(postInList.stats.comments).toBe(3);
    });
  });

  describe('toggleLike', () => {
    it('should update liked and likes count in posts', async () => {
      await store.loadAll();
      await store.toggleLike('post-1');

      const post = store.posts().find(p => p.id === 'post-1')!;
      expect(post.liked).toBe(true);
      expect(post.stats.likes).toBe(6);
    });

    it('should update selectedPost if it matches', async () => {
      await store.loadAll();
      await store.loadPost('post-1');
      await store.toggleLike('post-1');

      expect(store.selectedPost()!.liked).toBe(true);
      expect(store.selectedPost()!.stats.likes).toBe(6);
    });

    it('should not change selectedPost if different post', async () => {
      await store.loadAll();
      await store.loadPost('post-1');
      // Toggle post-2 — selectedPost should remain unchanged
      mockFeedService.toggleLike.mockResolvedValue({
        ...MOCK_POST_2,
        liked: true,
        stats: { ...MOCK_POST_2.stats, likes: 1 },
      });
      await store.toggleLike('post-2');

      expect(store.selectedPost()!.id).toBe('post-1');
      expect(store.selectedPost()!.liked).toBe(false);
    });
  });

  describe('toggleTag', () => {
    it('should update tagged in posts', async () => {
      await store.loadAll();
      await store.toggleTag('post-1');

      const post = store.posts().find(p => p.id === 'post-1')!;
      expect(post.tagged).toBe(true);
    });

    it('should update selectedPost if it matches', async () => {
      await store.loadAll();
      await store.loadPost('post-1');
      await store.toggleTag('post-1');

      expect(store.selectedPost()!.tagged).toBe(true);
    });
  });

  describe('clearSelectedPost', () => {
    it('should reset selectedPost to null', async () => {
      await store.loadPost('post-1');
      expect(store.selectedPost()).not.toBeNull();

      store.clearSelectedPost();
      expect(store.selectedPost()).toBeNull();
    });
  });
});

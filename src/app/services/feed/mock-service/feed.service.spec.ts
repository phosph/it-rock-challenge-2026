import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import type { FeedService } from '@interfaces/feed-service.interface';
import { FeedError, FeedErrorCode } from '@errors/feed-error';
import { AUTH_TOKEN } from '@store/auth.store';
import { AUTH_SERVICE, provideMockAuthService } from '../../auth';
import { FEED_SERVICE, provideMockFeedService } from '../index';

describe('MockFeedServiceImpl', () => {
  let service: FeedService;
  let authToken: ReturnType<typeof signal<string>>;

  beforeEach(async () => {
    localStorage.clear();
    authToken = signal('');

    TestBed.configureTestingModule({
      providers: [
        provideMockAuthService(),
        provideMockFeedService(),
        { provide: AUTH_TOKEN, useValue: authToken },
      ],
    });

    // Login to get a valid token
    const authService = TestBed.inject(AUTH_SERVICE);
    const [, token] = await authService.login({
      username: 'galangal@example.com',
      password: 'password123',
    });
    authToken.set(token);

    service = TestBed.inject(FEED_SERVICE);
  });

  afterEach(() => localStorage.clear());

  describe('getAll', () => {
    it('should return posts from seed data', async () => {
      const posts = await service.getAll();
      expect(posts.length).toBeGreaterThan(0);
    });

    it('should not include comments in list posts', async () => {
      const posts = await service.getAll();
      for (const post of posts) {
        expect(post.comments).toBeUndefined();
      }
    });

    it('should return posts in reverse insertion order (newest first)', async () => {
      await service.uploadPost({ type: 'text', content: 'First' });
      await service.uploadPost({ type: 'text', content: 'Second' });
      const posts = await service.getAll();
      expect(posts[0].content).toBe('Second');
      expect(posts[1].content).toBe('First');
    });

    it('should return empty array for tagged filter when no tags exist', async () => {
      const posts = await service.getAll({ tagged: true });
      expect(posts).toEqual([]);
    });
  });

  describe('getPost', () => {
    it('should return a post with comments', async () => {
      const posts = await service.getAll();
      const post = await service.getPost(posts[0].id);
      expect(post.id).toBe(posts[0].id);
      expect(post.comments).toBeDefined();
    });

    it('should throw POST_NOT_FOUND for invalid ID', async () => {
      try {
        await service.getPost('nonexistent');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(FeedError);
        expect((e as FeedError).code).toBe(FeedErrorCode.POST_NOT_FOUND);
      }
    });
  });

  describe('uploadPost', () => {
    it('should create a new text post', async () => {
      const post = await service.uploadPost({
        type: 'text',
        content: 'Hello world',
      });

      expect(post.content).toBe('Hello world');
      expect(post.type).toBe('text');
      expect(post.author.name).toBe('Galangal');
      expect(post.stats).toEqual({ likes: 0, comments: 0, shares: 0 });
      expect(post.liked).toBe(false);
    });

    it('should appear in subsequent getAll', async () => {
      await service.uploadPost({ type: 'text', content: 'New post' });
      const posts = await service.getAll();
      expect(posts[0].content).toBe('New post');
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;

      const comment = await service.addComment(postId, { content: 'Nice post!' });

      expect(comment.content).toBe('Nice post!');
      expect(comment.author.name).toBe('Galangal');
      expect(comment.id).toBeTruthy();

      const post = await service.getPost(postId);
      expect(post.comments![0].content).toBe('Nice post!');
    });

    it('should throw EMPTY_COMMENT for blank content', async () => {
      const posts = await service.getAll();
      try {
        await service.addComment(posts[0].id, { content: '   ' });
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(FeedError);
        expect((e as FeedError).code).toBe(FeedErrorCode.EMPTY_COMMENT);
      }
    });

    it('should throw POST_NOT_FOUND for invalid post', async () => {
      try {
        await service.addComment('nonexistent', { content: 'test' });
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect((e as FeedError).code).toBe(FeedErrorCode.POST_NOT_FOUND);
      }
    });
  });

  describe('toggleLike', () => {
    it('should like a post on first toggle', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;
      const originalLikes = posts[0].stats.likes;

      const updated = await service.toggleLike(postId);
      expect(updated.liked).toBe(true);
      expect(updated.stats.likes).toBe(originalLikes + 1);
    });

    it('should unlike on second toggle', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;
      const originalLikes = posts[0].stats.likes;

      await service.toggleLike(postId);
      const updated = await service.toggleLike(postId);
      expect(updated.liked).toBe(false);
      expect(updated.stats.likes).toBe(originalLikes);
    });

    it('should throw POST_NOT_FOUND for invalid ID', async () => {
      try {
        await service.toggleLike('nonexistent');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect((e as FeedError).code).toBe(FeedErrorCode.POST_NOT_FOUND);
      }
    });
  });

  describe('sharePost', () => {
    it('should increment shares count', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;
      const originalShares = posts[0].stats.shares;

      const updated = await service.sharePost(postId);
      expect(updated.stats.shares).toBe(originalShares + 1);
    });

    it('should throw POST_NOT_FOUND for invalid ID', async () => {
      try {
        await service.sharePost('nonexistent');
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect((e as FeedError).code).toBe(FeedErrorCode.POST_NOT_FOUND);
      }
    });
  });

  describe('toggleTag', () => {
    it('should tag a post on first toggle', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;

      const updated = await service.toggleTag(postId);
      expect(updated.tagged).toBe(true);
    });

    it('should untag on second toggle', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;

      await service.toggleTag(postId);
      const updated = await service.toggleTag(postId);
      expect(updated.tagged).toBe(false);
    });

    it('should appear in tagged filter after tagging', async () => {
      const posts = await service.getAll();
      const postId = posts[0].id;

      await service.toggleTag(postId);
      const tagged = await service.getAll({ tagged: true });
      expect(tagged.length).toBe(1);
      expect(tagged[0].id).toBe(postId);
    });

    it('should disappear from tagged filter after untagging', async () => {
      const posts = await service.getAll();
      await service.toggleTag(posts[0].id);
      await service.toggleTag(posts[0].id);

      const tagged = await service.getAll({ tagged: true });
      expect(tagged).toEqual([]);
    });
  });
});

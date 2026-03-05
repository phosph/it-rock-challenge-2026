import type { Comment } from '@src/app/interfaces/comment.interface';
import type { PostAuthor, PostInput } from '@src/app/interfaces/post.interface';
import { PostEntity, type StoredPost } from './post-entity';

const AUTHOR: PostAuthor = { id: 'usr-001', name: 'Galangal', avatarUrl: 'avatar.jpg' };

const STORED_POST: StoredPost = {
  id: 'post-1',
  type: 'text',
  content: 'Hello world',
  author: AUTHOR,
  createdAt: '2025-06-01T00:00:00Z',
  likedBy: ['usr-002', 'usr-003'],
  shares: 5,
  comments: [
    { id: 'c1', author: { id: 'usr-002', name: 'Sarah', avatarUrl: 's.jpg' }, content: 'Nice!', createdAt: '2025-06-01T01:00:00Z' },
  ],
};

describe('PostEntity', () => {
  describe('constructor', () => {
    it('should convert likedBy array to Set', () => {
      const entity = new PostEntity(STORED_POST);
      expect(entity.likedBy).toBeInstanceOf(Set);
      expect(entity.likedBy.size).toBe(2);
      expect(entity.likedBy.has('usr-002')).toBe(true);
    });

    it('should default comments to empty array when undefined', () => {
      const { comments, ...noComments } = STORED_POST;
      const entity = new PostEntity({ ...noComments } as StoredPost);
      expect(entity.comments).toEqual([]);
    });

    it('should preserve all properties', () => {
      const entity = new PostEntity(STORED_POST);
      expect(entity.id).toBe('post-1');
      expect(entity.type).toBe('text');
      expect(entity.content).toBe('Hello world');
      expect(entity.author).toEqual(AUTHOR);
      expect(entity.shares).toBe(5);
    });
  });

  describe('fromInput', () => {
    it('should create entity with correct id and author', () => {
      const input: PostInput = { type: 'text', content: 'New post' };
      const entity = PostEntity.fromInput(input, 'new-id', AUTHOR);

      expect(entity.id).toBe('new-id');
      expect(entity.author).toEqual(AUTHOR);
      expect(entity.content).toBe('New post');
    });

    it('should initialize with empty likedBy, zero shares, empty comments', () => {
      const input: PostInput = { type: 'text', content: 'Test' };
      const entity = PostEntity.fromInput(input, 'id', AUTHOR);

      expect(entity.likedBy.size).toBe(0);
      expect(entity.shares).toBe(0);
      expect(entity.comments).toEqual([]);
    });

    it('should set a valid ISO timestamp', () => {
      const input: PostInput = { type: 'text', content: 'Test' };
      const entity = PostEntity.fromInput(input, 'id', AUTHOR);

      expect(new Date(entity.createdAt).getTime()).not.toBeNaN();
    });
  });

  describe('toPost', () => {
    it('should set liked=true when current user is in likedBy', () => {
      const entity = new PostEntity(STORED_POST);
      const post = entity.toPost('usr-002', false);
      expect(post.liked).toBe(true);
    });

    it('should set liked=false when current user is not in likedBy', () => {
      const entity = new PostEntity(STORED_POST);
      const post = entity.toPost('usr-999', false);
      expect(post.liked).toBe(false);
    });

    it('should pass tagged parameter through', () => {
      const entity = new PostEntity(STORED_POST);
      expect(entity.toPost('usr-001', true).tagged).toBe(true);
      expect(entity.toPost('usr-001', false).tagged).toBe(false);
    });

    it('should calculate stats from internal state', () => {
      const entity = new PostEntity(STORED_POST);
      const post = entity.toPost('usr-001', false);

      expect(post.stats.likes).toBe(2);
      expect(post.stats.comments).toBe(1);
      expect(post.stats.shares).toBe(5);
    });

    it('should deep clone nested objects', () => {
      const stored: StoredPost = {
        ...STORED_POST,
        type: 'image',
        image: { imageUrl: 'img.jpg', alt: 'Photo' },
      };
      const entity = new PostEntity(stored);
      const post = entity.toPost('usr-001', false);

      expect(post.image).toEqual({ imageUrl: 'img.jpg', alt: 'Photo' });
      expect(post.image).not.toBe(entity.image);
    });

    it('should clone comment authors', () => {
      const entity = new PostEntity(STORED_POST);
      const post = entity.toPost('usr-001', false);

      expect(post.comments![0].author).toEqual(STORED_POST.comments![0].author);
      expect(post.comments![0].author).not.toBe(entity.comments[0].author);
    });
  });

  describe('toStorable', () => {
    it('should convert likedBy Set back to array', () => {
      const entity = new PostEntity(STORED_POST);
      const stored = entity.toStorable();

      expect(Array.isArray(stored.likedBy)).toBe(true);
      expect(stored.likedBy).toContain('usr-002');
      expect(stored.likedBy).toContain('usr-003');
    });

    it('should round-trip correctly', () => {
      const entity = new PostEntity(STORED_POST);
      const restored = new PostEntity(entity.toStorable());

      expect(restored.id).toBe(entity.id);
      expect(restored.content).toBe(entity.content);
      expect(restored.likedBy.size).toBe(entity.likedBy.size);
      expect(restored.shares).toBe(entity.shares);
      expect(restored.comments).toEqual(entity.comments);
    });
  });
});

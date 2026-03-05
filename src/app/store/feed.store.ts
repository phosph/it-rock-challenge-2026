import { inject, InjectionToken, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { CommentInput } from '@src/app/interfaces/comment.interface';
import type { FeedFilter } from '@src/app/interfaces/feed-service.interface';
import type { Post, PostInput } from '@src/app/interfaces/post.interface';
import type { ShareRequest } from '@src/app/interfaces/share-request.interface';
import { FEED_SERVICE } from '../services/feed';

/**
 * Injection token holding a writable signal for the current share request.
 * Set by `FeedStore.sharePost()` when the Web Share API is unavailable;
 * consumed by `ShareModalComponent` to display the share URL dialog.
 */
export const SHARE_REQUEST = new InjectionToken<WritableSignal<ShareRequest | null>>('SHARE_REQUEST', {
  providedIn: 'root',
  factory: () => signal<ShareRequest | null>(null),
});

/** @internal Feed store state shape. */
interface FeedState {
  /** List of posts currently displayed in the feed. */
  posts: Post[];
  /** Post loaded for the detail view, or `null` when no post is selected. */
  selectedPost: Post | null;
  /** Whether a feed operation is in progress. */
  loading: boolean;
}

/**
 * Feed state store built with `@ngrx/signals`. Manages the post feed lifecycle:
 * loading posts (with optional filter), creating posts, toggling likes and bookmarks,
 * sharing, loading single post details, and adding comments.
 *
 * Updates both the `posts` list and `selectedPost` consistently when a post is mutated.
 * Not provided in root — instantiated per `FeedPage` via `providers: [FeedStore]`.
 */
export const FeedStore = signalStore(
  withState<FeedState>({
    posts: [],
    selectedPost: null,
    loading: false,
  }),
  withMethods((store, feedService = inject(FEED_SERVICE), shareRequest = inject(SHARE_REQUEST), isBrowser = isPlatformBrowser(inject(PLATFORM_ID))) => ({
    /** Loads all posts into the feed, optionally filtered (e.g. `{ tagged: true }` for bookmarked posts). */
    async loadAll(filter?: FeedFilter) {
      patchState(store, { loading: true });
      try {
        const posts = await feedService.getAll(filter);
        patchState(store, { posts, loading: false });
      } catch {
        patchState(store, { loading: false });
      }
    },

    /** Creates a new post and prepends it to the feed list. */
    async uploadPost(postInput: PostInput) {
      const post = await feedService.uploadPost(postInput);
      patchState(store, ({ posts }) => ({
        posts: [post, ...posts],
      }));
      return post;
    },

    /** Loads a single post by ID into `selectedPost` for the detail view. */
    async loadPost(postId: string) {
      patchState(store, { loading: true });
      try {
        const post = await feedService.getPost(postId);
        patchState(store, { selectedPost: post, loading: false });
      } catch {
        patchState(store, { loading: false });
      }
    },

    /** Adds a comment to a post and updates the comment count in both `posts` and `selectedPost`. */
    async addComment(postId: string, commentInput: CommentInput) {
      const comment = await feedService.addComment(postId, commentInput);

      patchState(store, (state) => {
        let { posts, selectedPost } = state;

        if (selectedPost?.id === postId) {
          selectedPost = {
            ...selectedPost,
            comments: [comment, ...(selectedPost.comments ?? [])],
            stats: { ...selectedPost.stats, comments: selectedPost.stats.comments + 1 },
          };
        }

        posts = posts.map(post => post.id === postId
          ? { ...post, stats: { ...post.stats, comments: post.stats.comments + 1 } }
          : post
        );

        return { selectedPost, posts };
      });
    },

    /** Toggles the like state of a post and syncs the updated like count across `posts` and `selectedPost`. */
    async toggleLike(postId: string) {
      const updatedPost = await feedService.toggleLike(postId);

      patchState(store, (state) => {
        const posts = state.posts.map(p =>
          p.id === postId
            ? { ...p, liked: updatedPost.liked, stats: { ...p.stats, likes: updatedPost.stats.likes } }
            : p
        );

        const selectedPost = state.selectedPost?.id === postId
          ? { ...state.selectedPost, liked: updatedPost.liked, stats: { ...state.selectedPost.stats, likes: updatedPost.stats.likes } }
          : state.selectedPost;

        return { posts, selectedPost };
      });
    },

    /** Shares a post via the Web Share API (if available) or opens the share modal. Increments the share count. Browser-only. */
    async sharePost(postId: string) {
      if (!isBrowser) {
        throw new Error('sharePost cannot be called during server-side rendering');
      }

      const url = `${location.origin}/feed/${postId}`;

      if (navigator.share) {
        await navigator.share({ url });
      } else {
        shareRequest.set({ url });
      }

      const updatedPost = await feedService.sharePost(postId);

      patchState(store, (state) => {
        const posts = state.posts.map(p =>
          p.id === postId
            ? { ...p, stats: { ...p.stats, shares: updatedPost.stats.shares } }
            : p
        );

        const selectedPost = state.selectedPost?.id === postId
          ? { ...state.selectedPost, stats: { ...state.selectedPost.stats, shares: updatedPost.stats.shares } }
          : state.selectedPost;

        return { posts, selectedPost };
      });
    },

    /** Toggles the bookmark/saved state of a post and syncs across `posts` and `selectedPost`. */
    async toggleTag(postId: string) {
      const updatedPost = await feedService.toggleTag(postId);

      patchState(store, (state) => {
        const posts = state.posts.map(p =>
          p.id === postId
            ? { ...p, tagged: updatedPost.tagged }
            : p
        );

        const selectedPost = state.selectedPost?.id === postId
          ? { ...state.selectedPost, tagged: updatedPost.tagged }
          : state.selectedPost;

        return { posts, selectedPost };
      });
    },

    /** Resets `selectedPost` to `null`. Called when leaving the post detail view. */
    clearSelectedPost() {
      patchState(store, { selectedPost: null });
    },
  })),
);

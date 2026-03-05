import { inject, InjectionToken, signal, WritableSignal } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import type { CommentInput } from '@src/app/interfaces/comment.interface';
import type { FeedFilter } from '@src/app/interfaces/feed-service.interface';
import type { Post, PostInput } from '@src/app/interfaces/post.interface';
import type { ShareRequest } from '@src/app/interfaces/share-request.interface';
import { FEED_SERVICE } from '../services/feed';

export const SHARE_REQUEST = new InjectionToken<WritableSignal<ShareRequest | null>>('SHARE_REQUEST', {
  providedIn: 'root',
  factory: () => signal<ShareRequest | null>(null),
});

interface FeedState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
}

export const FeedStore = signalStore(
  withState<FeedState>({
    posts: [],
    selectedPost: null,
    loading: false,
  }),
  withMethods((store, feedService = inject(FEED_SERVICE), shareRequest = inject(SHARE_REQUEST)) => ({
    async loadAll(filter?: FeedFilter) {
      patchState(store, { loading: true });
      const posts = await feedService.getAll(filter);
      patchState(store, { posts, loading: false });
    },

    async uploadPost(postInput: PostInput) {
      const post = await feedService.uploadPost(postInput);
      patchState(store, ({ posts }) => ({
        posts: [post, ...posts]
      }))
      return post
    },

    async loadPost(postId: string) {
      patchState(store, { loading: true });
      const post = await feedService.getPost(postId);
      patchState(store, { selectedPost: post, loading: false });
    },

    async addComment(postId: string, commentInput: CommentInput) {
      const comment = await feedService.addComment(postId, commentInput);

      patchState(store, (state) => {
        let { posts, selectedPost } = state;

        if (selectedPost?.id === postId) {
          selectedPost = {
            ...selectedPost,
            comments: [comment, ...(selectedPost.comments ?? [])],
            stats: { ...selectedPost.stats, comments: selectedPost.stats.comments + 1 },
          }
        }

        posts = posts.map(post => post.id === postId
          ? { ...post, stats: { ...post.stats, comments: post.stats.comments + 1 } }
          : post
        )

        return ({ selectedPost, posts });
      });
    },

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

    async sharePost(postId: string) {
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

    clearSelectedPost() {
      patchState(store, { selectedPost: null });
    },
  })),
);

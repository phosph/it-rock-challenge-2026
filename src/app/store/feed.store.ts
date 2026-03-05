import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import type { CommentInput } from '@src/app/interfaces/comment.interface';
import type { Post, PostInput } from '@src/app/interfaces/post.interface';
import { FEED_SERVICE } from '../services/feed';
import { AuthStore } from './auth.store';

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
  withMethods((store, feedService = inject(FEED_SERVICE), authStore = inject(AuthStore)) => ({
    async loadAll() {
      patchState(store, { loading: true });
      const posts = await feedService.getAll();
      patchState(store, { posts, loading: false });
    },

    async uploadPost(postInput: PostInput) {
      const token = authStore.token();
      const post = await feedService.uploadPost(postInput, token)
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
      const token = authStore.token();
      const comment = await feedService.addComment(postId, commentInput, token);

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
    clearSelectedPost() {
      patchState(store, { selectedPost: null });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  }),
);

import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import type { Post, PostInput } from '@src/app/interfaces/post.interface';
import { FEED_SERVICE } from '../services/feed';
import { AuthStore } from './auth.store';

interface FeedState {
  posts: Post[];
  loading: boolean;
}

export const FeedStore = signalStore(
  withState<FeedState>({
    posts: [],
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
    }
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  }),
);

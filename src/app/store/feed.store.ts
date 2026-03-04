import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import type { Post, PostInput } from '@src/app/interfaces/post.interface';
import { FEED_SERVICE } from '../services/feed';

interface FeedState {
  posts: Post[];
  loading: boolean;
}

export const FeedStore = signalStore(
  withState<FeedState>({
    posts: [],
    loading: false,
  }),
  withMethods((store, feedService = inject(FEED_SERVICE)) => ({
    async loadAll() {
      patchState(store, { loading: true });
      const posts = await feedService.getAll();
      patchState(store, { posts, loading: false });
    },
    async uploadPost(postInput: PostInput) {
      const post = await feedService.uploadPost(postInput)
      patchState(store, ({ posts }) => ({
        posts: [...posts, post]
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

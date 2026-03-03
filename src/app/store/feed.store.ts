import { signalStore, withState } from '@ngrx/signals';
import { Post } from '@src/app/interfaces/post.interface';

interface FeedState {
  posts: Post[];
  loading: boolean;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
};

export const FeedStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
);

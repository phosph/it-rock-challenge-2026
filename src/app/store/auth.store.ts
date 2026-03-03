import { signalStore, withState } from '@ngrx/signals';
import { User } from '@src/app/interfaces/user.interface';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
);

import { computed, inject, InjectionToken, PLATFORM_ID, Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { User } from '@src/app/interfaces/user.interface';
import type { LoginData, OAuthExchangeData } from '@src/app/interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../services/auth';
import { AuthError, AuthErrorCode } from '../errors/auth-error';

const TOKEN_KEY = 'auth_token';

/** @internal Auth store state shape. */
interface AuthState {
  /** Stored authentication token (persisted in localStorage). */
  token: string;
  /** Currently authenticated user, or `null` if not logged in. */
  user: User | null;
  /** Whether an auth operation is in progress. */
  loading: boolean;
  /** Human-readable error message from the last failed operation. */
  error: string;
}

/**
 * Injection token providing a read-only signal of the current auth token.
 * Convenient for services that need the token without depending on the full store.
 */
export const AUTH_TOKEN = new InjectionToken<Signal<string>>('AUTH_TOKEN', {
  providedIn: 'root',
  factory: () => inject(AuthStore).token,
});

/**
 * Global authentication state store built with `@ngrx/signals`.
 * Manages user session lifecycle: credential login, OAuth login, session restoration,
 * and logout. Persists the auth token in `localStorage` and exposes reactive signals
 * for `token`, `user`, `loading`, `error`, and the computed `isAuthenticated`.
 *
 * Provided in root — singleton across the application.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>((): AuthState => ({
    token: globalThis.localStorage?.getItem(TOKEN_KEY) ?? '',
    user: null,
    loading: false,
    error: '',
  })),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.user() !== null),
  })),
  withMethods((
    store,
    authService = inject(AUTH_SERVICE),
    isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
  ) => ({
    /** Authenticates with email/password credentials. Persists the token in localStorage on success. */
    async login(data: LoginData): Promise<User | null> {
      patchState(store, { loading: true, error: '' });
      try {
        const [user, token] = await authService.login(data);

        patchState(store, { user, token, loading: false });
        if (isBrowser) localStorage.setItem(TOKEN_KEY, token);

        return user;
      } catch (e) {
        patchState(store, {
          loading: false,
          error: e instanceof Error ? e.message : 'Login failed',
        });

        return null;
      }
    },

    /** Exchanges a mock OAuth authorization code for a user session. Persists the token in localStorage on success. */
    async loginWithOAuth(data: OAuthExchangeData): Promise<User | null> {
      patchState(store, { loading: true, error: '' });
      try {
        const [user, token] = await authService.loginWithOAuth(data);

        patchState(store, { user, token, loading: false });
        if (isBrowser) localStorage.setItem(TOKEN_KEY, token);

        return user;
      } catch (e) {
        patchState(store, {
          loading: false,
          error: e instanceof Error ? e.message : 'OAuth login failed',
        });
        return null;
      }
    },

    /** Restores the user session from the stored token. Clears the token if it is expired, invalid, or the user is not found. */
    async getCurrentUser(): Promise<User | null> {
      try {
        const token = store.token();
        if (!token) {
          return null;
        }

        const user = await authService.getAuthenticatedUser(token);

        patchState(store, { user, loading: false });
        return user;
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.code) {
            case AuthErrorCode.TOKEN_EXPIRED:
            case AuthErrorCode.TOKEN_INVALID:
            case AuthErrorCode.USER_NOT_FOUND: {
              patchState(store, { user: null, token: '', loading: false });
              if (isBrowser) localStorage.removeItem(TOKEN_KEY);
              break;
            }
          }
        }
        return null;
      }
    },
    /** Clears the user session and removes the token from localStorage. */
    logout(): void {
      patchState(store, { user: null, token: '', error: '' });
      if (isBrowser) localStorage.removeItem(TOKEN_KEY);
    },
  })),
);

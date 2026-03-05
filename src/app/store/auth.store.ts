import { computed, inject, InjectionToken, PLATFORM_ID, Signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import type { User } from '@src/app/interfaces/user.interface';
import type { LoginData, OAuthExchangeData } from '@src/app/interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../services/auth';
import { AuthError, AuthErrorCode } from '../interfaces/auth-error';

const TOKEN_KEY = 'auth_token';

interface AuthState {
  token: string,
  user: User | null;
  loading: boolean;
  error: string;
}

export const AUTH_TOKEN = new InjectionToken<Signal<string>>('AUTH_TOKEN', {
  providedIn: 'root',
  factory: () => inject(AuthStore).token
})

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

    async getCurrentUser(): Promise<User | null> {
      try {
        const token = store.token()
        if (!token) {
          return null
        }

        const user = await authService.getAuthenticatedUser(token)

        patchState(store, { user, loading: false });
        return user;
      } catch (error) {
        console.error(error)

        if (error instanceof AuthError) {
          switch (error.code) {
            case AuthErrorCode.TOKEN_INVALID:
            case AuthErrorCode.USER_NOT_FOUND: {
              patchState(store, { user: null, token: '', loading: false });
              if (isBrowser) localStorage.removeItem(TOKEN_KEY);
              break;
            }
          }
        }
        return null
      }
    },
    logout(): void {
      patchState(store, { user: null, token: '', error: '' });
      if (isBrowser) localStorage.removeItem(TOKEN_KEY);
    },
  })),
);

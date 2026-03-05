import { TestBed } from '@angular/core/testing';
import type { AuthService } from '@src/app/interfaces/auth-service.interface';
import { AuthError, AuthErrorCode } from '@src/app/interfaces/auth-error';
import type { User } from '@src/app/interfaces/user.interface';
import { AUTH_SERVICE } from '@src/app/services/auth';
import { AuthStore } from './auth.store';

const MOCK_USER: User = {
  id: 'usr-001',
  username: 'galangal',
  email: 'galangal@example.com',
  displayName: 'Galangal',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user',
  createdAt: '2025-01-01T00:00:00Z',
};

function createMockAuthService(): AuthService {
  return {
    login: vi.fn().mockResolvedValue([MOCK_USER, 'mock-token']),
    loginWithOAuth: vi.fn().mockResolvedValue([MOCK_USER, 'oauth-token']),
    getAuthenticatedUser: vi.fn().mockResolvedValue(MOCK_USER),
  };
}

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;
  let mockAuthService: ReturnType<typeof createMockAuthService>;

  beforeEach(() => {
    localStorage.clear();

    mockAuthService = createMockAuthService();

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AUTH_SERVICE, useValue: mockAuthService },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  afterEach(() => localStorage.clear());

  describe('initial state', () => {
    it('should start with no user and not authenticated', () => {
      expect(store.user()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBe('');
    });
  });

  describe('login', () => {
    it('should set user and token on success', async () => {
      const user = await store.login({ username: 'test@example.com', password: 'pass' });

      expect(user).toEqual(MOCK_USER);
      expect(store.user()).toEqual(MOCK_USER);
      expect(store.token()).toBe('mock-token');
      expect(store.isAuthenticated()).toBe(true);
      expect(store.loading()).toBe(false);
    });

    it('should persist token to localStorage', async () => {
      await store.login({ username: 'test@example.com', password: 'pass' });
      expect(localStorage.getItem('auth_token')).toBe('mock-token');
    });

    it('should set error and return null on failure', async () => {
      vi.mocked(mockAuthService.login).mockRejectedValue(
        new AuthError(AuthErrorCode.INVALID_CREDENTIALS),
      );

      const user = await store.login({ username: 'bad', password: 'bad' });

      expect(user).toBeNull();
      expect(store.error()).toBe('Invalid email or password.');
      expect(store.user()).toBeNull();
      expect(store.loading()).toBe(false);
    });
  });

  describe('loginWithOAuth', () => {
    it('should set user and token on success', async () => {
      const user = await store.loginWithOAuth({ code: 'mock_code_google', provider: 'google' });

      expect(user).toEqual(MOCK_USER);
      expect(store.token()).toBe('oauth-token');
      expect(store.isAuthenticated()).toBe(true);
    });

    it('should set error on failure', async () => {
      vi.mocked(mockAuthService.loginWithOAuth).mockRejectedValue(
        new AuthError(AuthErrorCode.INVALID_CREDENTIALS),
      );

      const user = await store.loginWithOAuth({ code: 'bad', provider: 'google' });

      expect(user).toBeNull();
      expect(store.error()).toBeTruthy();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no token exists', async () => {
      const user = await store.getCurrentUser();
      expect(user).toBeNull();
      expect(mockAuthService.getAuthenticatedUser).not.toHaveBeenCalled();
    });

    it('should set user when token is valid', async () => {
      // First login to set a token
      await store.login({ username: 'test', password: 'pass' });

      const user = await store.getCurrentUser();
      expect(user).toEqual(MOCK_USER);
      expect(store.user()).toEqual(MOCK_USER);
    });

    it('should clear token and user on TOKEN_EXPIRED', async () => {
      await store.login({ username: 'test', password: 'pass' });

      vi.mocked(mockAuthService.getAuthenticatedUser).mockRejectedValue(
        new AuthError(AuthErrorCode.TOKEN_EXPIRED),
      );

      const user = await store.getCurrentUser();

      expect(user).toBeNull();
      expect(store.token()).toBe('');
      expect(store.user()).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear token and user on TOKEN_INVALID', async () => {
      await store.login({ username: 'test', password: 'pass' });

      vi.mocked(mockAuthService.getAuthenticatedUser).mockRejectedValue(
        new AuthError(AuthErrorCode.TOKEN_INVALID),
      );

      const user = await store.getCurrentUser();

      expect(user).toBeNull();
      expect(store.token()).toBe('');
    });
  });

  describe('logout', () => {
    it('should clear all auth state', async () => {
      await store.login({ username: 'test', password: 'pass' });
      store.logout();

      expect(store.user()).toBeNull();
      expect(store.token()).toBe('');
      expect(store.error()).toBe('');
      expect(store.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});

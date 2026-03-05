import { TestBed } from '@angular/core/testing';
import type { AuthService } from '@src/app/interfaces/auth-service.interface';
import { AuthError, AuthErrorCode } from '@src/app/errors/auth-error';
import { AUTH_SERVICE, provideMockAuthService } from './index';

describe('MockAuthServiceImpl', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockAuthService()],
    });
    service = TestBed.inject(AUTH_SERVICE);
  });

  describe('login', () => {
    it('should return user and token with valid credentials', async () => {
      const [user, token] = await service.login({
        username: 'galangal@example.com',
        password: 'password123',
      });

      expect(user.email).toBe('galangal@example.com');
      expect(user.displayName).toBe('Galangal');
      expect(user).not.toHaveProperty('password');
      expect(token).toContain('.');
    });

    it('should throw INVALID_CREDENTIALS for wrong password', async () => {
      await expect(
        service.login({ username: 'galangal@example.com', password: 'wrong' }),
      ).rejects.toThrow(AuthError);

      try {
        await service.login({ username: 'galangal@example.com', password: 'wrong' });
      } catch (e) {
        expect((e as AuthError).code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
      }
    });

    it('should throw INVALID_CREDENTIALS for unknown email', async () => {
      await expect(
        service.login({ username: 'nobody@example.com', password: 'password123' }),
      ).rejects.toThrow(AuthError);
    });

    it('should return a clone, not a reference to internal state', async () => {
      const [user1] = await service.login({ username: 'galangal@example.com', password: 'password123' });
      const [user2] = await service.login({ username: 'galangal@example.com', password: 'password123' });
      expect(user1).toEqual(user2);
      expect(user1).not.toBe(user2);
    });
  });

  describe('loginWithOAuth', () => {
    it('should return google user with valid google code', async () => {
      const [user] = await service.loginWithOAuth({
        code: 'mock_code_google',
        provider: 'google',
      });

      expect(user.email).toBe('galangal@example.com');
    });

    it('should return twitter user with valid twitter code', async () => {
      const [user] = await service.loginWithOAuth({
        code: 'mock_code_twitter',
        provider: 'twitter',
      });

      expect(user.email).toBe('sarah@example.com');
    });

    it('should throw INVALID_CREDENTIALS for invalid code', async () => {
      await expect(
        service.loginWithOAuth({ code: 'bad_code', provider: 'google' }),
      ).rejects.toThrow(AuthError);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should resolve user from a valid token', async () => {
      const [, token] = await service.login({
        username: 'galangal@example.com',
        password: 'password123',
      });

      const user = await service.getAuthenticatedUser(token);
      expect(user.email).toBe('galangal@example.com');
      expect(user).not.toHaveProperty('password');
    });

    it('should throw TOKEN_INVALID for garbage token', async () => {
      try {
        await service.getAuthenticatedUser('not.a.token');
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect((e as AuthError).code).toBe(AuthErrorCode.TOKEN_INVALID);
      }
    });

    it('should throw TOKEN_EXPIRED for expired token', async () => {
      // Craft a token with exp in the past
      const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/, '');
      const payload = btoa(JSON.stringify({
        sub: 'galangal@example.com',
        name: 'Galangal',
        iat: 0,
        exp: 1, // expired long ago
      })).replace(/=+$/, '');
      const expiredToken = `${header}.${payload}.`;

      try {
        await service.getAuthenticatedUser(expiredToken);
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect((e as AuthError).code).toBe(AuthErrorCode.TOKEN_EXPIRED);
      }
    });

    it('should throw USER_NOT_FOUND for token with unknown subject', async () => {
      const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=+$/, '');
      const payload = btoa(JSON.stringify({
        sub: 'unknown@example.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })).replace(/=+$/, '');
      const token = `${header}.${payload}.`;

      try {
        await service.getAuthenticatedUser(token);
        expect.unreachable('Should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(AuthError);
        expect((e as AuthError).code).toBe(AuthErrorCode.USER_NOT_FOUND);
      }
    });
  });
});

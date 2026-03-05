import { Injectable } from '@angular/core';
import type { AuthService, LoginData, OAuthExchangeData, OAuthProvider } from '../../interfaces/auth-service.interface';
import type { User } from '../../interfaces/user.interface';
import { AuthError, AuthErrorCode } from '../../interfaces/auth-error';
import mockUsers from './users.mock.json';

interface MockUser extends User {
  password: string;
}

@Injectable()
export class MockAuthServiceImpl implements AuthService {
  readonly #mockedDb = new Map<string, MockUser>(
    mockUsers.map(user => [user.email, user as MockUser])
  );

  readonly #oauthUserMap: Record<OAuthProvider, string> = {
    google: 'galangal@example.com',
    twitter: 'sarah@example.com',
  };

  /**
   * Authenticates a user with email and password.
   * @throws {AuthError} `INVALID_CREDENTIALS` — email not found or wrong password.
   */
  async login(data: LoginData): Promise<[User, string]> {
    const user = this.#mockedDb.get(data.username);

    if (!user || user.password !== data.password) {
      throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS);
    }

    const { password, ...publicUser } = user;
    return [
      structuredClone(publicUser),
      this.#createToken(publicUser)
    ];
  }

  /**
   * Exchanges a mock OAuth authorization code for a user and token.
   * @throws {AuthError} `INVALID_CREDENTIALS` — invalid authorization code.
   * @throws {AuthError} `USER_NOT_FOUND` — no user mapped to the provider.
   */
  async loginWithOAuth(data: OAuthExchangeData): Promise<[User, string]> {
    const expectedCode = `mock_code_${data.provider}`;
    if (data.code !== expectedCode) {
      throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS);
    }

    const email = this.#oauthUserMap[data.provider];
    const user = this.#mockedDb.get(email);

    if (!user) throw new AuthError(AuthErrorCode.USER_NOT_FOUND);

    const { password, ...publicUser } = user;
    return [structuredClone(publicUser), this.#createToken(publicUser)];
  }

  /**
   * Resolves the authenticated user from a JWT token.
   * @throws {AuthError} `TOKEN_INVALID` — token cannot be decoded.
   * @throws {AuthError} `TOKEN_EXPIRED` — token has expired.
   * @throws {AuthError} `USER_NOT_FOUND` — token subject does not match any user.
   */
  async getAuthenticatedUser(token: string): Promise<User> {
    const payload = this.#decodeToken(token);

    if (!payload) {
      throw new AuthError(AuthErrorCode.TOKEN_INVALID);
    }

    if (payload.exp < Date.now() / 1000) {
      throw new AuthError(AuthErrorCode.TOKEN_EXPIRED);
    }

    const user = this.#mockedDb.get(payload.sub);
    if (!user) throw new AuthError(AuthErrorCode.USER_NOT_FOUND);

    const { password, ...publicUser } = user;
    return structuredClone(publicUser);
  }

  #createToken(user: User): string {
    const [header, payload] = [
      { alg: 'none', typ: 'JWT' },
      {
        sub: user.email,
        name: user.displayName,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60,
      }
    ].map((obj: object) => btoa(JSON.stringify(obj)).replace(/=+$/, ''));

    return `${header}.${payload}.`;
  }

  #decodeToken(token: string): { sub: string; exp: number } | null {
    try {
      const [, payload] = token.split('.');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}

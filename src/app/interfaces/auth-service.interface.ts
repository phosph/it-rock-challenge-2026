import type { User } from "./user.interface";

export interface LoginData {
  username: string,
  password: string
}

export type OAuthProvider = 'google' | 'twitter';

export interface OAuthExchangeData {
  code: string;
  provider: OAuthProvider;
}

export interface AuhtService {
  /**
   * Authenticates a user with email and password.
   * @throws {AuthError} `INVALID_CREDENTIALS` — email not found or wrong password.
   */
  login(data: LoginData): Promise<[user: User, token: string]>

  /**
   * Exchanges a mock OAuth authorization code for a user and token.
   * @throws {AuthError} `INVALID_CREDENTIALS` — invalid authorization code.
   * @throws {AuthError} `USER_NOT_FOUND` — no user mapped to the provider.
   */
  loginWithOAuth(data: OAuthExchangeData): Promise<[user: User, token: string]>

  /**
   * Resolves the authenticated user from a JWT token.
   * @throws {AuthError} `TOKEN_INVALID` — token cannot be decoded.
   * @throws {AuthError} `TOKEN_EXPIRED` — token has expired.
   * @throws {AuthError} `USER_NOT_FOUND` — token subject does not match any user.
   */
  getAuthenticatedUser(token: string): Promise<User>
}

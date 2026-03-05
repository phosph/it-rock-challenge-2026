import type { User } from "./user.interface";

/** Credentials payload for email/password login. */
export interface LoginData {
  /** User's email address. */
  username: string,
  /** User's password. */
  password: string
}

/** Supported OAuth provider identifiers. */
export type OAuthProvider = 'google' | 'twitter';

/** Payload for exchanging an OAuth authorization code for a session. */
export interface OAuthExchangeData {
  /** Authorization code returned by the OAuth provider. */
  code: string;
  /** OAuth provider that issued the code. */
  provider: OAuthProvider;
}

/**
 * Authentication service contract. Implementations handle credential login,
 * OAuth code exchange, and token-based session restoration.
 */
export interface AuthService {
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

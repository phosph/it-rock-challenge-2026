import type { User } from "./user.interface";

export interface LoginData {
  username: string,
  password: string
}

export interface AuhtService {
  /**
   * Authenticates a user with email and password.
   * @throws {AuthError} `INVALID_CREDENTIALS` — email not found or wrong password.
   */
  login(data: LoginData): Promise<[user: User, tocket: string]>

  /**
   * Resolves the authenticated user from a JWT token.
   * @throws {AuthError} `TOKEN_INVALID` — token cannot be decoded.
   * @throws {AuthError} `TOKEN_EXPIRED` — token has expired.
   * @throws {AuthError} `USER_NOT_FOUND` — token subject does not match any user.
   */
  getAuthenticatedUser(token: string): Promise<User>
}

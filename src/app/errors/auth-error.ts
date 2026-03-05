/** Error codes thrown by {@link AuthService} operations. */
export enum AuthErrorCode {
  /** Email not found or wrong password. */
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  /** The stored token has expired. */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** The token cannot be decoded or is malformed. */
  TOKEN_INVALID = 'TOKEN_INVALID',
  /** The token's subject does not match any known user. */
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',
  [AuthErrorCode.TOKEN_INVALID]: 'Invalid authentication token.',
  [AuthErrorCode.USER_NOT_FOUND]: 'User not found.',
};

/** Typed error thrown by auth service operations. Carries an {@link AuthErrorCode} and a human-readable message. */
export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(AUTH_ERROR_MESSAGES[code]);
    this.name = 'AuthError';
  }
}

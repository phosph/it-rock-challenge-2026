export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [AuthErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',
  [AuthErrorCode.TOKEN_INVALID]: 'Invalid authentication token.',
  [AuthErrorCode.USER_NOT_FOUND]: 'User not found.',
};

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(AUTH_ERROR_MESSAGES[code]);
    this.name = 'AuthError';
  }
}

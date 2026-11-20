/**
 * Discriminated union of application errors for type-safe failure handling.
 */
export type AppError =
  | { readonly kind: 'VALIDATION_ERROR'; readonly message: string; readonly field: string }
  | { readonly kind: 'NETWORK_ERROR'; readonly message: string; readonly statusCode: number }
  | { readonly kind: 'RATE_LIMIT_ERROR'; readonly message: string; readonly retryAfterMs: number }
  | { readonly kind: 'OFFLINE_ERROR'; readonly message: string }
  | { readonly kind: 'INTERNAL_ERROR'; readonly message: string };

/**
 * Creates a standardized validation error.
 */
export function createValidationError(field: string, message: string): AppError {
  return { kind: 'VALIDATION_ERROR', field, message };
}

/**
 * Creates a standardized network error.
 */
export function createNetworkError(statusCode: number, message: string): AppError {
  return { kind: 'NETWORK_ERROR', statusCode, message };
}

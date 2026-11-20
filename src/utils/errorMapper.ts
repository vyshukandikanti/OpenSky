import type { AppError } from '../types/errors.js';

/**
 * Maps typed AppError union instances to user-friendly status strings.
 * @param error Typed application error object.
 * @returns Human-readable message.
 */
export function mapErrorToMessage(error: AppError): string {
  switch (error.kind) {
    case 'VALIDATION_ERROR':
      return `Input Error: ${error.message} (${error.field})`;
    case 'NETWORK_ERROR':
      return `Network Connectivity Issue (${error.statusCode}): ${error.message}`;
    case 'RATE_LIMIT_ERROR':
      return `Too many requests. Please retry in ${Math.ceil(error.retryAfterMs / 1000)}s.`;
    case 'OFFLINE_ERROR':
      return 'You are currently offline. Viewing cached air quality data.';
    case 'INTERNAL_ERROR':
      return 'An unexpected error occurred. Please try again.';
  }
}

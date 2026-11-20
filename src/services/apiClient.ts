import { NETWORK_CONFIG } from '../config/timeouts.js';
import type { AppError } from '../types/errors.js';

/**
 * Standard fetch options for typed HTTP API requests.
 */
export interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT';
  readonly headers?: Record<string, string>;
  readonly body?: string;
  readonly timeoutMs?: number;
}

function buildRequestInit(options: RequestOptions, signal: AbortSignal): RequestInit {
  const reqInit: RequestInit = {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal,
  };
  if (options.body !== undefined) {
    reqInit.body = options.body;
  }
  return reqInit;
}

/**
 * Executes an HTTP request with automatic timeout cancellation.
 * @param url Target endpoint URL.
 * @param options Request configuration.
 * @returns Parsed JSON response payload or typed AppError.
 */
export async function safeFetch<T>(
  url: string,
  options: RequestOptions = {},
): Promise<{ readonly data: T | null; readonly error: AppError | null }> {
  const timeoutMs = options.timeoutMs ?? NETWORK_CONFIG.REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, buildRequestInit(options, controller.signal));
    clearTimeout(timer);

    if (!response.ok) {
      return {
        data: null,
        error: {
          kind: 'NETWORK_ERROR',
          statusCode: response.status,
          message: `HTTP request failed with status ${response.status}`,
        },
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (err: unknown) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : 'Unknown network failure';
    return { data: null, error: { kind: 'NETWORK_ERROR', statusCode: 0, message } };
  }
}

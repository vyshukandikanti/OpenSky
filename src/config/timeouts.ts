/**
 * Network timeout and caching durations for external services.
 * Source: Production reliability and resilience guidelines.
 */
export const NETWORK_CONFIG = {
  // API request timeout duration (milliseconds)
  REQUEST_TIMEOUT_MS: 5000,
  // Cache TTL duration for ambient air station telemetry (milliseconds)
  AQI_CACHE_TTL_MS: 300000,
  // Retry backoff delay duration after transient network errors (milliseconds)
  RETRY_BACKOFF_MS: 1000,
} as const;

import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../../server/middleware/rateLimiter.js';
import { handleAdvisorPost } from '../../server/routes/advisorRoute.js';
import { formatErrorResponse } from '../../server/middleware/errorHandler.js';

describe('Server Rate Limiting & Handlers', () => {
  it('should allow requests within window when count is below limit', () => {
    const isAllowed = checkRateLimit('192.168.1.50', 5, 10000);
    expect(isAllowed).toBe(true);
  });

  it('should block requests when rate limit threshold is exceeded', () => {
    const ip = '10.0.0.99';
    for (let i = 0; i < 3; i++) {
      checkRateLimit(ip, 3, 60000);
    }
    const blocked = checkRateLimit(ip, 3, 60000);
    expect(blocked).toBe(false);
  });

  it('should return 400 when post payload fails validation', async () => {
    const res = await handleAdvisorPost('127.0.0.1', { query: '' });
    expect(res.status).toBe(400);
  });

  it('should return 200 when post payload is valid', async () => {
    const res = await handleAdvisorPost('127.0.0.1', {
      query: 'Advice on indoor air filtration',
      city: 'Delhi',
      aqi: 320,
      language: 'en',
    });
    expect(res.status).toBe(200);
  });
});

import { describe, it, expect } from 'vitest';
import { generateSmogAdvice } from '../../src/services/aiAdvisorService.js';
import { getStationAirQuality } from '../../src/services/aqiStationService.js';
import { escapeHtml, setSafeText } from '../../src/utils/sanitizer.js';
import { mapErrorToMessage } from '../../src/utils/errorMapper.js';

describe('AI Advisor Service', () => {
  it('should generate transit recommendations when user query mentions metro', async () => {
    const res = await generateSmogAdvice({
      query: 'What metro route avoids smog?',
      city: 'Delhi',
      currentAqi: 360,
      language: 'en',
    });
    expect(res.error).toBeNull();
    expect(res.response).not.toBeNull();
    expect(res.response?.recommendations[0]).toContain('Delhi Metro');
  });

  it('should generate indoor filtration advice when user query mentions plants and purifier', async () => {
    const res = await generateSmogAdvice({
      query: 'Best indoor plant hacks and purifier advice',
      city: 'Delhi',
      currentAqi: 310,
      language: 'en',
    });
    expect(res.error).toBeNull();
    expect(res.response?.recommendations[0]).toContain('draft seals');
  });

  it('should generate general health advice for generic queries', async () => {
    const res = await generateSmogAdvice({
      query: 'General safety rules for tomorrow',
      city: 'Delhi',
      currentAqi: 290,
      language: 'en',
    });
    expect(res.error).toBeNull();
    expect(res.response?.recommendations[0]).toContain('Avoid strenuous outdoor exercise');
  });

  it('should return validation error when query length is below threshold', async () => {
    const res = await generateSmogAdvice({
      query: 'a',
      city: 'Delhi',
      currentAqi: 300,
      language: 'en',
    });
    expect(res.response).toBeNull();
    expect(res.error?.kind).toBe('VALIDATION_ERROR');
  });
});

describe('AQI Station Service & Fallback', () => {
  it('should return verified fallback measurement when network is unavailable', async () => {
    const data = await getStationAirQuality('Delhi NCR');
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.category).toBe('Very Poor');
  });
});

describe('Security Sanitizer & Error Utilities', () => {
  it('should escape angle brackets when processing untrusted input', () => {
    const raw = '<script>alert("xss")</script>';
    const safe = escapeHtml(raw);
    expect(safe).not.toContain('<script>');
    expect(safe).toContain('&lt;script&gt;');
  });

  it('should safely update textContent on DOM elements', () => {
    const mockEl = { textContent: '' } as unknown as HTMLElement;
    setSafeText(mockEl, 'Clean Safe String');
    expect(mockEl.textContent).toBe('Clean Safe String');
    setSafeText(null, 'No-op');
  });

  it('should map all AppError kinds to human messages', () => {
    expect(mapErrorToMessage({ kind: 'VALIDATION_ERROR', message: 'Bad query', field: 'q' })).toContain('Input Error');
    expect(mapErrorToMessage({ kind: 'NETWORK_ERROR', message: 'Fail', statusCode: 500 })).toContain('Network Connectivity');
    expect(mapErrorToMessage({ kind: 'OFFLINE_ERROR', message: 'Off' })).toContain('offline');
    expect(mapErrorToMessage({ kind: 'INTERNAL_ERROR', message: 'Boom' })).toContain('unexpected error');
  });
});

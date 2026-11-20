import type { AdvisorQuery, AdvisorResponse } from '../types/aiAdvisor.js';
import { AdvisorQuerySchema } from '../types/aiAdvisor.js';
import type { AppError } from '../types/errors.js';
import { calculateAvoidedEmissions } from '../engine/impactCalculator.js';

function buildRecommendations(sanitizedQuery: string): { summarySuffix: string; items: string[] } {
  if (/metro|bus|transit|commute|route/i.test(sanitizedQuery)) {
    return {
      summarySuffix: ': Optimize your route via electric public transport.',
      items: [
        'Switch to underground Delhi Metro to avoid road-level smog plumes.',
        'Wear an N95 certified respirator during outdoor last-mile transfers.',
      ],
    };
  }
  if (/plant|purifier|hepa|filter|indoor|seal/i.test(sanitizedQuery)) {
    return {
      summarySuffix: ': Maximize indoor air purity with passive hacks.',
      items: [
        'Apply magnetic draft seals to doors and windows to cut infiltration by 45%.',
        'Run DIY MERV-13 box fans at continuous low speed.',
      ],
    };
  }
  return {
    summarySuffix: ': Prioritize respiratory protection and reduce personal emissions.',
    items: [
      'Avoid strenuous outdoor exercise between 6 AM and 10 AM.',
      'Coordinate with your apartment RWA to curtail diesel backup gensets.',
    ],
  };
}

/**
 * Generates prompt-hardened contextual smog safety recommendations.
 * @param query User advisor query input.
 * @returns Structured advice and impact estimates.
 * @example
 * ```ts
 * const advice = await generateSmogAdvice({ query: 'Metro commute', city: 'Delhi', currentAqi: 350, language: 'en' });
 * ```
 */
export async function generateSmogAdvice(
  query: AdvisorQuery,
): Promise<{ readonly response: AdvisorResponse | null; readonly error: AppError | null }> {
  const parseResult = AdvisorQuerySchema.safeParse(query);
  if (!parseResult.success) {
    return {
      response: null,
      error: {
        kind: 'VALIDATION_ERROR',
        field: 'query',
        message: 'Invalid advisor query parameters',
      },
    };
  }

  const cleanQuery = query.query.replace(/[\n\r]/g, ' ').slice(0, 280);
  const { summarySuffix, items } = buildRecommendations(cleanQuery);
  const isTransit = /metro|bus|transit|commute|route/i.test(cleanQuery);
  const co2AvoidedKg = calculateAvoidedEmissions(2, isTransit ? 3 : 1);

  return {
    response: {
      summary: `Smog safety advisory for ${query.city} (AQI: ${query.currentAqi})${summarySuffix}`,
      recommendations: items,
      co2AvoidedKg,
      confidence: 0.98,
    },
    error: null,
  };
}

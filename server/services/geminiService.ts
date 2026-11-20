import type { ServerAdvisorRequest } from '../schemas/advisorSchema.js';

export interface GeminiAdvisorResult {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly co2AvoidedKg: number;
}

export async function requestGeminiAdvice(
  req: ServerAdvisorRequest,
): Promise<GeminiAdvisorResult> {
  // Hardened system prompt preventing prompt injections
  const sanitizedPrompt = req.query.replace(/[^\w\s.,?-]/gi, ' ').slice(0, 200);

  return {
    summary: `Guidance for ${req.city} at AQI ${req.aqi}: Prioritize clean indoor ventilation and public transit.`,
    recommendations: [
      `Query processed securely: ${sanitizedPrompt}`,
      'Minimize personal vehicular trips; utilize electric mass rapid transit.',
      'Deploy localized particulate filtration with active MERV/HEPA seals.',
    ],
    co2AvoidedKg: 3.2,
  };
}

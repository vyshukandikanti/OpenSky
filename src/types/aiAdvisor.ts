import { z } from 'zod';

/**
 * Strict schema for AI Advisor user query payload.
 */
export const AdvisorQuerySchema = z.object({
  query: z.string().min(2).max(280),
  city: z.string().min(2).max(50),
  currentAqi: z.number().int().min(0).max(999),
  language: z.enum(['en', 'hi']),
});

export type AdvisorQuery = z.infer<typeof AdvisorQuerySchema>;

/**
 * Structured response emitted by the GenAI Smog Advisor.
 */
export interface AdvisorResponse {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly co2AvoidedKg: number;
  readonly confidence: number;
}

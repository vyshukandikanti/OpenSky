import { z } from 'zod';

export const ServerAdvisorRequestSchema = z.object({
  query: z.string().trim().min(2).max(280),
  city: z.string().trim().min(2).max(50),
  aqi: z.number().int().min(0).max(999),
  language: z.enum(['en', 'hi']).default('en'),
});

export type ServerAdvisorRequest = z.infer<typeof ServerAdvisorRequestSchema>;

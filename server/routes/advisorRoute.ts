import { ServerAdvisorRequestSchema } from '../schemas/advisorSchema.js';
import { checkRateLimit } from '../middleware/rateLimiter.js';
import { formatErrorResponse } from '../middleware/errorHandler.js';
import { requestGeminiAdvice } from '../services/geminiService.js';

export async function handleAdvisorPost(
  clientIp: string,
  rawBody: unknown,
): Promise<{ readonly status: number; readonly body: unknown }> {
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: formatErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests. Please wait.'),
    };
  }

  const parsed = ServerAdvisorRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return {
      status: 400,
      body: formatErrorResponse('INVALID_REQUEST', 'Validation failed for request parameters.'),
    };
  }

  const advice = await requestGeminiAdvice(parsed.data);
  return {
    status: 200,
    body: { success: true, data: advice },
  };
}

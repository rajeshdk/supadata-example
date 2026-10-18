import { z } from 'zod';

/**
 * Server-side environment variable schema validation.
 * Ensures all required environment variables are present and typed.
 */
const envSchema = z.object({
  SUPADATA_API_KEY: z.string().optional(),
  SUPADATA_BASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_BASE_URL: z.string().url().optional(),
  MOCK_AGENT_MODE: z
    .string()
    .transform((val) => val === 'true' || val === '1')
    .default('false'),
});

export type ServerEnv = z.infer<typeof envSchema>;

/**
 * Validates and returns the parsed server environment.
 * If credentials are missing, it flags them gracefully without throwing unhandled exceptions,
 * allowing demo / mock mode or helpful setup diagnostics.
 */
export function getEnv(): ServerEnv {
  const result = envSchema.safeParse({
    SUPADATA_API_KEY: process.env.SUPADATA_API_KEY,
    SUPADATA_BASE_URL: process.env.SUPADATA_BASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    MOCK_AGENT_MODE: process.env.MOCK_AGENT_MODE || 'false',
  });

  if (!result.success) {
    console.warn('⚠️ Environment variable validation warning:', result.error.format());
    return {
      SUPADATA_API_KEY: process.env.SUPADATA_API_KEY,
      SUPADATA_BASE_URL: process.env.SUPADATA_BASE_URL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
      MOCK_AGENT_MODE: process.env.MOCK_AGENT_MODE === 'true',
    };
  }

  return result.data;
}

/**
 * Helper to check whether live API credentials are configured.
 */
export function getApiCredentialsStatus() {
  const env = getEnv();
  const hasSupadata = Boolean(env.SUPADATA_API_KEY && env.SUPADATA_API_KEY !== 'your_supadata_api_key_here');
  const hasOpenAI = Boolean(env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'your_openai_api_key_here');
  const isMockMode = Boolean(env.MOCK_AGENT_MODE || (!hasSupadata && !hasOpenAI));

  return {
    hasSupadata,
    hasOpenAI,
    isMockMode,
    model: env.OPENAI_MODEL,
    hasCustomBaseUrl: Boolean(env.OPENAI_BASE_URL),
  };
}

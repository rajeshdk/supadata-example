import { Supadata, SupadataConfig } from '@supadata/js';
import { getEnv } from '@/config/env';

let cachedClient: Supadata | null = null;

/**
 * Returns a configured singleton instance of the official Supadata SDK.
 * Throws a helpful error if the API key is missing.
 */
export function getSupadataClient(): Supadata {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getEnv();
  const apiKey = env.SUPADATA_API_KEY;

  if (!apiKey || apiKey === 'your_supadata_api_key_here') {
    throw new Error(
      'SUPADATA_API_KEY is not configured. Please set SUPADATA_API_KEY in your .env.local file or enable MOCK_AGENT_MODE=true for local simulation.'
    );
  }

  const config: SupadataConfig = {
    apiKey,
  };

  if (env.SUPADATA_BASE_URL) {
    config.baseUrl = env.SUPADATA_BASE_URL;
  }

  cachedClient = new Supadata(config);
  return cachedClient;
}

/**
 * Checks whether Supadata credentials are valid and accessible.
 */
export function isSupadataConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.SUPADATA_API_KEY && env.SUPADATA_API_KEY !== 'your_supadata_api_key_here');
}

/**
 * Helper to poll for async transcript job results when a video is long or queued.
 */
export async function pollTranscriptJob(
  client: Supadata,
  jobId: string,
  options: { maxAttempts?: number; intervalMs?: number } = {}
) {
  const { maxAttempts = 15, intervalMs = 2000 } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const jobResult = await client.transcript.getJobStatus(jobId);

    if (jobResult.status === 'completed' && jobResult.result) {
      return jobResult.result;
    }

    if (jobResult.status === 'failed') {
      throw new Error(
        jobResult.error?.message ||
          `Transcript job ${jobId} failed during asynchronous processing.`
      );
    }

    // Wait before next poll attempt
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `Transcript job ${jobId} timed out after ${maxAttempts * (intervalMs / 1000)} seconds.`
  );
}

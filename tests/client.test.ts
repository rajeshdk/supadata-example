import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Supadata, SupadataError } from '@supadata/js';
import { formatSupadataError } from '@/lib/supadata/errors';
import { getSupadataClient, isSupadataConfigured, pollTranscriptJob } from '@/lib/supadata/client';

describe('Supadata Client & Error Handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('detects unconfigured credentials', () => {
    delete process.env.SUPADATA_API_KEY;
    expect(isSupadataConfigured()).toBe(false);
  });

  it('detects configured credentials', () => {
    process.env.SUPADATA_API_KEY = 'test_supadata_key_123';
    expect(isSupadataConfigured()).toBe(true);
  });

  it('maps SupadataError "unauthorized" to actionable user guidance', () => {
    const error = new SupadataError({
      error: 'unauthorized',
      message: 'Invalid API key provided',
    });

    const formatted = formatSupadataError(error);
    expect(formatted.code).toBe('UNAUTHORIZED');
    expect(formatted.suggestedAction).toContain('SUPADATA_API_KEY');
  });

  it('maps SupadataError "transcript-unavailable"', () => {
    const error = new SupadataError({
      error: 'transcript-unavailable',
      message: 'No captions found for this video',
    });

    const formatted = formatSupadataError(error);
    expect(formatted.code).toBe('TRANSCRIPT_UNAVAILABLE');
    expect(formatted.suggestedAction).toContain('captions');
  });

  it('maps SupadataError "limit-exceeded"', () => {
    const error = new SupadataError({
      error: 'limit-exceeded',
      message: 'Rate limit or monthly quota reached',
    });

    const formatted = formatSupadataError(error);
    expect(formatted.code).toBe('RATE_LIMIT_OR_UPGRADE');
  });

  it('maps generic JavaScript Error', () => {
    const error = new Error('Network timeout');
    const formatted = formatSupadataError(error);
    expect(formatted.code).toBe('GENERIC_ERROR');
    expect(formatted.message).toBe('Network timeout');
  });

  it('pollTranscriptJob polls until completion', async () => {
    let callCount = 0;
    const mockClient = {
      transcript: {
        getJobStatus: async () => {
          callCount++;
          if (callCount < 2) {
            return { status: 'active', result: null };
          }
          return {
            status: 'completed',
            result: {
              content: 'Completed video transcript text',
              lang: 'en',
              availableLangs: ['en'],
            },
          };
        },
      },
    } as unknown as Supadata;

    const result = await pollTranscriptJob(mockClient, 'job_123', {
      maxAttempts: 5,
      intervalMs: 10,
    });

    expect(result.content).toBe('Completed video transcript text');
    expect(callCount).toBe(2);
  });
});

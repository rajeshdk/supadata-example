import { SupadataError } from '@supadata/js';

export interface FormattedError {
  code: string;
  message: string;
  details?: string;
  documentationUrl?: string;
  suggestedAction: string;
}

/**
 * Maps raw errors from Supadata SDK into structured, actionable diagnostic messages.
 */
export function formatSupadataError(error: unknown): FormattedError {
  if (error instanceof SupadataError) {
    switch (error.error) {
      case 'unauthorized':
        return {
          code: 'UNAUTHORIZED',
          message: 'Invalid or missing Supadata API Key.',
          details: error.details || error.message,
          documentationUrl: error.documentationUrl || 'https://supadata.ai',
          suggestedAction:
            'Please verify that SUPADATA_API_KEY is properly set in your .env.local file. You can generate a free key at https://supadata.ai.',
        };
      case 'transcript-unavailable':
        return {
          code: 'TRANSCRIPT_UNAVAILABLE',
          message: 'Transcript is unavailable for this video.',
          details: error.details || error.message,
          documentationUrl: error.documentationUrl,
          suggestedAction:
            'The requested media might not have captions or subtitles available yet. You can try passing mode="generate" or another video.',
        };
      case 'not-found':
        return {
          code: 'NOT_FOUND',
          message: 'The requested resource was not found.',
          details: error.details || error.message,
          documentationUrl: error.documentationUrl,
          suggestedAction:
            'Check that the URL is public, accessible, and correctly formatted (e.g., https://www.youtube.com/watch?v=...).',
        };
      case 'limit-exceeded':
      case 'upgrade-required':
        return {
          code: 'RATE_LIMIT_OR_UPGRADE',
          message: 'Usage quota or rate limit exceeded.',
          details: error.details || error.message,
          documentationUrl: error.documentationUrl || 'https://supadata.ai/pricing',
          suggestedAction:
            'Your Supadata API credit limit or rate limit has been reached. Please check your usage on https://supadata.ai dashboard.',
        };
      case 'invalid-request':
        return {
          code: 'INVALID_REQUEST',
          message: 'Invalid request parameters sent to Supadata API.',
          details: error.details || error.message,
          documentationUrl: error.documentationUrl,
          suggestedAction:
            'Ensure the target URL, parameters, and query options adhere to Supadata SDK requirements.',
        };
      default:
        return {
          code: error.error || 'SUPADATA_ERROR',
          message: error.message || 'An error occurred while interacting with the Supadata API.',
          details: error.details,
          documentationUrl: error.documentationUrl,
          suggestedAction: 'Refer to https://supadata.ai/documentation for troubleshooting.',
        };
    }
  }

  if (error instanceof Error) {
    return {
      code: 'GENERIC_ERROR',
      message: error.message,
      details: error.stack,
      suggestedAction: 'Inspect the server logs for detailed error stack traces.',
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: String(error) || 'An unexpected error occurred.',
    suggestedAction: 'Check network connectivity and configuration settings.',
  };
}

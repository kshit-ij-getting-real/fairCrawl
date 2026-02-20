import { ApiError } from '@/lib/http';

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message || FALLBACK_ERROR_MESSAGE;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return FALLBACK_ERROR_MESSAGE;
}

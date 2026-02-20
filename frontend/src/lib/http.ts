'use client';

import { API_BASE_URL } from './apiBase';
import { getToken } from './session';

export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  if (!API_BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  }

  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const demoSecret = process.env.NEXT_PUBLIC_DEMO_SECRET;
  if (path.startsWith('/api/demo') && demoSecret) {
    headers['x-demo-secret'] = demoSecret;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'REQUEST_FAILED', message: 'Request failed' }));
    throw new ApiError(err.error || 'REQUEST_FAILED', err.message || err.error || 'Request failed', err.details);
  }

  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const isJsonResponse = contentType.includes('application/json');
  const hasContentLengthHeader = contentLength !== null;

  const isEmptyResponse =
    response.status === 204 ||
    contentLength === '0' ||
    (!hasContentLengthHeader && !isJsonResponse);

  if (isEmptyResponse || !isJsonResponse) {
    return null;
  }

  return response.json();
}

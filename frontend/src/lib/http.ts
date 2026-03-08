'use client';

import { clearSession, getAccessToken, getRefreshToken, updateSessionTokens } from './session';

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

const SERVICE_BASE = 'https://fairfetch-backend-c9cu.onrender.com';
const REFRESH_PATH = '/api/auth/refresh';
const AUTH_WHITELIST = new Set(['/api/auth/login', '/api/auth/signup', REFRESH_PATH]);

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const isAuthPath = (path: string) => AUTH_WHITELIST.has(path);

const parseError = async (response: Response) => {
  const err = await response.json().catch(() => ({ error: 'REQUEST_FAILED', message: 'Request failed' }));
  return new ApiError(err.error || 'REQUEST_FAILED', err.message || err.error || 'Request failed', err.details);
};

const parseResponseBody = async (response: Response) => {
  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const isJsonResponse = contentType.includes('application/json');
  const hasContentLengthHeader = contentLength !== null;

  const isEmptyResponse = response.status === 204 || contentLength === '0' || (!hasContentLengthHeader && !isJsonResponse);
  if (isEmptyResponse || !isJsonResponse) return null;
  return response.json();
};

const getServiceBase = (path: string) => {
  return normalizeBaseUrl(SERVICE_BASE);
};

const request = async (path: string, init: RequestInit = {}, accessToken?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  if (accessToken && !isAuthPath(path)) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const demoSecret = process.env.NEXT_PUBLIC_DEMO_SECRET;
  if (path.startsWith('/api/demo') && demoSecret) {
    headers['x-demo-secret'] = demoSecret;
  }

  const base = getServiceBase(path);
  return fetch(`${base}${path}`, { ...init, headers });
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await request(REFRESH_PATH, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    throw await parseError(response);
  }

  const data = (await parseResponseBody(response)) as
    | { accessToken?: string; refreshToken?: string | null; token?: string }
    | null;

  const nextAccessToken = data?.accessToken || data?.token;
  if (!nextAccessToken) {
    clearSession();
    throw new ApiError('INVALID_REFRESH_RESPONSE', 'Refresh API did not return an access token.');
  }

  updateSessionTokens(nextAccessToken, data?.refreshToken);
  return nextAccessToken;
};

export async function apiFetch(path: string, init: RequestInit = {}) {
  const accessToken = getAccessToken();
  const needsAuth = !isAuthPath(path);

  const firstResponse = await request(path, init, accessToken || undefined);
  if (firstResponse.ok) return parseResponseBody(firstResponse);

  if (!needsAuth || firstResponse.status !== 401) {
    throw await parseError(firstResponse);
  }

  const refreshedAccessToken = await refreshAccessToken();
  if (!refreshedAccessToken) {
    clearSession();
    throw await parseError(firstResponse);
  }

  const retryResponse = await request(path, init, refreshedAccessToken);
  if (!retryResponse.ok) {
    if (retryResponse.status === 401) clearSession();
    throw await parseError(retryResponse);
  }

  return parseResponseBody(retryResponse);
}

'use client';

import { API_BASE_URL } from './apiBase';
import { getToken } from './session';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestUrl = `${API_BASE_URL}${path}`;
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[apiFetch] ${init.method || 'GET'} ${requestUrl}`);
  }

  let response: Response;
  try {
    response = await fetch(requestUrl, { ...init, headers });
  } catch {
    throw new Error('Network error: unable to reach FairFetch API. Check CORS and NEXT_PUBLIC_API_BASE_URL.');
  }

  const textBody = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const parsedBody = textBody && isJson ? JSON.parse(textBody) : null;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[apiFetch] ${response.status} ${requestUrl}`, parsedBody ?? textBody);
  }

  if (!response.ok) {
    const body = parsedBody as { error?: string; message?: string } | null;
    const message = body?.error || body?.message || textBody || `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return (parsedBody ?? {}) as T;
}

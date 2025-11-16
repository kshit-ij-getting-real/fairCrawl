'use client';

import { API_BASE } from './config';

export type Role = 'PUBLISHER' | 'AICLIENT';

export const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
export const getRole = () => (typeof window !== 'undefined' ? (localStorage.getItem('role') as Role | null) : null);

export const setSession = (token: string, role: Role) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

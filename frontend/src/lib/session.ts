'use client';

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

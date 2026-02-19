'use client';

export type Role = 'PUBLISHER' | 'AICLIENT';

export type SessionSnapshot = {
  token: string | null;
  role: Role | null;
  displayLabel: string | null;
};

const SESSION_EVENT = 'fairfetch:session-change';

const readRole = () => {
  const role = localStorage.getItem('role');
  return role === 'PUBLISHER' || role === 'AICLIENT' ? role : null;
};

export const getSessionSnapshot = (): SessionSnapshot => {
  if (typeof window === 'undefined') {
    return { token: null, role: null, displayLabel: null };
  }

  return {
    token: localStorage.getItem('token'),
    role: readRole(),
    displayLabel: localStorage.getItem('displayLabel'),
  };
};

const emitSessionChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const subscribeSession = (listener: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event: StorageEvent) => {
    if (!event.key || ['token', 'role', 'displayLabel'].includes(event.key)) {
      listener();
    }
  };

  window.addEventListener(SESSION_EVENT, listener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(SESSION_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
};

export const getToken = () => getSessionSnapshot().token;
export const getRole = () => getSessionSnapshot().role;

export const setSession = (token: string, role: Role, displayLabel?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);

  if (displayLabel && displayLabel.trim().length > 0) {
    localStorage.setItem('displayLabel', displayLabel.trim());
  }

  emitSessionChange();
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('displayLabel');
  emitSessionChange();
};

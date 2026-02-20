'use client';

export type Role = 'PUBLISHER' | 'AICLIENT';

export type SessionSnapshot = {
  token: string | null;
  role: Role | null;
  displayLabel: string | null;
};

const SESSION_EVENT = 'fairfetch:session-change';
const EMPTY_SNAPSHOT: SessionSnapshot = { token: null, role: null, displayLabel: null };

let cachedSnapshot: SessionSnapshot = EMPTY_SNAPSHOT;

const safeStorageGet = (key: string) => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key: string, value: string) => {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeStorageRemove = (key: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore blocked storage contexts
  }
};

const readRole = () => {
  const role = safeStorageGet('role');
  return role === 'PUBLISHER' || role === 'AICLIENT' ? role : null;
};

const readSnapshot = (): SessionSnapshot => {
  if (typeof window === 'undefined') {
    return EMPTY_SNAPSHOT;
  }

  return {
    token: safeStorageGet('token'),
    role: readRole(),
    displayLabel: safeStorageGet('displayLabel'),
  };
};

const snapshotsEqual = (a: SessionSnapshot, b: SessionSnapshot) =>
  a.token === b.token && a.role === b.role && a.displayLabel === b.displayLabel;

export const getSessionSnapshot = (): SessionSnapshot => {
  const nextSnapshot = readSnapshot();
  if (snapshotsEqual(cachedSnapshot, nextSnapshot)) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  return cachedSnapshot;
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

  safeStorageSet('token', token);
  safeStorageSet('role', role);

  if (displayLabel && displayLabel.trim().length > 0) {
    safeStorageSet('displayLabel', displayLabel.trim());
  }

  emitSessionChange();
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;

  safeStorageRemove('token');
  safeStorageRemove('role');
  safeStorageRemove('displayLabel');
  emitSessionChange();
};

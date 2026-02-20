'use client';

import { canUseDOM, safeLocalGet, safeLocalRemove, safeLocalSet } from '@/lib/safeStorage';

export type Role = 'PUBLISHER' | 'AICLIENT';

export type SessionSnapshot = {
  token: string | null;
  role: Role | null;
  displayLabel: string | null;
};

const SESSION_EVENT = 'fairfetch:session-change';
const EMPTY_SNAPSHOT: SessionSnapshot = { token: null, role: null, displayLabel: null };
let cachedSnapshot: SessionSnapshot = EMPTY_SNAPSHOT;

const readRole = () => {
  const role = safeLocalGet('role');
  return role === 'PUBLISHER' || role === 'AICLIENT' ? role : null;
};

export const getSessionSnapshot = (): SessionSnapshot => {
  if (!canUseDOM()) {
    return EMPTY_SNAPSHOT;
  }

  const nextSnapshot: SessionSnapshot = {
    token: safeLocalGet('token'),
    role: readRole(),
    displayLabel: safeLocalGet('displayLabel'),
  };

  if (
    cachedSnapshot.token === nextSnapshot.token &&
    cachedSnapshot.role === nextSnapshot.role &&
    cachedSnapshot.displayLabel === nextSnapshot.displayLabel
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  return cachedSnapshot;
};

const emitSessionChange = () => {
  if (!canUseDOM()) return;
  window.dispatchEvent(new Event(SESSION_EVENT));
};

export const subscribeSession = (listener: () => void) => {
  if (!canUseDOM()) return () => {};

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
  if (!canUseDOM()) return;

  safeLocalSet('token', token);
  safeLocalSet('role', role);

  if (displayLabel && displayLabel.trim().length > 0) {
    safeLocalSet('displayLabel', displayLabel.trim());
  } else {
    safeLocalRemove('displayLabel');
  }

  emitSessionChange();
};

export const clearSession = () => {
  if (!canUseDOM()) return;

  safeLocalRemove('token');
  safeLocalRemove('role');
  safeLocalRemove('displayLabel');
  emitSessionChange();
};

'use client';

import { canUseDOM, safeLocalGet, safeLocalRemove, safeLocalSet } from '@/lib/safeStorage';

export type Role = 'PUBLISHER' | 'AICLIENT';

export type SessionSnapshot = {
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  role: Role | null;
  displayLabel: string | null;
  userId: number | null;
  orgId: number | null;
};

const SESSION_EVENT = 'fairfetch:session-change';
const EMPTY_SNAPSHOT: SessionSnapshot = {
  token: null,
  accessToken: null,
  refreshToken: null,
  role: null,
  displayLabel: null,
  userId: null,
  orgId: null,
};
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
    accessToken: safeLocalGet('accessToken') || safeLocalGet('token'),
    token: safeLocalGet('accessToken') || safeLocalGet('token'),
    refreshToken: safeLocalGet('refreshToken'),
    role: readRole(),
    displayLabel: safeLocalGet('displayLabel'),
    userId: safeLocalGet('userId') ? Number(safeLocalGet('userId')) : null,
    orgId: safeLocalGet('orgId') ? Number(safeLocalGet('orgId')) : null,
  };

  if (
    cachedSnapshot.token === nextSnapshot.token &&
    cachedSnapshot.accessToken === nextSnapshot.accessToken &&
    cachedSnapshot.refreshToken === nextSnapshot.refreshToken &&
    cachedSnapshot.role === nextSnapshot.role &&
    cachedSnapshot.displayLabel === nextSnapshot.displayLabel &&
    cachedSnapshot.userId === nextSnapshot.userId &&
    cachedSnapshot.orgId === nextSnapshot.orgId
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
    if (!event.key || ['token', 'accessToken', 'refreshToken', 'role', 'displayLabel', 'userId', 'orgId'].includes(event.key)) {
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
export const getAccessToken = () => getSessionSnapshot().accessToken;
export const getRefreshToken = () => getSessionSnapshot().refreshToken;
export const getRole = () => getSessionSnapshot().role;
export const getUserId = () => getSessionSnapshot().userId;
export const getOrgId = () => getSessionSnapshot().orgId;

export const setSession = (accessToken: string, refreshToken: string | null, role: Role, displayLabel?: string) => {
  if (!canUseDOM()) return;

  safeLocalSet('accessToken', accessToken);
  safeLocalSet('token', accessToken);
  if (refreshToken && refreshToken.trim().length > 0) {
    safeLocalSet('refreshToken', refreshToken);
  } else {
    safeLocalRemove('refreshToken');
  }
  safeLocalSet('role', role);

  if (displayLabel && displayLabel.trim().length > 0) {
    safeLocalSet('displayLabel', displayLabel.trim());
  } else {
    safeLocalRemove('displayLabel');
  }

  emitSessionChange();
};

export const setSessionContext = (params: { userId?: number | null; orgId?: number | null }) => {
  if (!canUseDOM()) return;

  if (params.userId !== undefined) {
    if (params.userId === null || Number.isNaN(params.userId)) {
      safeLocalRemove('userId');
    } else {
      safeLocalSet('userId', String(params.userId));
    }
  }

  if (params.orgId !== undefined) {
    if (params.orgId === null || Number.isNaN(params.orgId)) {
      safeLocalRemove('orgId');
    } else {
      safeLocalSet('orgId', String(params.orgId));
    }
  }

  emitSessionChange();
};

export const updateSessionTokens = (accessToken: string, refreshToken?: string | null) => {
  if (!canUseDOM()) return;

  safeLocalSet('accessToken', accessToken);
  safeLocalSet('token', accessToken);

  if (refreshToken !== undefined) {
    if (refreshToken && refreshToken.trim().length > 0) {
      safeLocalSet('refreshToken', refreshToken);
    } else {
      safeLocalRemove('refreshToken');
    }
  }

  emitSessionChange();
};

export const clearSession = () => {
  if (!canUseDOM()) return;

  safeLocalRemove('token');
  safeLocalRemove('accessToken');
  safeLocalRemove('refreshToken');
  safeLocalRemove('role');
  safeLocalRemove('displayLabel');
  safeLocalRemove('userId');
  safeLocalRemove('orgId');
  emitSessionChange();
};

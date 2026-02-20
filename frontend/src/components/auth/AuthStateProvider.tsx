'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { clearSession, getSessionSnapshot, type Role, subscribeSession } from '@/lib/session';

type AuthState = {
  isAuthed: boolean;
  role: Role | null;
  displayLabel: string;
  dashboardHref: string;
  logout: () => void;
};

const AuthStateContext = createContext<AuthState | null>(null);

const getDashboardHref = (role: Role | null) => (role === 'PUBLISHER' ? '/publisher/dashboard' : '/aiclient/api-keys');

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeSession, getSessionSnapshot, () => ({ token: null, role: null, displayLabel: null }));

  const value = useMemo<AuthState>(() => {
    const isAuthed = Boolean(snapshot.token && snapshot.role);
    return {
      isAuthed,
      role: snapshot.role,
      displayLabel: snapshot.displayLabel || 'Account',
      dashboardHref: getDashboardHref(snapshot.role),
      logout: clearSession,
    };
  }, [snapshot.displayLabel, snapshot.role, snapshot.token]);

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>;
}

export function useAuthState() {
  const context = useContext(AuthStateContext);

  if (!context) {
    throw new Error('useAuthState must be used within AuthStateProvider');
  }

  return context;
}

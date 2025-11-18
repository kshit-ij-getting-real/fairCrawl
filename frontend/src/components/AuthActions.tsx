'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/config';
import { Role, clearSession, getRole, getToken } from '@/lib/api';

type SessionState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'authenticated'; name: string; role: Role };

type AuthActionsProps = {
  className?: string;
  variant?: 'header' | 'footer';
};

const fetchProfileName = async (role: Role, token: string) => {
  const path = role === 'PUBLISHER' ? 'publisher' : 'aiclient';
  const res = await fetch(`${API_BASE}/api/${path}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Profile fetch failed');
  }

  const data = await res.json();
  return data?.name || 'Account';
};

export function AuthActions({ className, variant = 'header' }: AuthActionsProps) {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const token = getToken();
    const role = getRole();

    if (!token || !role) {
      setSession({ status: 'guest' });
      return () => {
        active = false;
      };
    }

    const loadProfile = async () => {
      try {
        const name = await fetchProfileName(role, token);
        if (!active) return;
        setSession({ status: 'authenticated', name, role });
      } catch (err) {
        if (!active) return;
        clearSession();
        setSession({ status: 'guest' });
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const logout = () => {
    clearSession();
    setSession({ status: 'guest' });
    router.push('/');
  };

  const containerClass =
    className || (variant === 'footer' ? 'flex items-center gap-4 text-sm' : 'flex items-center gap-4');

  if (session.status === 'loading') {
    const loadingTextClass = variant === 'footer' ? 'text-faircrawl-textMuted' : 'text-sm text-white/70';
    return (
      <div className={containerClass}>
        <span className={loadingTextClass}>Loading...</span>
      </div>
    );
  }

  if (session.status === 'guest') {
    const loginClass = variant === 'footer' ? 'hover:text-white' : 'text-sm text-white/70 hover:text-white';
    const signupClass =
      variant === 'footer'
        ? 'hover:text-white'
        : 'rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-400';
    return (
      <div className={containerClass}>
        <Link href="/login" className={loginClass}>
          Log in
        </Link>
        <Link href="/signup" className={signupClass}>
          {variant === 'footer' ? 'Sign up' : 'Get started'}
        </Link>
      </div>
    );
  }

  const dashboardHref = session.role === 'PUBLISHER' ? '/publisher/dashboard' : '/aiclient/dashboard';
  const nameClass = variant === 'footer' ? 'hover:text-white' : 'text-sm text-white/80 hover:text-white';
  const logoutClass =
    variant === 'footer'
      ? 'hover:text-white'
      : 'rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-400';

  return (
    <div className={containerClass}>
      <Link href={dashboardHref} className={nameClass}>
        {session.name}
      </Link>
      <button onClick={logout} className={logoutClass}>
        Logout
      </button>
    </div>
  );
}

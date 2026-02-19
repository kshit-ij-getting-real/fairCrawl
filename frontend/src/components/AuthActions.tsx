'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/components/auth/AuthStateProvider';
import { Button } from '@/components/ui/Button';

type AuthActionsProps = {
  className?: string;
  variant?: 'header' | 'footer';
};

export function AuthActions({ className, variant = 'header' }: AuthActionsProps) {
  const router = useRouter();
  const { isAuthed, displayLabel, dashboardHref, logout } = useAuthState();

  const containerClass =
    className || (variant === 'footer' ? 'flex items-center gap-4 text-sm' : 'flex items-center gap-4');

  if (!isAuthed) {
    const loginClass = variant === 'footer' ? 'hover:text-white' : 'text-sm text-white/70 hover:text-white';

    return (
      <div className={containerClass}>
        <Link href="/login" className={loginClass}>
          Log in
        </Link>
        {variant === 'footer' ? (
          <Link href="/signup" className="hover:text-white">
            Sign up
          </Link>
        ) : (
          <Button href="/signup" variant="primary" size="md">
            Get started
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={containerClass}>
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
          {displayLabel}
        </span>
        <Link href={dashboardHref} className="hover:text-white">
          Dashboard
        </Link>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="hover:text-white"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
        {displayLabel}
      </span>
      <Button href={dashboardHref} variant="secondary" size="md">
        Dashboard
      </Button>
      <Button
        variant="ghost"
        size="md"
        onClick={() => {
          logout();
          router.push('/');
        }}
      >
        Logout
      </Button>
    </div>
  );
}

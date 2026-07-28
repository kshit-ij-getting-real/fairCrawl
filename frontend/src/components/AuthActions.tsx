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
    const loginClass = variant === 'footer' ? 'text-[#64748b] hover:text-[#0f172a]' : 'text-sm text-[#64748b] hover:text-[#0f172a]';

    return (
      <div className={containerClass}>
        <Link href="/login" className={loginClass}>
          Log in
        </Link>
        {variant === 'footer' ? (
          <Link href="/#workspace" className="text-[#64748b] hover:text-[#0f172a]">
            Product
          </Link>
        ) : (
          <Button href="/#workspace" variant="primary" size="md" className="bg-[#0f172a] shadow-none hover:bg-[#1e293b]">
            Open workspace
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={containerClass}>
        <span className="inline-flex items-center rounded-full border border-[rgba(122,131,209,0.22)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-sm font-medium text-[#414ba8] shadow-[0_8px_22px_rgba(127,121,216,0.12)]">
          {displayLabel}
        </span>
        <Link href={dashboardHref} className="text-[#6d739b] hover:text-[#33408f]">
          Dashboard
        </Link>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-[#6d739b] hover:text-[#33408f]"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <span className="inline-flex items-center rounded-full border border-[rgba(122,131,209,0.22)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-sm font-semibold text-[#414ba8] shadow-[0_8px_22px_rgba(127,121,216,0.12)]">
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

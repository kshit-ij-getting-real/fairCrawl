'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageShell } from '@/components/shared/PageShell';
import { cn } from '@/lib/cn';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return <PageShell className="py-8">{children}</PageShell>;
}

export function DashboardHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#27306f]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[#7a80a6]">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function DashboardNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <nav className="mt-6 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-1 rounded-2xl border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.72)] p-1.5 shadow-[0_14px_32px_rgba(128,121,214,0.12)] backdrop-blur-xl">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition',
                  active ? 'bg-gradient-to-r from-[#4f58da] to-[#9368f4] text-white shadow-[0_10px_22px_rgba(95,100,222,0.24)]' : 'text-[#6e7397] hover:bg-[rgba(110,122,228,0.08)] hover:text-[#4953cb]'
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

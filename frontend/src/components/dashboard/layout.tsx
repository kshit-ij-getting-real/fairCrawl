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
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-faircrawl-textMuted">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function DashboardNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const pathname = usePathname();
  return (
    <nav className="mt-6 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'inline-flex rounded-full px-3 py-1.5 text-sm transition',
                  active ? 'bg-faircrawl-accent text-white' : 'text-faircrawl-textMuted hover:bg-white/10 hover:text-white'
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

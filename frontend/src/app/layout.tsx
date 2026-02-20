import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AuthActions } from '@/components/AuthActions';
import { AuthStateProvider } from '@/components/auth/AuthStateProvider';
import { HeaderNav } from '@/components/shared/HeaderNav';
import { PageShell } from '@/components/shared/PageShell';
import { ToastProvider } from '@/components/toast/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'FairFetch – Paid access marketplace for AI and publishers',
  description: 'FairFetch is an opt-in marketplace for paywalled content access with pricing, tokens, and transaction logs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050815] text-white">
        <AuthStateProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <header className="w-full border-b border-slate-800 bg-[#020617]">
                <PageShell className="flex flex-wrap items-center justify-between gap-3 py-3 sm:flex-nowrap">
                  <Link href="/" aria-label="FairFetch home" className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="text-[18px] font-semibold tracking-[0.08em] text-slate-50">FairFetch</span>
                  </Link>
                  <HeaderNav />
                  <AuthActions className="hidden items-center gap-4 sm:flex" />
                </PageShell>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-white/10 bg-faircrawl-surface">
                <PageShell className="flex flex-col gap-2 py-8 text-sm text-faircrawl-textMuted sm:flex-row sm:items-center sm:justify-between">
                  <span>FairFetch keeps paid access simple and transparent.</span>
                  <AuthActions variant="footer" />
                </PageShell>
              </footer>
            </div>
          </ToastProvider>
        </AuthStateProvider>
      </body>
    </html>
  );
}

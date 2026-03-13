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
      <body className="text-faircrawl-textMain">
        <AuthStateProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-40 w-full border-b border-[rgba(126,135,212,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,247,255,0.88))] shadow-[0_10px_28px_rgba(126,120,210,0.08)] backdrop-blur-xl">
                <PageShell className="flex flex-wrap items-center justify-between gap-3 py-4 sm:flex-nowrap">
                  <Link href="/" aria-label="FairFetch home" className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="bg-gradient-to-r from-[#4853d5] via-[#6e69eb] to-[#cc67f0] bg-clip-text text-[18px] font-semibold tracking-[0.08em] text-transparent">
                      FairFetch
                    </span>
                  </Link>
                  <HeaderNav />
                  <AuthActions className="hidden items-center gap-4 sm:flex" />
                </PageShell>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-[rgba(126,135,212,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,246,255,0.8))] backdrop-blur-xl">
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

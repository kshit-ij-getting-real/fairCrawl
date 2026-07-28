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
  title: {
    default: 'FairFetch | Licensed research retrieval for AI agents',
    template: '%s | FairFetch',
  },
  description:
    'FairFetch lets enterprise AI agents discover and retrieve paid specialist research with permission, citations, usage metering, and automatic payment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-faircrawl-textMain">
        <AuthStateProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-40 w-full border-b border-[#e2e8f0] bg-white/90 backdrop-blur-xl">
                <PageShell className="flex flex-wrap items-center justify-between gap-3 py-4 sm:flex-nowrap">
                  <Link href="/" aria-label="FairFetch home" className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#0f172a]">
                      FairFetch
                    </span>
                  </Link>
                  <HeaderNav />
                  <AuthActions className="hidden items-center gap-4 sm:flex" />
                </PageShell>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-[#e2e8f0] bg-white">
                <PageShell className="flex flex-col gap-2 py-8 text-sm text-faircrawl-textMuted sm:flex-row sm:items-center sm:justify-between">
                  <span>Licensed retrieval infrastructure for machine-consumed knowledge.</span>
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

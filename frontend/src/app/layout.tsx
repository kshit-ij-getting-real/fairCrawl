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
    default: 'FairFetch | Paid proprietary research for AI agents',
    template: '%s | FairFetch',
  },
  description:
    'FairFetch authenticates AI agents, enforces research licences, returns bounded cited answers, meters usage, and creates shared transaction receipts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-faircrawl-textMain">
        <AuthStateProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-40 w-full border-b border-[#ded8d3] bg-[#fbfaf9]/90 backdrop-blur-xl">
                <PageShell className="flex flex-wrap items-center justify-between gap-3 py-4 sm:flex-nowrap">
                  <Link href="/" aria-label="FairFetch home" className="flex items-center gap-2">
                    <Logo size={32} />
                    <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#171717]">
                      FairFetch
                    </span>
                  </Link>
                  <HeaderNav />
                  <AuthActions className="hidden items-center gap-4 sm:flex" />
                </PageShell>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-[#ded8d3] bg-[#fbfaf9]">
                <PageShell className="flex flex-col gap-2 py-8 text-sm text-faircrawl-textMuted sm:flex-row sm:items-center sm:justify-between">
                  <span>Permission, retrieval and settlement infrastructure for machine-consumed knowledge.</span>
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

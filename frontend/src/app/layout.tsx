import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AuthActions } from '@/components/AuthActions';
import './globals.css';

export const metadata: Metadata = {
  title: 'FairCrawl – Get paid when AI uses your content',
  description: 'FairCrawl lets creators set AI access rules, meter usage, and get paid when AI teams use their work.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050815] text-white">
        <div className="flex min-h-screen flex-col">
          <header className="w-full border-b border-slate-800 bg-[#020617]">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap lg:px-8">
              <div className="flex items-center gap-2">
                <Link href="/" aria-label="FairCrawl home" className="flex items-center gap-2">
                  <Logo size={32} />
                  <span className="text-[18px] font-semibold tracking-[0.08em] text-slate-50">FairCrawl</span>
                </Link>
              </div>

              <nav className="hidden md:flex md:flex-1 md:justify-center">
                <div className="flex items-center gap-8 text-sm text-white/70">
                  <Link href="/how-it-works" className="hover:text-white">
                    How it works
                  </Link>
                  <Link href="/creators" className="hover:text-white">
                    Creators
                  </Link>
                  <Link href="/ai-teams" className="hover:text-white">
                    AI teams
                  </Link>
                  <Link href="/directory" className="hover:text-white">
                    Directory
                  </Link>
                  <Link href="/vision" className="hover:text-white">
                    Vision
                  </Link>
                </div>
              </nav>

              <AuthActions className="hidden items-center gap-4 sm:flex" />
            </div>

            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-3 pt-1 md:hidden lg:px-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <Link href="/how-it-works">How it works</Link>
                <Link href="/creators">Creators</Link>
                <Link href="/ai-teams">AI teams</Link>
                <Link href="/directory">Directory</Link>
                <Link href="/vision">Vision</Link>
              </div>
              <AuthActions className="flex flex-wrap items-center gap-3 text-sm" />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 bg-faircrawl-surface">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-faircrawl-textMuted sm:flex-row sm:items-center sm:justify-between">
              <span>FairCrawl keeps AI access transparent.</span>
              <AuthActions variant="footer" />
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

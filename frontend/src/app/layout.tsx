import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fair Crawl',
  description: 'Marketplace and gateway for AI crawlers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050815] text-white">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-white/5 bg-[#050815]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="text-2xl font-semibold text-white">
                FairCrawl
              </Link>
              <nav className="flex items-center gap-8 text-sm text-white/80">
                <Link href="/how-it-works" className="hover:text-white">
                  How it works
                </Link>
                <Link href="/creators" className="hover:text-white">
                  Creators
                </Link>
                <Link href="/ai-teams" className="hover:text-white">
                  AI teams
                </Link>
                <Link href="/vision" className="hover:text-white">
                  Vision
                </Link>
                <Link href="/directory" className="hover:text-white">
                  Directory
                </Link>
              </nav>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/login" className="text-white/80 hover:text-white">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-faircrawl-accent px-4 py-2 font-medium text-white transition hover:bg-faircrawl-accentSoft"
                >
                  Get started
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 bg-faircrawl-surface">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-faircrawl-textMuted sm:flex-row sm:items-center sm:justify-between">
              <span>FairCrawl keeps AI access transparent.</span>
              <div className="flex gap-4">
                <a href="/login" className="hover:text-white">
                  Login
                </a>
                <a href="/signup" className="hover:text-white">
                  Sign up
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

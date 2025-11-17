import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fair Crawl',
  description: 'Marketplace and gateway for AI crawlers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-faircrawl-bgDark text-faircrawl-textMain">
        <header className="bg-faircrawl-surface/80 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
            <div>
              <a href="/" className="text-2xl font-semibold text-white">
                FairCrawl
              </a>
              <p className="text-xs text-faircrawl-textMuted">A clean bridge between creators and AI agents.</p>
            </div>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/login" className="text-faircrawl-textMain hover:text-white">
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 rounded-full bg-faircrawl-accent text-white font-medium hover:bg-faircrawl-accentSoft transition"
              >
                Sign up
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">{children}</main>
        <footer className="bg-faircrawl-surface border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-faircrawl-textMuted flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
      </body>
    </html>
  );
}

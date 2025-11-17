import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fair Crawl',
  description: 'Marketplace and gateway for AI crawlers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div>
              <a href="/" className="text-2xl font-semibold text-slate-900">
                Fair Crawl
              </a>
              <p className="text-xs text-slate-500">Fair Crawl – a fair marketplace for AI crawlers and content.</p>
            </div>
            <nav className="space-x-4 text-sm">
              <a href="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </a>
              <a href="/signup" className="text-slate-600 hover:text-slate-900">
                Sign up
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

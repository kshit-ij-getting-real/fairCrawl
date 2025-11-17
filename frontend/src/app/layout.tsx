import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fair Crawl',
  description: 'Marketplace and gateway for AI crawlers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
            <div>
              <a href="/" className="text-2xl font-semibold text-slate-900">
                Fair Crawl
              </a>
              <p className="text-xs text-slate-500">A clean bridge between creators and AI agents.</p>
            </div>
            <nav className="space-x-4 text-sm">
              <a href="/login" className="text-blue-600 hover:text-blue-700">
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Sign up
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">{children}</main>
      </body>
    </html>
  );
}

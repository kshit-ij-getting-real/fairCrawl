import Link from 'next/link';
import type { ReactNode } from 'react';

const Button = ({ children, href, variant = 'primary' }: { children: ReactNode; href: string; variant?: 'primary' | 'secondary' }) => {
  const baseClasses =
    variant === 'secondary'
      ? 'rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10'
      : 'rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400';

  return (
    <Link href={href} className={baseClasses}>
      {children}
    </Link>
  );
};

const CreatorsPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <section className="space-y-8 text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="mx-auto max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">For creators &amp; publishers</p>
            <h1 className="text-3xl font-semibold">FairCrawl for creators &amp; publishers</h1>
            <p className="text-base leading-relaxed text-white/80">
              Decide what AIs can read, keep drafts private, and see every AI crawler that touches your work.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">What you control</h3>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Visibility</span>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">/blog/*</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Protected</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">/drafts/*</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Speed</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 req/sec</span>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Share the parts of your site that help you grow and keep private areas off limits. Choose which pages AIs can read, which stay private, and which get throttled when traffic spikes. You decide page by page which paths are open, limited, or completely blocked.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">Turn crawlers into paid feeds</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>Stop AIs reading your work for free.</li>
                <li>Use one rule set to decide what’s open, what stays private, and what AI pays.</li>
                <li>When crawlers hit your site through FairCrawl, they get a controlled, logged feed instead of scraping in the dark.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <h3 className="text-lg font-semibold text-slate-50">See who’s reading you</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>See which crawlers hit which paths, how often, and what they read.</li>
              <li>Use a shared log as ground truth for payouts, audits, and disputes.</li>
              <li>Give AI teams a single source of truth for how your work was used.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button href="/signup?role=publisher">Get started as a creator</Button>
          <Button href="/directory" variant="secondary">
            Browse AI-ready sites
          </Button>
        </div>
      </section>
    </main>
  );
};

export default CreatorsPage;

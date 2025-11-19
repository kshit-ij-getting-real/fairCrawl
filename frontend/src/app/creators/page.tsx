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
            <h1 className="text-3xl font-semibold">FairMarket for creators &amp; publishers</h1>
            <p className="text-base leading-relaxed text-white/80">
              Set rules per path, see which AI crawlers read your work, and turn AI training into income.
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
                Set rules per path so /blog/* is open, /drafts/* stay private, and /premium/* is paid only. Decide exactly what AI can read and how fast each crawler can go.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-50">Turn crawlers into paid feeds</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>Stop AIs reading your work for free.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>Use one rule set to decide what’s open, what’s premium, and what each AI team pays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>When crawlers use FairMarket, they get a controlled, logged feed instead of scraping around your site.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 flex flex-col text-white">
            <h3 className="text-lg font-semibold text-slate-50">See who’s reading you</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>See which crawlers hit which paths, how often, and what they read.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>Use a shared log as the source of truth for audits, payouts, and disputes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>Give AI teams and publishers the same record of how your work was used.</span>
                </li>
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

import Link from 'next/link';

import { MarketingCard } from '../../components/marketing-card';
import { SectionActions } from '../../components/ui/SectionActions';

const CreatorsPage = () => {
  return (
    <main className="space-y-12 md:space-y-16">
      <section className="grid gap-10 rounded-3xl bg-slate-900 p-10 shadow-xl lg:grid-cols-2">
        <div className="space-y-4 text-white">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-faircrawl-accent">For creators &amp; publishers</p>
            <h1 className="text-3xl font-semibold">Create for AI, get paid for it</h1>
            <p className="text-base leading-relaxed text-white/80">
              Decide what AIs can read, keep a log of AI traffic, and share only what works for you.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-white/80">
            {["Choose which pages AIs can read and which stay private.", "See which AI products actually read your work.", "Add simple speed limits so crawlers don't overload your site."].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <SectionActions>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
            >
              Set up your first domain
            </Link>
          </SectionActions>
        </div>
        <MarketingCard className="text-white">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white/80">Publisher control snapshot</p>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                <span className="font-semibold">Allowed paths</span>
                <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs text-faircrawl-accent">/blog/*</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                <span className="font-semibold">Blocked</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">/drafts/*</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                <span className="font-semibold">AI rate limit</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 rps</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">Shareable log</p>
              <p className="mt-2 text-sm text-white">atlas-research.ai → /blog/ai-trends (200)</p>
              <p className="text-xs text-white/70">Visible to both sides with timestamps.</p>
            </div>
          </div>
        </MarketingCard>
      </section>
    </main>
  );
};

export default CreatorsPage;

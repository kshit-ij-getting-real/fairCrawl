import Link from 'next/link';

import { MarketingCard } from '../components/ui/MarketingCard';
import { SectionActions } from '../components/ui/SectionActions';

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 md:space-y-20">
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-10 shadow-xl md:p-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-faircrawl-textMain">
              <span className="h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              Controlled AI crawling
            </div>
            <div className="max-w-xl space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">Let AI in without losing control</h1>
              <p className="text-lg leading-relaxed text-faircrawl-textMuted">
                FairCrawl sits between AI crawlers and your site. Crawlers ask us for pages, you set the rules, and we enforce them on every request.
              </p>
              <p className="text-base text-white/80">
                AI crawlers call FairCrawl instead of your site directly. FairCrawl checks your rules, then either serves the page or returns a clear block.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-faircrawl-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-faircrawl-accentSoft"
              >
                Get early access
              </Link>
              <Link href="/how-it-works" className="text-sm font-semibold text-blue-300 hover:text-white">
                See how FairCrawl works
              </Link>
            </div>
          </div>
          <MarketingCard className="text-white">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Gateway snapshot</h2>
              <p className="text-sm text-white/70">
                Every AI request is logged, matched against your rules, and returned with a clear allow or block.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/blog/ai</span>
                  <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs font-semibold text-faircrawl-accent">allowed</span>
                </div>
                <p className="mt-2 text-xs text-white/60">Crawler: atlas-research.ai · Rate: 5 rps</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/drafts/*</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                </div>
                <p className="mt-2 text-xs text-white/60">Crawler: unknown · Reason: publisher rules</p>
              </div>
            </div>
          </MarketingCard>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <MarketingCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-blue-300">Creators</p>
              <h2 className="text-2xl font-semibold text-white">Create for AI, stay in control</h2>
              <p className="text-sm text-faircrawl-textMuted">Decide what AIs can read and see which crawlers actually show up.</p>
            </div>
            <SectionActions>
              <Link
                href="/creators"
                className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft"
              >
                Learn more
              </Link>
            </SectionActions>
          </div>
        </MarketingCard>

        <MarketingCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-blue-300">AI teams</p>
              <h2 className="text-2xl font-semibold text-white">Source the best data, without guesswork</h2>
              <p className="text-sm text-faircrawl-textMuted">One gateway to permissioned content across publishers, with clear rules for every domain.</p>
            </div>
            <SectionActions>
              <Link
                href="/ai-teams"
                className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft"
              >
                Learn more
              </Link>
            </SectionActions>
          </div>
        </MarketingCard>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <MarketingCard>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Our vision: a fair web for AI</h3>
            <p className="text-sm text-faircrawl-textMuted">AI traffic should be transparent, measured, and respectful so creators keep control while crawlers get reliable access.</p>
          </div>
          <SectionActions>
            <Link
              href="/vision"
              className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft"
            >
              Read the vision
            </Link>
          </SectionActions>
        </MarketingCard>

        <MarketingCard>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Verified AI-ready sites</h3>
            <p className="text-sm text-faircrawl-textMuted">
              Explore domains that have verified ownership and published AI access rules through FairCrawl.
            </p>
          </div>
          <SectionActions>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft"
            >
              View directory
            </Link>
          </SectionActions>
        </MarketingCard>
      </section>
    </div>
  );
};

export default Page;

import Link from 'next/link';

import { MarketingCard } from '../components/ui/MarketingCard';
import { SectionActions } from '../components/ui/SectionActions';

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 md:space-y-20 md:py-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-4 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            Controlled AI crawling
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Let AI in without losing control</h1>
          <p className="text-lg leading-relaxed text-white/80">
            FairCrawl sits between AI crawlers and your site. Crawlers ask us for pages, you set the rules, and we enforce them on every request.
          </p>
          <p className="text-base text-white/70">
            AI crawlers call FairCrawl instead of your site directly. FairCrawl checks your rules, then either serves the page or returns a clear block.
          </p>
          <p className="text-base text-white/70">
            Over time, we plug in payouts so crawlers that read at scale have to pay instead of scraping in the dark.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-500/80"
            >
              Get early access
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white"
            >
              See how FairCrawl works
            </Link>
          </div>
        </div>

        <MarketingCard className="text-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gateway snapshot</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Live monitor</span>
            </div>
            <p className="text-sm text-white/70">
              Every AI request is logged, matched against your rules, and returned with a clear allow or block.
            </p>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/blog/ai</span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">allowed</span>
                </div>
                <p className="mt-2 text-xs text-white/60">AI crawler: atlas-research.ai · Rate: 5 rps</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/drafts/*</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                </div>
                <p className="mt-2 text-xs text-white/60">AI crawler: unknown · Reason: publisher rules</p>
              </div>
            </div>
          </div>
        </MarketingCard>
      </section>

      <section className="mt-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
          <MarketingCard>
            <div className="space-y-3 text-white">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-blue-200">
                  <path d="M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-wide text-blue-300/80">Creators</p>
              <h2 className="text-2xl font-semibold">Create for AI, stay in control</h2>
              <p className="text-sm text-white/70">Decide what AIs can read and see which crawlers actually show up.</p>
              <SectionActions>
                <Link
                  href="/creators"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80"
                >
                  Learn more
                </Link>
              </SectionActions>
            </div>
          </MarketingCard>

          <MarketingCard>
            <div className="space-y-3 text-white">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-blue-200">
                  <path d="M4 8l8-4 8 4-8 4-8-4z" />
                  <path d="M4 8v8l8 4 8-4V8" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-wide text-blue-300/80">AI teams</p>
              <h2 className="text-2xl font-semibold">Source the best data, without guesswork</h2>
              <p className="text-sm text-white/70">One gateway to permissioned content across publishers, with clear rules for every domain.</p>
              <SectionActions>
                <Link
                  href="/ai-teams"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80"
                >
                  Learn more
                </Link>
              </SectionActions>
            </div>
          </MarketingCard>
        </div>
      </section>

      <section className="mt-20 mb-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
          <MarketingCard>
            <div className="space-y-3 text-white">
              <h3 className="text-xl font-semibold">Our vision: a fair web for AI</h3>
              <p className="text-sm text-white/70">
                FairCrawl turns invisible AI traffic into a protocol with consent, speed, and value built in.
              </p>
              <SectionActions>
                <Link
                  href="/vision"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80"
                >
                  Read the vision
                </Link>
              </SectionActions>
            </div>
          </MarketingCard>

          <MarketingCard>
            <div className="space-y-3 text-white">
              <h3 className="text-xl font-semibold">Verified AI-ready sites</h3>
              <p className="text-sm text-white/70">
                Explore domains that have verified ownership and published AI access rules through FairCrawl.
              </p>
              <SectionActions>
                <Link
                  href="/directory"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80"
                >
                  View directory
                </Link>
              </SectionActions>
            </div>
          </MarketingCard>
        </div>
      </section>
    </div>
  );
};

export default Page;

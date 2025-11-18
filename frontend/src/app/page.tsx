import Link from 'next/link';

import { MarketingCard } from '../components/marketing-card';
import { SectionActions } from '../components/ui/SectionActions';

const Page = () => {
  return (
    <main className="space-y-16 md:space-y-20">
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-12 shadow-xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-faircrawl-textMain">
              <span className="h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              Controlled AI crawling
            </div>
            <div className="space-y-4 max-w-xl">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">Let AI in without losing control</h1>
              <p className="text-lg leading-relaxed text-faircrawl-textMuted">
                FairCrawl sits between AI crawlers and your site so you decide what AIs see and how they access it.
              </p>
            </div>
            <SectionActions>
              <Link
                href="/signup"
                className="rounded-full bg-faircrawl-accent px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-faircrawl-accentSoft"
              >
                Get early access
              </Link>
              <Link href="/how-it-works" className="font-semibold text-faircrawl-textMain hover:text-white">
                See how FairCrawl works
              </Link>
            </SectionActions>
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
                <p className="mt-2 text-xs text-white/60">Client: atlas-research.ai · Rate: 5 rps</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/drafts/*</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                </div>
                <p className="mt-2 text-xs text-white/60">Client: unknown · Reason: publisher rules</p>
              </div>
            </div>
          </MarketingCard>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <MarketingCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">Creators</p>
              <h2 className="text-2xl font-semibold text-white">Create for AI, stay in control</h2>
              <p className="text-sm text-faircrawl-textMuted">
                Decide what AIs can read, how fast, and on what terms.
              </p>
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
              <p className="text-sm font-semibold text-faircrawl-accent">AI teams</p>
              <h2 className="text-2xl font-semibold text-white">Source the best data, without guesswork</h2>
              <p className="text-sm text-faircrawl-textMuted">
                One gateway to clean, permissioned content across publishers.
              </p>
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

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-xl shadow-black/30">
        <div className="flex flex-col gap-4 items-start justify-between md:flex-row md:items-center">
          <p className="text-base text-white">
            FairCrawl is building the default bridge between AI crawlers and the web.
          </p>
          <SectionActions className="mt-0">
            <Link
              href="/vision"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Our vision
            </Link>
          </SectionActions>
        </div>
      </section>

      <section>
        <MarketingCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">Verified AI-ready sites</h3>
              <p className="text-sm text-faircrawl-textMuted">
                Domains that have verified ownership and published AI access rules through FairCrawl.
              </p>
            </div>
            <SectionActions className="mt-0">
              <Link
                href="/signup?role=publisher"
                className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft"
              >
                Become a launch publisher
              </Link>
            </SectionActions>
          </div>
        </MarketingCard>
      </section>
    </main>
  );
};

export default Page;

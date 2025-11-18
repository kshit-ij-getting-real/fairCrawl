import Link from 'next/link';

import { MarketingCard } from '../components/ui/MarketingCard';

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section>
        <div className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg text-white flex flex-col gap-10 lg:flex-row lg:items-stretch lg:py-10">
          <div className="flex flex-1 flex-col justify-between gap-6 text-white">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Controlled, paid AI crawling
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Let AI in without losing control</h1>
              <p className="text-lg leading-relaxed text-white/80">
                FairCrawl sits between AI crawlers and your site, so you decide what they can read, how fast they can fetch it, and what they pay. Every request is enforced and logged instead of being free scraping.
              </p>
              <p className="text-base text-white/70">
                You publish one set of rules for access, speed, and price. FairCrawl serves or blocks each request based on those rules and tracks usage for payouts and audits.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get early access
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-white/80 hover:text-white">
                See how FairCrawl works
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-stretch">
            <div className="flex h-full w-full flex-col gap-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 p-6 text-white lg:p-7">
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
                    <span className="font-semibold">Allowed paths: /blog/*</span>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">allowed</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler: atlas-research.ai · AI speed cap: 5 req/sec</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Blocked: /drafts/*</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler: unknown · Reason: publisher rules</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span className="font-semibold">Metered: /premium/*</span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">metered</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60">AI crawler: lumen.ai · Requests logged for payouts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>CREATORS</span>
              </div>
              <h2 className="text-xl font-semibold">Create for AI, stay in control</h2>
              <p className="text-sm text-white/70">
                Choose what AIs can read, keep the rest private, and charge for the parts that matter, all from one control panel.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/creators"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Learn more
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>AI TEAMS</span>
              </div>
              <h2 className="text-xl font-semibold">Source the best data, without guesswork</h2>
              <p className="text-sm text-white/70">
                One gateway where every domain’s access and pricing rules are explicit, so you get predictable paid access instead of random blocks.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/ai-teams"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Learn more
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>VISION</span>
              </div>
              <h2 className="text-xl font-semibold">Our vision: a fair web for AI</h2>
              <p className="text-sm text-white/70">
                FairCrawl turns invisible AI traffic into a protocol with consent, speed, and value built in.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/vision"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Read the vision
              </Link>
            </div>
          </MarketingCard>

          <MarketingCard className="flex h-full flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>DIRECTORY</span>
              </div>
              <h2 className="text-xl font-semibold">Verified AI-ready sites</h2>
              <p className="text-sm text-white/70">
                Explore domains that have verified ownership and published AI access rules through FairCrawl.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link
                href="/directory"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                View directory
              </Link>
            </div>
          </MarketingCard>
        </div>
      </section>
    </div>
  );
};

export default Page;

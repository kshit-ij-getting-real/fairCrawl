import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';

const CreatorsPage = () => {
  const highlights = [
    'Choose which pages AIs can read and which stay private.',
    'See which AI crawlers actually visit your site and what they read.',
    'Decide page by page which parts of your site are open to AI crawlers.',
    'Protect your site from noisy crawlers with simple speed limits.',
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section className="space-y-8 text-white">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">For creators &amp; publishers</p>
          <h1 className="text-3xl font-semibold">FairCrawl for creators &amp; publishers</h1>
          <p className="text-base leading-relaxed text-white/80">
            Decide what AIs can read, keep drafts private, and see every AI crawler that touches your work.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <ul className="space-y-3 text-sm text-white/80">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <MarketingCard className="space-y-4 text-white">
              <p className="text-sm font-semibold text-white/80">Publisher control snapshot</p>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                  <span className="font-semibold">Allowed paths</span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-200">/blog/*</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                  <span className="font-semibold">Blocked</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">/drafts/*</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-sm">
                  <span className="font-semibold">AI speed cap</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 req/sec</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Shared log</p>
                <p className="mt-2 text-sm text-white">atlas-research.ai → /blog/ai-trends (200)</p>
                <p className="text-xs text-white/70">Visible to both sides with timestamps.</p>
              </div>
            </MarketingCard>
          </div>

          <div className="space-y-6">
            <MarketingCard className="flex h-full flex-col justify-between space-y-4 text-white">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">What you control</h2>
                <p className="text-sm text-white/70">
                  Share the parts of your site that help you grow, throttle AI crawlers when traffic spikes, and keep private areas off limits.
                </p>
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
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Link href="/directory" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                  Browse AI-ready sites
                </Link>
                <Link
                  href="/signup?role=publisher"
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
                >
                  Get started as a creator
                </Link>
              </div>
            </MarketingCard>

            <MarketingCard className="flex h-full flex-col justify-between space-y-3 text-white">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">From free crawling to paid feeds</h3>
                <p className="text-sm text-white/70">
                  Today, AI crawlers read your work for free and you never see it. FairCrawl is built to flip that. First you set the rules and see the traffic. Next, we plug in payouts so AIs that read at scale have to pay for a clean, permissioned feed instead of scraping in the dark.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Link href="/directory" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                  Browse AI-ready sites
                </Link>
                <Link
                  href="/signup?role=publisher"
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
                >
                  Get started as a creator
                </Link>
              </div>
            </MarketingCard>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatorsPage;

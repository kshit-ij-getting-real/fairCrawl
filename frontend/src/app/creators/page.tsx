import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';

const CreatorsPage = () => {
  const highlights = [
    'Choose which pages AIs can read and which stay private.',
    'Turn AI reads into paid, logged access using the same rules that control what they can see.',
    'See which AI crawlers actually visit your site and what they read.',
    'Decide page by page which parts of your site are open to AI crawlers.',
    'Protect your site from noisy crawlers with simple speed limits.',
  ];

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

          <ul className="space-y-3 text-sm text-white/80">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          <MarketingCard className="flex flex-col">
            <div className="flex flex-col gap-4 text-white">
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
            </div>
          </MarketingCard>

          <MarketingCard className="flex flex-col">
            <div className="flex flex-col gap-4 text-white">
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
              <div className="mt-auto flex justify-end gap-3">
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
            </div>
          </MarketingCard>
        </div>

        <MarketingCard className="flex flex-col gap-4 text-white">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">From free crawling to paid feeds</h3>
            <p className="text-sm text-white/70">
              Today, AI crawlers read your work for free and you rarely see it. With FairCrawl, the same rules that say what’s open, what’s private, and how fast they can read also set what they pay. When crawlers hit your site through FairCrawl, those rules apply in real time, so large readers pay for a controlled, logged feed instead of scraping in the dark.
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
      </section>
    </main>
  );
};

export default CreatorsPage;

import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';

const CreatorsPage = () => {
  const highlights = [
    'Choose which pages AIs can read and which stay private.',
    'See which AI products actually visit your site and what they read.',
    "Set simple speed limits so crawlers don't overload your infra.",
  ];

  return (
    <main className="space-y-12 md:space-y-16">
      <section className="space-y-8 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">For creators &amp; publishers</p>
          <h1 className="text-3xl font-semibold">FairCrawl for creators &amp; publishers</h1>
          <p className="text-base leading-relaxed text-white/80">
            Decide what AIs can read, keep drafts private, and see every bot that touches your work.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <ul className="space-y-3 text-sm text-white/80">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
                    <span className="font-semibold">AI speed cap</span>
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
          </div>

          <MarketingCard className="space-y-4 text-white">
            <h2 className="text-2xl font-semibold">What you control</h2>
            <p className="text-sm text-white/70">
              Share the parts of your site that help you grow, throttle AIs when traffic spikes, and keep private areas off limits.
            </p>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Visibility</span>
                <span className="rounded-full bg-faircrawl-accent/10 px-3 py-1 text-xs text-faircrawl-accent">/blog/*</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Protected</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">/drafts/*</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Speed</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 requests/sec</span>
              </div>
            </div>
          </MarketingCard>
        </div>

        <SectionActions>
          <Link
            href="/signup?role=publisher"
            className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get started as a creator
          </Link>
          <Link
            href="/directory"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Browse AI-ready sites
          </Link>
        </SectionActions>
      </section>
    </main>
  );
};

export default CreatorsPage;

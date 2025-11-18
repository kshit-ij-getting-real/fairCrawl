import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';

const HowItWorksPage = () => {
  const steps = [
    {
      title: 'Crawler hits a wall',
      body: 'An AI crawler tries to read your site. Instead of guessing your rules or scraping around blocks, it goes through FairCrawl.',
    },
    {
      title: 'Request goes through FairCrawl',
      body:
        'The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are, how fast they crawl, and what they want to access.',
    },
    {
      title: 'You set the rules',
      body: 'You choose which paths are open, which are metered, and which stay private. FairCrawl enforces those rules on every request.',
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section className="space-y-8 text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="mx-auto max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Product flow</p>
            <h1 className="text-3xl font-semibold">How FairCrawl works</h1>
            <p className="text-base leading-relaxed text-white/80">
              FairCrawl is the handshake between AI crawlers and the sites they need. We check identity, pace, and permissions so both sides know what is allowed.
            </p>
            <p className="text-base leading-relaxed text-white/80">
              AI crawlers route through FairCrawl instead of scraping in the dark. You choose which paths are open, throttled, or blocked, and every request is logged so both sides see the same record.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MarketingCard key={step.title} className="flex h-full flex-col text-white">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-blue-200">
                      <path d="M12 3v18" />
                      <path d="M5 9l7 6 7-6" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-slate-50">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-200">{step.body}</p>
              </div>
            </MarketingCard>
          ))}
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <Link
            href="/creators"
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            See creator controls
          </Link>
          <Link
            href="/ai-teams"
            className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
          >
            See AI API
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;

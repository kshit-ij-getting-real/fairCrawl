import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';

const HowItWorksPage = () => {
  const handshake = [
    'AI crawlers route through FairCrawl instead of scraping in the dark.',
    'You choose which paths are open, throttled, or blocked for crawlers.',
    'Every request is logged so both sides see the same record.',
  ];

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
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Product flow</p>
          <h1 className="text-3xl font-semibold">How FairCrawl works</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80">
            FairCrawl is the handshake between AI crawlers and the sites they need. We check identity, pace, and permissions so both sides know what is allowed.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-white/80">
          {handshake.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MarketingCard key={step.title} className="flex h-full flex-col justify-between space-y-3 text-white">
              <div className="space-y-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-blue-200">
                    <path d="M12 3v18" />
                    <path d="M5 9l7 6 7-6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{step.body}</p>
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

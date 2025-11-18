import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';

const HowItWorksPage = () => {
  const handshake = [
    'AI crawlers route through FairCrawl instead of scraping in the dark.',
    'You decide which paths are open, throttled, or blocked for AI crawlers.',
    'Every request is logged so both sides see the same record.',
  ];

  const steps = [
    {
      title: 'Crawler hits a wall',
      body:
        'An AI crawler tries to read your site. Instead of guessing your robots rules or scraping around blocks, it goes through FairCrawl.',
    },
    {
      title: 'Request goes through FairCrawl',
      body:
        'The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are, how fast they crawl, and what they want to access.',
    },
    {
      title: 'You set the rules',
      body:
        'You choose which paths are open, which are metered, and which stay private. FairCrawl enforces those rules on every request.',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:space-y-16">
      <section className="space-y-8 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">Product flow</p>
          <h1 className="text-3xl font-semibold">How FairCrawl works</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80">
            FairCrawl is the handshake between AI crawlers and the sites they need. We check identity, pace, and permissions so both sides know what is allowed.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-white/80">
          {handshake.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MarketingCard key={step.title} className="space-y-3 text-white">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{step.body}</p>
            </MarketingCard>
          ))}
        </div>

        <SectionActions>
          <Link
            href="/creators"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            See creator controls
          </Link>
          <Link
            href="/ai-teams"
            className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            See AI API
          </Link>
        </SectionActions>
      </section>
    </div>
  );
};

export default HowItWorksPage;

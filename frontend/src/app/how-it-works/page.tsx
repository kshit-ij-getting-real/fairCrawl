import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';

const HowItWorksPage = () => {
  const handshake = [
    'AI crawlers point at FairCrawl instead of guessing your robots rules.',
    'FairCrawl checks your publisher rules and the AI’s identity before any content moves.',
    'Every request gets a clear allow or block with the same log for both sides.',
  ];

  return (
    <main className="space-y-12 md:space-y-16">
      <section className="space-y-10 text-white">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-faircrawl-accent">Product flow</p>
          <h1 className="text-3xl font-semibold">How FairCrawl works</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80">
            FairCrawl is the handshake between AI crawlers and the sites they need. We check identity, pace, and permissions so both
            sides know what is allowed.
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
          <MarketingCard className="space-y-3 text-white">
            <h3 className="text-xl font-semibold">Crawler hits a wall</h3>
            <p className="text-sm leading-relaxed text-white/70">
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go through
              FairCrawl.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-3 text-white">
            <h3 className="text-xl font-semibold">Request goes through FairCrawl</h3>
            <p className="text-sm leading-relaxed text-white/70">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they want to do
              with your content.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-3 text-white">
            <h3 className="text-xl font-semibold">You set the rules</h3>
            <p className="text-sm leading-relaxed text-white/70">
              You decide which paths are open, which are metered, and which stay off-limits. FairCrawl enforces those rules and keeps both
              sides honest.
            </p>
          </MarketingCard>
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
    </main>
  );
};

export default HowItWorksPage;

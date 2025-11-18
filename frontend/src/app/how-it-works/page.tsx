import Link from 'next/link';

import { MarketingCard } from '../../components/marketing-card';
import { SectionActions } from '../../components/ui/SectionActions';

const HowItWorksPage = () => {
  return (
    <main className="space-y-12 md:space-y-16">
      <section className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-semibold">How FairCrawl works</h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/80">
            FairCrawl sits between AI crawlers and your site. Crawlers call us first, we check your rules, and every request goes
            back with a clear allow or block you can audit.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">Crawler hits a wall</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-white/70">
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go
              through FairCrawl.
            </p>
          </MarketingCard>
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">Request goes through FairCrawl</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-white/70">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they want
              to do with your content.
            </p>
          </MarketingCard>
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">You set the rules</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-white/70">
              You decide which paths are open, which are metered, and which stay off-limits. FairCrawl enforces those rules and keeps
              both sides honest.
            </p>
          </MarketingCard>
        </div>

        <div className="mt-10 space-y-3 text-base text-white/80">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              <span>AI crawlers route through FairCrawl instead of scraping in the dark.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              <span>Publishers choose which paths are open, throttled, or blocked.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              <span>Every request is logged so both sides see the same record.</span>
            </li>
          </ul>
        </div>

        <SectionActions>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get early access
          </Link>
        </SectionActions>
      </section>
    </main>
  );
};

export default HowItWorksPage;

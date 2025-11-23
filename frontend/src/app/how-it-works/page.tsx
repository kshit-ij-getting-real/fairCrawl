import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';

const HowItWorksPage = () => {
  const steps = [
    {
      title: 'Crawler hits your site',
      body: 'An AI crawler tries to read your content. Instead of working around your paywall or guessing your rules, it sends the request through the FairFetch gateway.',
    },
    {
      title: 'Request goes through FairFetch',
      body: 'The AI team signs up, gets an API key, and identifies itself on every request. FairFetch checks your rules to see what they can read, how fast they can crawl, and whether the path is paid.',
    },
    {
      title: 'You set the rules — and get paid',
      body: 'You choose which paths are open, premium, throttled, or blocked, and what each crawler pays. FairFetch logs every access, returns content when allowed, and records the transaction so you can track earnings.',
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section className="text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="mx-auto max-w-3xl space-y-2">
            <SectionEyebrow className="text-white/70">Product flow</SectionEyebrow>
            <h1 className="text-3xl font-semibold">How FairFetch works</h1>
            <p className="text-base leading-relaxed text-white/80">
              FairFetch sits between AI crawlers and the sites they read. Crawlers authenticate, you set the rules, and FairFetch checks every request before content is returned.
            </p>
            <p className="text-base leading-relaxed text-white/80">
              AI crawlers go through FairFetch instead of scraping in the dark. You decide which paths are open, premium, throttled, or blocked, and every request is logged so both sides see the same record.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MarketingCard key={step.title} className="flex min-h-[260px] flex-col justify-between text-white">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/70">
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

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <SecondaryButton href="/creators">See creator controls</SecondaryButton>
          <PrimaryButton href="/ai-teams">See AI API</PrimaryButton>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;

import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
const AiTeamsPage = () => {
  const benefits = [
    'One API key for many publishers with clear rules for each domain.',
    'See which paths are free, metered, or blocked before you crawl.',
    'Built-in rate limiting and audit trail so you can show partners how you access content.',
    'Shared observability so you and the publisher see the same record of reads.',
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:space-y-16">
      <section className="space-y-10 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
          <h1 className="text-3xl font-semibold">FairCrawl for AI teams</h1>
          <p className="text-base leading-relaxed text-white/80">
            Get clean, permissioned data without fighting random blocks. FairCrawl makes crawler access predictable and transparent.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketingCard className="space-y-4 text-white">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">API preview</p>
              <p className="text-sm text-white/80">A single call tells you if a page is open, throttled, or blocked for your crawler.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white/80">
              curl "https://api.faircrawl.ai/check" \\
              <br />-H "X-API-Key: YOUR_KEY" \\
              <br />-d '{'{"url": "https://site.com/blog/ai"}'}'
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Identity</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">API key per crawler</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Pacing</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">5 rps default</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Logging</span>
                <span className="rounded-full bg-faircrawl-accent/10 px-3 py-1 text-xs text-faircrawl-accent">Shared audit trail</span>
              </div>
            </div>
          </MarketingCard>

          <MarketingCard className="space-y-4 text-white">
            <h2 className="text-2xl font-semibold">Why AI teams use FairCrawl</h2>
            <ul className="space-y-3 text-sm text-white/80">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </MarketingCard>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Read how it works
          </Link>
          <Link
            href="/signup?role=ai-client"
            className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get API access
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AiTeamsPage;

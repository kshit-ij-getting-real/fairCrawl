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
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:space-y-16 md:py-16">
      <section className="space-y-10 text-white">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">For AI teams</p>
          <h1 className="text-3xl font-semibold">FairCrawl for AI teams</h1>
          <p className="text-base leading-relaxed text-white/80">
            Get clean, permissioned data without fighting random blocks. FairCrawl makes crawler access predictable and transparent.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketingCard className="space-y-4 text-white">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-blue-200">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/80">API preview</p>
              <p className="text-sm text-white/70">A single call tells you if a page is open, throttled, or blocked for your crawler.</p>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/50 px-4 py-3 text-xs font-mono text-blue-100">
{`curl "https://api.faircrawl.ai/check" \\
  -H "X-API-Key: YOUR_KEY" \\
  -d '{"url": "https://site.com/blog/ai"}'`}
            </pre>
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
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">Shared audit trail</span>
              </div>
            </div>
          </MarketingCard>

          <MarketingCard className="space-y-3 text-white">
            <h2 className="text-2xl font-semibold">Why AI teams use FairCrawl</h2>
            <ul className="space-y-3 text-sm text-white/80">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </MarketingCard>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
          >
            Read how it works
          </Link>
          <Link
            href="/signup?role=aiclient"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80"
          >
            Get API access
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AiTeamsPage;

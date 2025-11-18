import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { API_BASE } from '../../lib/config';

const AiTeamsPage = () => {
  const benefits = [
    'One API key for many creators with clear rules for each domain.',
    'See which paths are free, metered, or blocked before you crawl.',
    'Built-in rate limiting and audit trail so you can show partners how you access content.',
    'Shared observability so you and the publisher see the same record of reads.',
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <section className="space-y-10 text-white">
        <div className="space-y-3 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">For AI teams</p>
            <h1 className="text-3xl font-semibold">FairCrawl for AI teams</h1>
            <p className="text-base leading-relaxed text-white/80">
              Get clean, permissioned data without fighting random blocks. FairCrawl makes crawler access predictable and transparent.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketingCard className="flex flex-col gap-4 min-h-[320px] text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
              <span>API PREVIEW</span>
            </div>
            <p className="text-sm text-white/70">
              A single call tells you if a page is open, throttled, or blocked for your crawler.
            </p>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-xs font-mono text-blue-100">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                <span className="rounded-full bg-white/10 px-2 py-1">Identity</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Pacing</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Logging</span>
              </div>
              <pre className="mt-4 overflow-x-auto overflow-y-hidden rounded-xl bg-black/60 p-4 text-xs font-mono whitespace-pre">{`curl "${API_BASE}/api/gateway/fetch?url=https://site.com/blog/ai" \\
  -H "X-API-Key: YOUR_KEY"`}</pre>
            </div>
          </MarketingCard>

          <MarketingCard className="flex flex-col justify-between gap-4 min-h-[320px] text-white">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Why AI teams use FairCrawl</h2>
              <ul className="space-y-3 text-sm text-white/80">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Link href="/how-it-works" className="rounded-full bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                Read how it works
              </Link>
              <Link
                href="/signup?role=aiclient"
                className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Get API access
              </Link>
            </div>
          </MarketingCard>
        </div>
      </section>
    </main>
  );
};

export default AiTeamsPage;

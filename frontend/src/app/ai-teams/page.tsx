import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';

const AiTeamsPage = () => {
  const benefits = [
    'One API for many publishers, with clear rules per domain.',
    'Built-in rate limits and audit trails so partners can see your access.',
    'Know which paths are open, metered, or blocked before you crawl.',
    'Skip one-off scrapers and keep legal happy with transparent access.',
  ];

  return (
    <main className="space-y-12 md:space-y-16">
      <section className="space-y-10 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
          <h1 className="text-3xl font-semibold">FairCrawl for AI teams</h1>
          <p className="text-base leading-relaxed text-white/80">
            One integration to ask publishers for access, honor their rules, and get clean data without guesswork.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketingCard className="space-y-4 text-white">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">API preview</p>
              <div className="space-y-2 text-sm text-white">
                <p className="font-semibold">curl https://api.faircrawl.ai/check</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs text-white/90">{'{"url": "https://site.com/blog/ai"}'}</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs text-white/90">→ allowed with 5 rps, log shared</p>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Identity</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">API key per agent</span>
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

        <SectionActions>
          <Link
            href="/signup?role=ai-client"
            className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get API access
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Read how it works
          </Link>
        </SectionActions>
      </section>
    </main>
  );
};

export default AiTeamsPage;

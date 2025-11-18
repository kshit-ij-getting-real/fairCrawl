import Link from 'next/link';

import { MarketingCard } from '../../components/marketing-card';
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
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-10 shadow-xl">
        <div className="grid gap-10 lg:grid-cols-2">
          <MarketingCard className="text-white">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">API preview</p>
              <div className="space-y-2 text-sm text-white">
                <p className="font-semibold">curl https://api.faircrawl.ai/check</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs text-white/90">{'{"url": "https://site.com/blog/ai"}'}</p>
                <p className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 font-mono text-xs text-white/90">→ allowed with 5 rps, log shared</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </MarketingCard>
          <div className="space-y-4 text-white">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
              <h1 className="text-3xl font-semibold">Source the best data for your models</h1>
              <p className="text-base leading-relaxed text-white/80">
                One integration to ask publishers for access, honor their rules, and get clean data without guesswork.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-white/80">
              {benefits.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <SectionActions>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
              >
                Request API access
              </Link>
            </SectionActions>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AiTeamsPage;

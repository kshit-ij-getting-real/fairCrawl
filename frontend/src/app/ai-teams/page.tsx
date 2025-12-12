import { API_BASE } from '../../lib/config';
import { MarketingSection } from '../../components/marketing/MarketingSection';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';

const AiTeamsPage = () => {
  const benefits = [
    'One API key for many publishers, with clear rules for each domain.',
    'See which paths are free, metered, or blocked before you crawl.',
    'Built-in rate limiting, identity verification, and audit logs prove you’re playing fair.',
    'Shared observability so you and the publisher see the same record of reads.',
  ];
  const statusBadges = [
    { label: 'Open', className: 'bg-blue-500/20 text-blue-100' },
    { label: 'Throttled', className: 'bg-amber-500/20 text-amber-100' },
    { label: 'Blocked', className: 'bg-white/10 text-white' },
  ];

  return (
    <MarketingSection>
      <MarketingCard className="space-y-4 bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo text-white">
        <div className="mx-auto max-w-3xl space-y-2">
          <SectionEyebrow className="text-white/70">For AI teams</SectionEyebrow>
          <h1 className="text-3xl font-semibold md:text-4xl">FairFetch for AI teams</h1>
          <p className="text-base leading-relaxed text-white/80">
            Get clean, permissioned access to creator content through a single API, with clear rules and audit logs on every crawl.
          </p>
        </div>
      </MarketingCard>

      <div className="grid gap-8 lg:grid-cols-2">
        <MarketingCard className="flex min-h-[320px] flex-col gap-4 text-white">
          <SectionEyebrow className="text-blue-200">API preview</SectionEyebrow>
          <p className="text-sm text-white/70">
            A single call tells you if a page is open, throttled, or blocked for your crawler.
          </p>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/60 p-4 text-xs font-mono text-blue-100">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
              {statusBadges.map((badge) => (
                <span key={badge.label} className={`rounded-full px-3 py-1 ${badge.className}`}>
                  {badge.label}
                </span>
              ))}
            </div>
            <pre className="overflow-x-auto whitespace-pre rounded-xl bg-black/70 p-4 text-xs text-white">{`curl "${API_BASE}/api/gateway/fetch?url=https://site.com/blog/ai" \\
  -H "X-API-Key: YOUR_KEY"`}</pre>
          </div>
        </MarketingCard>

        <MarketingCard className="flex min-h-[320px] flex-col justify-between gap-4 text-white">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Why AI teams use FairFetch</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </MarketingCard>
      </div>

      <div className="flex flex-wrap justify-end gap-4 pt-4 text-white">
        <SecondaryButton href="/how-it-works">Read how it works</SecondaryButton>
        <PrimaryButton href="/signup?role=aiclient">Get API access</PrimaryButton>
      </div>
    </MarketingSection>
  );
};

export default AiTeamsPage;

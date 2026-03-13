import { SubpageHero } from '../../components/marketing/SubpageHero';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { API_BASE_URL } from '../../lib/apiBase';

const AiTeamsPage = () => {
  const benefits = [
    'One API key for many publishers, with clear rules for each domain.',
    'See which paths are free, metered, or not listed before you crawl.',
    'Client identity and shared transaction logs make usage easy to verify.',
    'Shared observability so you and the publisher see the same record of reads.',
  ];
  const statusBadges = [
    { label: 'Open', className: 'bg-[rgba(86,109,245,0.12)] text-[#5165d7]' },
    { label: 'Paid', className: 'bg-[rgba(237,167,95,0.14)] text-[#a3641a]' },
    { label: 'Not listed', className: 'bg-[rgba(214,105,243,0.12)] text-[#a152d4]' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="space-y-12 md:space-y-16">
        <SubpageHero
          eyebrow="For AI teams"
          title="FairFetch for AI teams"
          description="Get clean, permissioned access to creator content through a single API, with clear rules and audit logs on every crawl."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketingCard className="flex min-h-[320px] flex-col gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,242,255,0.84))]">
            <SectionEyebrow className="text-[#6871d8]">API preview</SectionEyebrow>
            <p className="text-sm leading-7 text-[#6e759b]">
              A single call tells you if a page is open, paid, or not listed for your client.
            </p>
            <div className="space-y-4 rounded-2xl border border-[rgba(126,135,212,0.16)] bg-[rgba(255,255,255,0.58)] p-4 text-xs font-mono text-[#5165d7] shadow-[0_10px_24px_rgba(126,120,210,0.08)]">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7b82a8]">
                {statusBadges.map((badge) => (
                  <span key={badge.label} className={`rounded-full px-3 py-1 ${badge.className}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
              <pre className="overflow-x-auto whitespace-pre rounded-xl bg-[rgba(84,87,217,0.08)] p-4 text-xs text-[#2f397f]">{`curl "${API_BASE_URL}/api/gateway/fetch?url=https://site.com/blog/ai" \\
  -H "X-API-Key: YOUR_KEY"`}</pre>
            </div>
          </MarketingCard>

          <MarketingCard className="flex min-h-[320px] flex-col justify-between gap-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,243,255,0.84))]">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-[#25306d]">Why AI teams use FairFetch</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-[#6e759b]">
                {benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </MarketingCard>
        </div>

        <div className="flex flex-wrap justify-end gap-4 pt-4">
          <SecondaryButton href="/how-it-works">Read how it works</SecondaryButton>
          <PrimaryButton href="/signup?role=aiclient">Get API access</PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default AiTeamsPage;

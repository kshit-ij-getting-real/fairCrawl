import { SubpageHero } from '../../components/marketing/SubpageHero';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Buttons';

const HowItWorksPage = () => {
  const steps = [
    {
      title: 'Research providers list content and terms',
      body: 'An AI client tries to read your content. Instead of working around your paywall or guessing your rules, it sends the request through the FairFetch gateway.',
    },
    {
      title: 'FairFetch makes sources discoverable and agent-readable',
      body: 'AI teams query FairFetch with identity and permissions context. FairFetch returns what can be licensed and retrieved, including pricing and allowed license types.',
    },
    {
      title: 'Agents retrieve licensed research through tokens/API',
      body: 'Both sides get logs, receipts, and pricing records so every retrieval is auditable for usage review and billing.',
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <section>
        <SubpageHero
          eyebrow="Product flow"
          title="How FairFetch works"
          description={
            <>
              <p>
                FairFetch sits between AI clients and the sites they read. Clients authenticate, you set the rules, and FairFetch checks every request before content is returned.
              </p>
              <p>
                AI clients go through FairFetch instead of requesting in the dark. You decide which paths are open, premium, or not listed, and paid requests are logged so both sides see the same record.
              </p>
            </>
          }
        />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <MarketingCard key={step.title} className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,242,255,0.84))]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(101,113,236,0.12)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-[#5b68e1]">
                      <path d="M12 3v18" />
                      <path d="M5 9l7 6 7-6" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-[#25306d]">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6e759b]">{step.body}</p>
              </div>
            </MarketingCard>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <SecondaryButton href="/creators">See research provider controls</SecondaryButton>
          <PrimaryButton href="/ai-teams">See AI API</PrimaryButton>
        </div>
      </section>
    </main>
  );
};

export default HowItWorksPage;

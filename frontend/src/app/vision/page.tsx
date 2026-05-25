import { SubpageHero } from '../../components/marketing/SubpageHero';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';

const VisionPage = () => {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="space-y-12 md:space-y-16">
        <SubpageHero
          eyebrow="Vision"
          title="Our vision: licensed research infrastructure for AI agents"
          description="AI is becoming the web’s main reader. FairFetch turns that traffic into a licensed research marketplace where AI agents can retrieve specialist analysis with clear permissions, pricing, and receipts."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: 'AI as a user',
              title: 'AI as a first-class web user',
              body:
                'Most of the web was built for human browsers. FairFetch treats AI clients as first-class users so they can access content without breaking sites, and research providers can set clear terms for retrieval.',
            },
            {
              label: 'Consent & speed',
              title: 'Consent, speed and money built in',
              body:
                'Every AI request should carry identity, rate limits, and a way to account for value. FairFetch bakes identity, pacing, and metering into the request path, so consent and payments are part of the protocol, not an afterthought.',
            },
            {
              label: 'Standard',
              title: 'From one product to a standard',
              body:
                'We start as a working prototype for licensed retrieval. The long-term goal is a common way for any site and any AI team to talk about access, licensing, and price, no matter who runs the infrastructure.',
            },
          ].map((card) => (
            <MarketingCard key={card.label} className="flex min-h-[280px] flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,242,255,0.84))]">
              <div className="space-y-3">
                <SectionEyebrow className="text-[#6871d8]">{card.label}</SectionEyebrow>
                <h3 className="text-lg font-semibold text-[#25306d]">{card.title}</h3>
                <p className="text-sm leading-7 text-[#6e759b]">{card.body}</p>
              </div>
            </MarketingCard>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-4 pt-4">
          <PrimaryButton href="/signup">Get started</PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default VisionPage;

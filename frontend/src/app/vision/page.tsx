import { MarketingSection } from '../../components/marketing/MarketingSection';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { PrimaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';

const VisionPage = () => {
  return (
    <MarketingSection>
      <MarketingCard className="space-y-4 bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo text-white">
        <div className="space-y-2">
          <SectionEyebrow className="text-white/70">Vision</SectionEyebrow>
          <h1 className="text-3xl font-semibold md:text-4xl">Our vision: a fair web for AI</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80">
            AI is becoming the web’s main reader. FairFetch turns that traffic into a transparent marketplace where AI companies pay creators directly for the human imagination that powers their models.
          </p>
        </div>
      </MarketingCard>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label: 'AI as a user',
            title: 'AI as a first-class web user',
            body:
              'Most of the web was built for human browsers. FairFetch treats AI crawlers as first-class users so they can access content without breaking sites, and creators can set clear terms for that access.',
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
              'We start as a hosted gateway for AI traffic. The long-term goal is a common way for any site and any AI team to talk about access, licensing, and price — no matter who runs the infrastructure.',
          },
        ].map((card) => (
          <MarketingCard key={card.label} className="flex min-h-[280px] flex-col justify-between text-white">
            <div className="space-y-3">
              <SectionEyebrow className="text-blue-200">{card.label}</SectionEyebrow>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{card.body}</p>
            </div>
          </MarketingCard>
        ))}
      </div>

      <div className="flex flex-wrap justify-end gap-4 pt-4">
        <PrimaryButton href="/signup">Get started</PrimaryButton>
      </div>
    </MarketingSection>
  );
};

export default VisionPage;

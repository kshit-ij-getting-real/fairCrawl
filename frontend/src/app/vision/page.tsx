import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
const VisionPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:space-y-16">
      <section className="space-y-10 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">Vision</p>
          <h1 className="text-3xl font-semibold">Our vision: a fair web for AI</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/80">
            AI is becoming the web’s main reader. FairCrawl turns that traffic into a protocol with clear consent, speed, and value built in so creators keep control and AI teams get predictable access.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">AI as a first-class web user</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Most of the web was built for human browsers. FairCrawl treats AI crawlers as first-class users so they can access content without breaking the sites they depend on.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">Consent, speed and money as native concepts</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Every AI request should carry identity, pacing, and a way to account for value. FairCrawl bakes identity, rate limits, and metering into the request path.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">From one product to a standard</h3>
            <p className="text-sm leading-relaxed text-white/70">
              We start as a hosted gateway for AI traffic. The long-term goal is a standard way for any site and any AI team to talk about access, no matter who runs the infrastructure.
            </p>
          </MarketingCard>
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-faircrawl-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VisionPage;

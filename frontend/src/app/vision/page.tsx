import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';

const VisionPage = () => {
  return (
    <main className="space-y-12 md:space-y-16">
      <section className="space-y-10 text-white">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-faircrawl-accent">Vision</p>
          <h1 className="text-3xl font-semibold">Our vision: a fair web for AI</h1>
          <p className="text-base leading-relaxed text-white/80 max-w-3xl">
            AI is becoming the web’s main reader. FairCrawl turns that traffic into a protocol with clear consent, speed, and value built
            in for both sides.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">AI as a first-class web user</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Most of the web was built for human browsers. FairCrawl is designed for the web’s new reader so AIs can access content
              without breaking the sites they depend on.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">Consent, speed and money as native concepts</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Every AI request should carry identity, pacing, and a way to account for value. FairCrawl bakes identity, rate limits, and
              metering into the request path.
            </p>
          </MarketingCard>
          <MarketingCard className="space-y-2 text-white">
            <h3 className="text-lg font-semibold">From one product to a standard</h3>
            <p className="text-sm leading-relaxed text-white/70">
              The MVP is a shared gateway for AI traffic. The long-term goal is a standard way for any site and any AI to talk about access,
              no matter who runs the infra.
            </p>
          </MarketingCard>
        </div>

        <SectionActions>
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-faircrawl-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
          >
            Get started
          </Link>
        </SectionActions>
      </section>
    </main>
  );
};

export default VisionPage;

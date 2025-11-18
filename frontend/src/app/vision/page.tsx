import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';

const VisionPage = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl flex-col px-6 py-16">
      <div className="flex-1 flex flex-col justify-center space-y-10 text-white">
        <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Vision</p>
            <h1 className="text-3xl font-semibold">Our vision: A fair web for AI</h1>
            <p className="max-w-3xl text-base leading-relaxed text-white/80">
              AI is becoming the web’s main reader. FairCrawl turns that traffic into a transparent marketplace where AI companies pay creators directly for the human imagination that powers their models.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <MarketingCard className="flex flex-col gap-3 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>AI AS A USER</span>
              </div>
              <h3 className="text-lg font-semibold">AI as a first-class web user</h3>
              <p className="text-sm leading-relaxed text-white/70">
                Most of the web was built for human browsers. FairCrawl treats AI crawlers as first-class users so they can access content without breaking the sites they depend on.
              </p>
            </div>
          </MarketingCard>
          <MarketingCard className="flex flex-col gap-3 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>CONSENT &amp; SPEED</span>
              </div>
              <h3 className="text-lg font-semibold">Consent, speed and money as native concepts</h3>
              <p className="text-sm leading-relaxed text-white/70">
                Every AI request should carry identity, pacing, and a way to account for value. FairCrawl bakes identity, rate limits, and metering into the request path.
              </p>
            </div>
          </MarketingCard>
          <MarketingCard className="flex flex-col gap-3 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-300">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px]">●</span>
                <span>STANDARD</span>
              </div>
              <h3 className="text-lg font-semibold">From one product to a standard</h3>
              <p className="text-sm leading-relaxed text-white/70">
                We start as a hosted gateway for AI traffic. The long-term goal is a standard way for any site and any AI team to talk about access, no matter who runs the infrastructure.
              </p>
            </div>
          </MarketingCard>
        </div>

        <div className="flex justify-end">
          <Link
            href="/signup"
            className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-400"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
};

export default VisionPage;

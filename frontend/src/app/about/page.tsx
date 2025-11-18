import { MarketingCard } from '../../components/marketing-card';

const AboutPage = () => {
  return (
    <main className="space-y-12">
      <section className="rounded-3xl bg-slate-900 p-10 shadow-xl">
        <div className="mx-auto max-w-3xl space-y-6 text-white">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-semibold">Our vision: A fair web for AI</h1>
            <p className="text-base leading-relaxed text-white/80">
              AI is becoming the web’s main reader. Today that traffic is invisible, unaccountable, and often hostile to the sites it depends on. FairCrawl’s job is to turn that mess into a protocol everyone can live with.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MarketingCard className="text-white">
              <h3 className="text-lg font-semibold">AI as a first-class web user</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Most of the web’s infrastructure was built for human browsers. AIs behave differently: they read at scale, remix content, and never sleep. We assume this, and design FairCrawl as infrastructure for the web’s new user, not a bolt-on scraper.
              </p>
            </MarketingCard>
            <MarketingCard className="text-white">
              <h3 className="text-lg font-semibold">Consent, speed and money as native concepts</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Every AI request should carry three things: proof of who is asking, constraints on how fast they can read, and a way to account for economic value. FairCrawl bakes identity, rate limits, and metering into the request path.
              </p>
            </MarketingCard>
            <MarketingCard className="text-white">
              <h3 className="text-lg font-semibold">From one product to a standard</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                The MVP is a hosted service: a shared gateway for AI traffic. The long-term goal is a standard way for any site and any AI to talk about access, no matter who runs the infra underneath.
              </p>
            </MarketingCard>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

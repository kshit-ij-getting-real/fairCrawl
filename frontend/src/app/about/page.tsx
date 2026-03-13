import { MarketingCard } from '../../components/marketing-card';

const AboutPage = () => {
  return (
    <main className="space-y-12">
      <section className="relative overflow-hidden rounded-[36px] border border-[rgba(126,135,212,0.16)] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(244,242,255,0.96)_48%,rgba(249,246,255,0.94)_100%)] p-10 shadow-[0_28px_70px_rgba(126,119,213,0.16)]">
        <div className="pointer-events-none absolute -left-8 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(118,123,238,0.18),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-56 rounded-bl-[96px] bg-[radial-gradient(circle_at_top_right,rgba(216,106,243,0.16),rgba(115,124,233,0.14)_36%,transparent_72%)]" />
        <div className="mx-auto max-w-3xl space-y-6 text-[#25306d]">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-semibold">Our vision: A fair web for AI</h1>
            <p className="text-base leading-relaxed text-[#6e759b]">
              AI is becoming the web’s main reader. Today that traffic is invisible, unaccountable, and often hostile to the sites it depends on. FairFetch’s job is to turn that mess into a protocol everyone can live with.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MarketingCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,242,255,0.84))]">
              <h3 className="text-lg font-semibold text-[#25306d]">AI as a first-class web user</h3>
              <p className="mt-2 text-sm leading-7 text-[#6e759b]">
                Most of the web’s infrastructure was built for human browsers. AIs behave differently: they read at scale, remix content, and never sleep. We assume this, and design FairFetch as infrastructure for the web’s new user, not a bolt-on client.
              </p>
            </MarketingCard>
            <MarketingCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,243,255,0.84))]">
              <h3 className="text-lg font-semibold text-[#25306d]">Consent, speed and money as native concepts</h3>
              <p className="mt-2 text-sm leading-7 text-[#6e759b]">
                Every AI request should carry three things: proof of who is asking, constraints on how fast they can read, and a way to account for economic value. FairFetch bakes identity, rate limits, and metering into the request path.
              </p>
            </MarketingCard>
            <MarketingCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,246,255,0.84))]">
              <h3 className="text-lg font-semibold text-[#25306d]">From one product to a standard</h3>
              <p className="mt-2 text-sm leading-7 text-[#6e759b]">
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

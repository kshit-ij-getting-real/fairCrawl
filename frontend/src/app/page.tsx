import { MarketingCard } from '../components/marketing-card';
import { fetchPublicDomains } from '../lib/directory';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const domains = await fetchPublicDomains();
  const verifiedDomains = domains.filter((domain) => domain.verified);

  return (
    <main className="space-y-16 md:space-y-20">
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-12 shadow-xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-faircrawl-textMain">
              <span className="h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              Controlled AI crawling
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">Let AI in without losing control</h1>
              <p className="text-lg leading-relaxed text-faircrawl-textMuted">
                FairCrawl sits between AI crawlers and your site. AI clients ask us for pages, you set the rules, and we enforce them on every request.
              </p>
              <p className="text-base leading-relaxed text-faircrawl-textMuted">
                AI crawlers call FairCrawl instead of your site directly. FairCrawl checks your rules, then either serves the page or returns a clear block.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/signup"
                  className="rounded-full bg-faircrawl-accent px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-faircrawl-accentSoft"
                >
                  Get early access
                </a>
                <a href="#how-it-works" className="font-semibold text-faircrawl-textMain hover:text-white">
                  See how FairCrawl works
                </a>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#for-creators"
                  className="w-full rounded-full border border-white/30 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  I&apos;m a creator
                </a>
                <a
                  href="#for-ai"
                  className="w-full rounded-full border border-white/30 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  I&apos;m an AI builder
                </a>
              </div>
            </div>
          </div>
          <MarketingCard className="bg-white/5 text-white">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Gateway snapshot</h2>
              <p className="text-sm text-white/70">
                Every AI request is logged, matched against your rules, and returned with a clear allow or block.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/blog/ai</span>
                  <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs font-semibold text-faircrawl-accent">
                    allowed
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/60">Client: atlas-research.ai · Rate: 5 rps</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span className="font-semibold">/drafts/*</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">blocked</span>
                </div>
                <p className="mt-2 text-xs text-white/60">Client: unknown · Reason: publisher rules</p>
              </div>
            </div>
          </MarketingCard>
        </div>
      </section>

      <section id="how-it-works" className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl font-semibold">How FairCrawl works</h2>
          <div className="space-y-3 text-base text-white/70">
            <p>A simple handshake between your site and AI teams.</p>
            <ul className="mx-auto max-w-2xl space-y-2 text-sm">
              <li className="flex items-start justify-center gap-2 text-left">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>AI crawlers route through FairCrawl instead of scraping in the dark.</span>
              </li>
              <li className="flex items-start justify-center gap-2 text-left">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>You choose which paths are open, throttled, or blocked for AI agents.</span>
              </li>
              <li className="flex items-start justify-center gap-2 text-left">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Every request is logged so both sides see the same record.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">Crawler hits a wall</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go through FairCrawl.
            </p>
          </MarketingCard>
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">Request goes through FairCrawl</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they want to do with your content.
            </p>
          </MarketingCard>
          <MarketingCard>
            <h3 className="text-xl font-semibold text-white">You set the rules</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              You verify your domain, set simple rules per path, and choose how fast AIs can read. We apply those rules to every request and keep a clear log of what was accessed.
            </p>
          </MarketingCard>
        </div>
      </section>

      <section id="for-creators" className="rounded-3xl bg-white p-10 shadow-lg">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For creators &amp; publishers</p>
              <h2 className="text-3xl font-semibold">Create for AI, get paid for it</h2>
              <p className="text-base leading-relaxed text-slate-700">
                You already write for humans. Now AIs are reading too. FairCrawl gives you a simple way to say what they can read, how fast, and on what terms.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-800">
              {[
                'Publisher controls in one place: set path rules, rate limits, and access types for AI traffic.',
                'See which AI products actually care: every AI request is logged with client name and path.',
                'Decide path by path which pages AIs can see and which stay off-limits.',
                'Add simple speed limits so crawlers don’t fry your infra.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#how-it-works"
              className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              See how creators use FairCrawl
            </a>
          </div>
          <MarketingCard className="bg-slate-900 text-white">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-white/80">Publisher control snapshot</p>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 shadow-sm">
                  <span className="font-semibold">Allowed paths</span>
                  <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs text-faircrawl-accent">/blog/*</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 shadow-sm">
                  <span className="font-semibold">Blocked</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">/drafts/*</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 shadow-sm">
                  <span className="font-semibold">AI rate limit</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">5 rps</span>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Shareable log</p>
                <p className="mt-2 text-sm text-white">atlas-research.ai → /blog/ai-trends (200)</p>
                <p className="text-xs text-white/70">Visible to both sides with timestamps.</p>
              </div>
            </div>
          </MarketingCard>
        </div>
      </section>

      <section id="for-ai" className="rounded-3xl bg-white p-10 shadow-lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <MarketingCard className="bg-slate-900 text-white">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">API preview</p>
              <div className="space-y-2 text-sm text-white">
                <p className="font-semibold">curl https://api.faircrawl.ai/check</p>
                <p className="rounded-lg bg-white/5 px-4 py-3 font-mono text-xs text-white/90">{"url": "https://site.com/blog/ai"}</p>
                <p className="rounded-lg bg-white/5 px-4 py-3 font-mono text-xs text-white/90">→ allowed with 5 rps, log shared</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Discover domains that explicitly allow AI access, with clear rules.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Get a single API key instead of custom scraping logic for every site.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Know which paths are free, metered, or blocked before you crawl.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Keep an audit trail of what your models have read.</span>
              </li>
            </ul>
          </MarketingCard>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
              <h2 className="text-3xl font-semibold">Source the best data for your models, without guesswork</h2>
              <p className="text-base leading-relaxed text-slate-700">
                You want clean, high-signal data and you don’t want to fight random blocks. FairCrawl gives you one place to ask for access, respect publisher rules, and keep your legal team calm.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-800">
              {[
                'AI-friendly delivery: one API for many publishers with clear rules for each domain.',
                'Built-in rate limiting and audit trail: respect site speed limits and show partners how you access content.',
                'Cacheable responses where publishers allow, with explicit block messages when they do not.',
                'Shared observability so you and the publisher see the same record of reads.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#verified-directory"
              className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              Explore verified sources
            </a>
          </div>
        </div>
      </section>

      <section id="vision" className="py-16">
        <div className="mx-auto max-w-3xl space-y-6 px-4">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">Our vision: a fair web for AI</h2>
            <p className="text-base leading-relaxed text-slate-700">
              AI is becoming the web’s main reader. Today that traffic is invisible, unaccountable, and often hostile to the sites it depends on. FairCrawl’s job is to turn that mess into a protocol everyone can live with.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MarketingCard className="bg-slate-900 text-white">
              <h3 className="text-lg font-semibold">AI as a first-class web user</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Most of the web’s infrastructure was built for human browsers. AIs behave differently: they read at scale, remix content, and never sleep. We assume this, and design FairCrawl as infrastructure for the web’s new user, not a bolt-on scraper.
              </p>
            </MarketingCard>
            <MarketingCard className="bg-slate-900 text-white">
              <h3 className="text-lg font-semibold">Consent, speed and money as native concepts</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Every AI request should carry three things: proof of who is asking, constraints on how fast they can read, and a way to account for economic value. FairCrawl bakes identity, rate limits, and metering into the request path.
              </p>
            </MarketingCard>
            <MarketingCard className="bg-slate-900 text-white">
              <h3 className="text-lg font-semibold">From one product to a standard</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                The MVP is a hosted service: a shared gateway for AI traffic. The long-term goal is a standard way for any site and any AI to talk about access, no matter who runs the infra underneath.
              </p>
            </MarketingCard>
          </div>
        </div>
      </section>

      <section id="verified-directory" className="py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-4">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <h2 className="text-3xl font-semibold text-slate-900">Verified AI-ready sites</h2>
            <p className="text-base text-slate-600">
              These domains have verified ownership and published AI access rules through FairCrawl. They are safe defaults when you want high-quality, permissioned data.
            </p>
          </div>
          <div className="space-y-4">
            {verifiedDomains.map((domain) => (
              <MarketingCard key={domain.name}>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{domain.name}</h3>
                    <p className="text-xs text-white/60">
                      Verified
                      {domain.publisher && typeof domain.publisher === 'object' && domain.publisher.user?.email
                        ? ` by ${domain.publisher.user.email}`
                        : ''}
                      {domain.publisher && typeof domain.publisher === 'string' ? ` by ${domain.publisher}` : ''}.
                    </p>
                  </div>
                  <a
                    href={`https://${domain.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white md:mt-0"
                  >
                    Visit site
                  </a>
                </div>
              </MarketingCard>
            ))}
            <MarketingCard>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Your site here</h3>
                  <p className="text-sm text-white/70">Verify your own site and it will show up in the directory once we go live.</p>
                </div>
                <a
                  href="/signup?role=publisher"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white md:mt-0"
                >
                  Become a launch publisher
                </a>
              </div>
            </MarketingCard>
          </div>
        </div>
      </section>
    </main>
  );
}

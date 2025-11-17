import { buildDirectoryEntries, DirectoryEntry, fetchPublicDomains } from '../lib/directory';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const domains = await fetchPublicDomains();
  const directoryEntries: DirectoryEntry[] = buildDirectoryEntries(domains);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-12 shadow-xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-faircrawl-textMain">
              <span className="h-2 w-2 rounded-full bg-faircrawl-accent"></span>
              Controlled AI crawling
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">Let AI in without losing control</h1>
              <p className="text-lg text-faircrawl-textMuted leading-relaxed">
                FairCrawl sits between AI crawlers and your site. AI clients ask us for pages, you set the rules, and we enforce them on every request.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/signup"
                  className="px-6 py-3 rounded-full bg-faircrawl-accent text-white font-semibold hover:bg-faircrawl-accentSoft transition shadow-lg shadow-blue-900/40"
                >
                  Get early access
                </a>
                <a href="#how-it-works" className="text-faircrawl-textMain hover:text-white font-semibold">
                  See how FairCrawl works
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#for-creators"
                  className="w-full sm:w-auto rounded-full border border-white/30 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  I&apos;m a creator
                </a>
                <a
                  href="#for-ai"
                  className="w-full sm:w-auto rounded-full border border-white/30 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  I&apos;m an AI builder
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-white">A clear path for AI traffic</h2>
            <ul className="space-y-3 text-sm text-faircrawl-textMuted">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>AI crawlers route through FairCrawl instead of scraping in the dark.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>You choose which paths are open, throttled, or blocked for AI agents.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Every request is logged so both sides see the same record.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="for-creators" className="rounded-3xl bg-white text-slate-900 shadow-lg p-10 space-y-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For creators &amp; publishers</p>
              <h2 className="text-3xl font-semibold">Create for AI, get paid for it</h2>
              <p className="text-base text-slate-700 leading-relaxed">
                You already write for humans. Now AIs are reading too. FairCrawl gives you a simple way to say what they can read, how fast, and on what terms.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-800">
              {[
                'Turn your site into an AI-ready source, not a free buffet.',
                'Decide path by path which pages AIs can see and which stay off-limits.',
                'Add simple speed limits so crawlers don’t fry your infra.',
                'See which AI products are using your work, and how often.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#how-it-works"
              className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              See how creators use FairCrawl
            </a>
          </div>
          <div className="order-first lg:order-last rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-xl bg-gradient-to-br from-faircrawl-heroFrom/10 via-white to-faircrawl-accent/5 p-6 border border-white shadow-sm space-y-4">
              <p className="text-sm font-semibold text-slate-800">Publisher control snapshot</p>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 shadow-sm">
                  <span className="font-semibold">Allowed paths</span>
                  <span className="rounded-full bg-faircrawl-accent/10 px-3 py-1 text-xs text-faircrawl-accent">/blog/*</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 shadow-sm">
                  <span className="font-semibold">Blocked</span>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700">/drafts/*</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 shadow-sm">
                  <span className="font-semibold">AI rate limit</span>
                  <span className="rounded-full bg-faircrawl-accent/10 px-3 py-1 text-xs text-faircrawl-accent">10 rps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="for-ai" className="rounded-3xl bg-slate-50 text-slate-900 shadow-lg p-10 space-y-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 lg:order-first order-last">
            <div className="rounded-xl bg-slate-900 text-white p-6 space-y-3">
              <p className="text-sm font-semibold text-faircrawl-accent">API preview</p>
              <div className="space-y-2 text-sm text-slate-200">
                <p className="font-semibold text-white">curl https://api.faircrawl.ai/check</p>
                <p className="rounded-lg bg-white/5 px-4 py-3 font-mono text-xs text-white/90">{"url": "https://site.com/blog/ai"}</p>
                <p className="rounded-lg bg-white/5 px-4 py-3 font-mono text-xs text-white/90">→ allowed with 5 rps, log shared</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
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
          </div>
          <div className="space-y-4 lg:order-last order-first">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
              <h2 className="text-3xl font-semibold">Source the best data for your models, without guesswork</h2>
              <p className="text-base text-slate-700 leading-relaxed">
                You want clean, high-signal data and you don’t want to fight random blocks. FairCrawl gives you one place to ask for access, respect publisher rules, and keep your legal team calm.
              </p>
            </div>
            <a
              href="#directory"
              className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white transition"
            >
              Explore verified sources
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white text-slate-900 rounded-3xl shadow-lg p-10 space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">How FairCrawl works</h2>
          <p className="text-base text-slate-600">A simple handshake between your site and AI teams.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Crawler hits a wall</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go through FairCrawl.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Request goes through FairCrawl</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they want to do with your content.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">You set the rules</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              You verify your domain, set simple rules per path, and choose how fast AIs can read. We apply those rules to every request and keep a clear log of what was accessed.
            </p>
          </div>
        </div>
      </section>

      <section id="directory" className="rounded-3xl bg-gradient-to-br from-slate-900 to-faircrawl-heroTo text-white shadow-xl p-10 space-y-8">
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold">Verified AI-ready sites</h2>
          <p className="text-base text-faircrawl-textMuted">
            These domains have verified ownership and published AI access rules through FairCrawl. They are safe defaults when you want high-quality, permissioned data.
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {directoryEntries.map((entry, idx) => (
            <div key={`${entry.title || entry.domain}-${idx}`} className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-md space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">{entry.title || entry.domain}</h3>
                  {entry.verified && (
                    <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs font-semibold text-faircrawl-accent">Verified</span>
                  )}
                </div>
                {entry.domain && <p className="text-sm text-faircrawl-textMuted">{entry.domain}</p>}
                {entry.publisher && <p className="text-xs text-slate-200">Publisher: {entry.publisher}</p>}
                {entry.description && <p className="text-sm text-slate-200 leading-relaxed">{entry.description}</p>}
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {entry.link ? (
                  <a
                    href={entry.link}
                    className="inline-flex w-fit items-center rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft transition"
                  >
                    {entry.cta || 'Visit site'}
                  </a>
                ) : (
                  <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                    {entry.cta || 'Verified'}
                  </span>
                )}
                {entry.policyLink && (
                  <a
                    href={entry.policyLink}
                    className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    View policy
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a
            href="/directory"
            className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
          >
            Browse full directory
          </a>
        </div>
      </section>
    </div>
  );
}

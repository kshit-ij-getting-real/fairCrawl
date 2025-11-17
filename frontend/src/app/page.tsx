import { API_BASE } from '../lib/config';

export const dynamic = 'force-dynamic';

async function fetchMarketplace() {
  try {
    const res = await fetch(`${API_BASE}/api/public/domains`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function HomePage() {
  const domains = await fetchMarketplace();

  const directoryEntries = [
    {
      title: 'AI Essays Library',
      domain: 'ai-essays-5yft.vercel.app',
      description: 'Short essays drafted with AI, edited by humans. A testbed for transparent AI usage policies.',
      tags: ['Demo', 'Essays', 'AI-assisted'],
      link: 'https://ai-essays-5yft.vercel.app/',
      cta: 'Visit site',
    },
    {
      title: 'Macro Notes',
      domain: 'macro-notes-demo.vercel.app',
      description: 'Plain-English notes on how macro cycles hit real life. Used to test path-level policies.',
      tags: ['Demo', 'Macro', 'Research'],
      link: 'https://macro-notes-demo.vercel.app/',
      cta: 'Visit site',
    },
    {
      title: 'Your site here',
      domain: undefined,
      description: 'Verify your own site and it will show up in the directory once we go live.',
      tags: ['Coming soon'],
      link: '/signup?role=publisher',
      cta: 'Become a launch publisher',
    },
    ...domains.map((domain: any) => ({
      title: domain.name,
      domain: domain.name,
      description: domain.publisher ? `Verified by ${domain.publisher}.` : 'Live on FairCrawl.',
      tags: (domain.policies || []).slice(0, 3).map((policy: any) => policy.pathPattern || 'Policy'),
      link: domain.name ? `https://${domain.name}` : undefined,
      cta: domain.name ? 'Visit site' : 'Verified',
    })),
  ];

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
            <div className="flex flex-wrap items-center gap-3 text-sm text-faircrawl-textMuted">
              <span className="uppercase tracking-wide text-xs text-faircrawl-textMain">I&apos;m here as…</span>
              <a
                href="#for-creators"
                className="rounded-full border border-white/30 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10 transition"
              >
                A creator / publisher
              </a>
              <a
                href="#for-ai"
                className="rounded-full border border-white/30 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10 transition"
              >
                An AI team
              </a>
              <a href="#verified-directory" className="font-semibold text-faircrawl-textMain hover:text-white">
                Browse verified sites
              </a>
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

      <section
        id="for-creators"
        className="rounded-3xl bg-slate-50 text-slate-900 shadow-lg p-10 space-y-8"
      >
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For creators &amp; publishers</p>
              <h2 className="text-3xl font-semibold">Create for AI, get paid for it</h2>
              <p className="text-base text-slate-700 leading-relaxed">
                You&apos;re already writing for humans. FairCrawl lets you also write for AI, on your terms, with a record of who is reading what.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Decide what AIs can see</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Mark paths as open, metered, or blocked. Keep public pages open, keep private or paywalled content out.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Control how fast they read</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Set simple speed limits so bots don&apos;t overwhelm your site. One page per second or one hundred, you choose.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">See which AI products actually care</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Every AI request is logged with the client name and path. You finally know which products are learning from you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Turn usage into revenue (when you&apos;re ready)</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Start with free access. Later, plug usage into whatever billing or rev-share model you want.
                </p>
              </div>
            </div>
            <a
              href="/signup?role=publisher"
              className="inline-flex w-fit items-center rounded-full bg-faircrawl-accent px-5 py-3 font-semibold text-white shadow-md hover:bg-faircrawl-accentSoft transition"
            >
              Set up my first site
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-faircrawl-accent/10 flex items-center justify-center text-faircrawl-accent font-bold">FC</span>
              <div>
                <p className="text-sm text-slate-600">Visibility, throttle, revenue</p>
                <p className="font-semibold text-slate-900">Publisher controls in one place</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Open blog posts to AI, meter archives, and block drafts with a simple rule per path.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Throttle AI-specific traffic separately from human visitors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Know exactly which AI apps accessed which content and when.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="for-ai" className="rounded-3xl bg-slate-100 text-slate-900 shadow-lg p-10 space-y-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 order-last lg:order-first">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-faircrawl-accent/10 flex items-center justify-center text-faircrawl-accent font-bold">API</span>
              <div>
                <p className="text-sm text-slate-600">Single gateway for quality content</p>
                <p className="font-semibold text-slate-900">AI-friendly delivery</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Send a URL, get back a clean answer: allowed, blocked, or allowed with constraints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Rate limits enforced per domain so you don&apos;t have to build custom throttles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-faircrawl-accent"></span>
                <span>Usage logs you can share with compliance and partners.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-faircrawl-accent">For AI teams</p>
              <h2 className="text-3xl font-semibold">Source the best data for your models, without burning bridges</h2>
              <p className="text-base text-slate-700 leading-relaxed">
                You want high-quality, up-to-date content. Publishers want control, transparency, and maybe a cheque. FairCrawl sits in the middle so both sides stay happy.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">One integration, many publishers</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Integrate with FairCrawl once. Get a clean API to request pages from any publisher who opts in.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Clear rules instead of guesswork</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  For every URL you send, you get a simple answer: allowed, blocked, or allowed with constraints.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Built-in rate limiting</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Respect each site&apos;s speed limits automatically. No more one-off throttling logic per domain.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Friendly paper trail</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Show partners and compliance exactly how you access content: per-domain logs, per-path usage, per-client keys.
                </p>
              </div>
            </div>
            <a
              href="/aiclient/dashboard"
              className="inline-flex w-fit items-center rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-md hover:bg-slate-800 transition"
            >
              View API for AI teams
            </a>
          </div>
        </div>
      </section>

      <section
        id="verified-directory"
        className="rounded-3xl bg-gradient-to-br from-slate-900 to-faircrawl-heroTo text-white shadow-xl p-10 space-y-8"
      >
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold">Verified sites on FairCrawl</h2>
          <p className="text-base text-faircrawl-textMuted">
            These sites have proved they own their domains and set AI access rules through FairCrawl. They&apos;re examples of the kind of publishers you&apos;ll work with.
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {directoryEntries.map((entry, idx) => (
            <div key={`${entry.title}-${idx}`} className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-md space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                {entry.domain && <p className="text-sm text-faircrawl-textMuted">{entry.domain}</p>}
                <p className="text-sm text-slate-200 leading-relaxed">{entry.description}</p>
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
              {entry.link ? (
                <a
                  href={entry.link}
                  className="inline-flex w-fit items-center rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft transition"
                >
                  {entry.cta}
                </a>
              ) : (
                <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {entry.cta}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

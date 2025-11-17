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
                FairCrawl sits between AI crawlers and your site. AI clients ask us for pages, you set the rules, and we enforce
                them on every request.
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
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go
              through FairCrawl.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Request goes through FairCrawl</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they
              want to do with your content.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">You set the rules</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              You verify your domain, set simple rules per path, and choose how fast AIs can read. We apply those rules to every
              request and keep a clear log of what was accessed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-900 rounded-3xl shadow-lg p-10 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold">Who it&apos;s for</h2>
          <p className="text-base text-slate-600">Two sides of the same handshake.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">For publishers</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Blogs, docs, knowledge bases, research archives. You want AI traffic, but on your terms.
            </p>
            <a
              href="/signup?role=publisher"
              className="inline-flex items-center text-sm font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft"
            >
              Start as a publisher
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">For AI platforms &amp; agents</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              LLM providers, agent frameworks, AI search tools. You want a clean way to respect publisher rules.
            </p>
            <a
              href="/signup?role=aiclient"
              className="inline-flex items-center text-sm font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft"
            >
              Start as an AI client
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-900 rounded-3xl shadow-lg p-10 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold">What a verified domain looks like</h2>
          <p className="text-base text-slate-600">A quick demo of what AI teams see and follow.</p>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-700 max-w-4xl mx-auto">
          <li>Each path pattern has an allow/block decision plus a speed limit for AI crawlers.</li>
          <li>Prices are visible per 1k requests, and every request is recorded against that rule.</li>
          <li>FairCrawl enforces these settings before any bot touches your origin.</li>
        </ul>
      </section>

      <section className="bg-white text-slate-900 rounded-3xl shadow-lg p-10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Featured verified domains</h2>
          <p className="text-sm text-slate-600">Creators who verified ownership and published AI rules you can route against right now.</p>
        </div>
        {domains.length === 0 ? (
          <p className="text-slate-600">No domains have been verified yet. Be the first to join FairCrawl.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain: any) => (
              <div key={domain.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{domain.name}</h3>
                    <p className="text-sm text-slate-500">by {domain.publisher}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">Verified</span>
                </div>
                <ul className="mt-1 text-sm text-slate-700 space-y-1">
                  {domain.policies.map((policy: any, idx: number) => (
                    <li key={idx}>
                      <span className="font-semibold">{policy.pathPattern}</span> · {policy.allowAI ? 'Allows' : 'Blocks'} AI · {policy.pricePer1k}¢ / 1k req
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

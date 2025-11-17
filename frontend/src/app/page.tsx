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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo text-faircrawl-textMain shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.12),transparent_30%)]" />
        <div className="relative p-10 md:p-14 space-y-10">
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Let AI in without losing control</h1>
            <p className="text-lg leading-relaxed text-faircrawl-textMuted space-y-1">
              <span className="block">FairCrawl sits between AI crawlers and your site.</span>
              <span className="block">AI clients ask us for pages, you set the rules, and we enforce them on every request.</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="px-6 py-3 rounded-full bg-faircrawl-accent text-white font-semibold shadow-md hover:bg-faircrawl-accentSoft transition"
            >
              Get early access
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-white/20 text-faircrawl-textMain hover:bg-white/10 transition"
            >
              See how FairCrawl works
            </a>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {["Crawler reaches a block", "AI client asks", "Publisher decides", "FairCrawl mediates"].map((label) => (
              <div key={label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-left">
                <p className="font-semibold text-faircrawl-textMain">{label}</p>
                <p className="text-faircrawl-textMuted mt-1">
                  {label === 'Crawler reaches a block'
                    ? 'Bot is told to request access instead of scraping in the dark.'
                    : label === 'AI client asks'
                      ? 'AI team hits FairCrawl first so we know who is requesting and why.'
                      : label === 'Publisher decides'
                        ? 'You set path rules and pace so AI traffic follows your terms.'
                        : 'We apply your rules on every request and log what was accessed.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white rounded-2xl shadow-sm p-10 space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-faircrawl-accent">Story</p>
          <h2 className="text-3xl font-bold text-slate-900">How FairCrawl works</h2>
          <p className="text-sm text-slate-500">A simple handshake between crawlers, the AI requester, and the publisher.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Crawler hits a wall</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              An AI product tries to crawl your site. Instead of guessing your rules or scraping around blocks, it is told to go through FairCrawl.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Request goes through FairCrawl</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              The AI team signs up, gets an API key, and sends each URL to FairCrawl first. We know who they are and what they want to do with your content.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">You set the rules</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              You verify your domain, set simple rules per path, and choose how fast AIs can read. We apply those rules to every request and keep a clear log of what was accessed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-10 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-faircrawl-accent">Roles</p>
          <h2 className="text-3xl font-bold text-slate-900">Who it&apos;s for</h2>
          <p className="text-sm text-slate-500">Two sides of the same handshake.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">For publishers</h3>
            <p className="text-sm text-slate-700 leading-relaxed">Blogs, docs, knowledge bases, research archives. You want AI traffic, but on your terms.</p>
            <a href="/signup?role=publisher" className="inline-flex items-center text-sm font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft">
              Start as a publisher
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">For AI platforms &amp; agents</h3>
            <p className="text-sm text-slate-700 leading-relaxed">LLM providers, agent frameworks, AI search tools. You want a clean way to respect publisher rules.</p>
            <a href="/signup?role=aiclient" className="inline-flex items-center text-sm font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft">
              Start as an AI client
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-10 space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-faircrawl-accent">Proof</p>
          <h2 className="text-3xl font-bold text-slate-900">What a verified domain looks like</h2>
          <p className="text-sm text-slate-500">Publishers prove ownership, declare rules, and FairCrawl enforces them on every AI request.</p>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-700 max-w-4xl mx-auto leading-relaxed">
          <li>Each path pattern sets allow/block decisions so AI teams know exactly what is permitted.</li>
          <li>Speed limits and prices stay visible per 1k requests, and the gateway keeps the ledger of usage.</li>
          <li>When a crawler calls FairCrawl, your rules are applied before anything touches your origin.</li>
        </ul>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">Featured verified domains</h2>
          <p className="text-sm text-slate-500">Creators who verified ownership and published AI rules you can route against right now.</p>
        </div>
        {domains.length === 0 ? (
          <p className="text-slate-600">No domains have been verified yet. Be the first to join FairCrawl.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain: any) => (
              <div key={domain.name} className="border border-slate-200 bg-slate-50 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{domain.name}</h3>
                    <p className="text-sm text-slate-500">by {domain.publisher}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
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

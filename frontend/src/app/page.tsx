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
      <section className="bg-white rounded-xl shadow-sm p-10 space-y-8">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900">Give AI a proper front door to your content</h1>
          <p className="text-lg text-slate-700 leading-relaxed space-y-2">
            <span className="block">Today, crawlers hit your site in the dark. Some get blocked, some quietly scrape, nobody sees the full picture.</span>
            <span className="block">FairCrawl turns that chaos into a simple story: AI asks for access, you set the rules, we enforce them on every request.</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Get early access
          </a>
          <a href="#how-it-works" className="px-6 py-3 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50">
            See how it works
          </a>
        </div>
        <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-900">When the crawler hits a wall</p>
            <p className="text-slate-600 mt-1">The bot is told to ask instead of scrape.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-900">When the requester asks</p>
            <p className="text-slate-600 mt-1">AI teams register, grab an API key, and point traffic at FairCrawl.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-900">When the publisher decides</p>
            <p className="text-slate-600 mt-1">You verify your domain and set path-by-path rules.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="font-semibold text-slate-900">When FairCrawl mediates</p>
            <p className="text-slate-600 mt-1">Every request is checked, enforced, and logged so both sides stay in sync.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white rounded-xl shadow-sm p-10 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">How FairCrawl works</h2>
          <p className="text-sm text-slate-500">A narrative walkthrough of the handshake between crawlers, AI teams, and publishers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
            <p className="text-xs font-semibold text-blue-700">Step 1</p>
            <h3 className="text-lg font-semibold text-slate-900">When the crawler hits a wall</h3>
            <p className="text-sm text-slate-700">
              An AI product tries to crawl your site. Instead of guessing your rules, it&apos;s told to ask through FairCrawl.
            </p>
            <p className="text-xs text-slate-500">We replace scraping guesses with a formal request.</p>
          </div>
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
            <p className="text-xs font-semibold text-blue-700">Step 2</p>
            <h3 className="text-lg font-semibold text-slate-900">When the requester asks nicely</h3>
            <p className="text-sm text-slate-700">
              The AI team signs up, gets an API key, and points their crawlers at FairCrawl instead of scrapers.
            </p>
            <p className="text-xs text-slate-500">FairCrawl becomes the gateway, not your firewall.</p>
          </div>
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
            <p className="text-xs font-semibold text-blue-700">Step 3</p>
            <h3 className="text-lg font-semibold text-slate-900">When the publisher decides</h3>
            <p className="text-sm text-slate-700">
              You verify your domain, set path rules, and FairCrawl mediates every request according to those rules.
            </p>
            <p className="text-xs text-slate-500">Every fetch is enforced and logged so both sides see the same record.</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-10 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Who it&apos;s for</h2>
          <p className="text-sm text-slate-500">Clear entry points for both sides of the handshake.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">For publishers</h3>
            <p className="text-sm text-slate-700">Blogs, docs, knowledge bases, research archives.</p>
            <p className="text-sm text-slate-600">Add your domain, prove you own it, and set per-path rules so AI traffic is predictable and paid.</p>
            <a href="/signup?role=publisher" className="text-blue-700 text-sm font-semibold hover:underline">
              Start as a publisher
            </a>
          </div>
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">For AI platforms</h3>
            <p className="text-sm text-slate-700">LLM apps, search copilots, retrieval pipelines, and agents.</p>
            <p className="text-sm text-slate-600">Register, grab an API key, and route crawlers through FairCrawl so you can honor publisher rules without guesswork.</p>
            <a href="/signup?role=aiclient" className="text-blue-700 text-sm font-semibold hover:underline">
              Start as an AI client
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-10 space-y-4">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">What a verified domain looks like</h2>
          <p className="text-sm text-slate-500">Publishers prove ownership, declare rules, and we use those rules to mediate every AI request.</p>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-700 max-w-4xl mx-auto">
          <li>Each path pattern has allow/block decisions so AI teams know exactly what is permitted.</li>
          <li>Prices are visible per 1k requests, and the gateway keeps the ledger of usage.</li>
          <li>When a crawler calls FairCrawl, the rules here are enforced before anything touches your origin.</li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">Featured verified domains</h2>
          <p className="text-sm text-slate-500">Creators who verified ownership and published AI rules you can route against right now.</p>
        </div>
        {domains.length === 0 ? (
          <p className="text-slate-600">No domains have been verified yet. Be the first to join Fair Crawl.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain: any) => (
              <div key={domain.name} className="border border-slate-200 bg-slate-50 rounded-xl p-5 space-y-2">
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

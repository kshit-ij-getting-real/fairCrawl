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
      <section className="bg-white rounded-xl shadow-sm p-10 text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">Fair Crawl</h1>
          <p className="text-lg text-slate-600">
            A content marketplace where your AI can find good information to curate the best answers.
          </p>
          <p className="text-sm text-slate-500">Clean, simple access for creators and AI builders.</p>
        </div>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="flex flex-col items-center max-w-xs text-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <a
              href="/signup?role=publisher"
              className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              I&apos;m a Publisher
            </a>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                For creators and writers who want to list their content for AI agents.
              </p>
              <p className="text-sm text-slate-500">💭 Helper: Creators use this to add their domain and set simple rules for how AIs can read their work.</p>
            </div>
          </div>
          <div className="flex flex-col items-center max-w-xs text-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <a
              href="/signup?role=aiclient"
              className="w-full px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              I build AI
            </a>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">
                For teams who run AI agents or LLMs and want clean, paid access to good content.
              </p>
              <p className="text-sm text-slate-500">💭 Helper: AI builders use this to get an API key and call the Fair Crawl gateway instead of scraping sites blindly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-10 space-y-4">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">How Fair Crawl works</h2>
          <p className="text-sm text-slate-500">💭 Helper: A quick map for how creators and AI builders meet here.</p>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-700 max-w-3xl mx-auto">
          <li>Creators add their site and set rules for AI access.</li>
          <li>AI builders get an API key for their agents.</li>
          <li>Agents call the Fair Crawl gateway to fetch pages. We log usage so creators can be paid.</li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-10 space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">Featured verified domains</h2>
          <p className="text-sm text-slate-500">💭 Helper: These creators proved they own their site and set clear rules for AI agents.</p>
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

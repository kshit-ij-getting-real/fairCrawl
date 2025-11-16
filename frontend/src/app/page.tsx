import { API_BASE } from '../lib/config';

async function fetchMarketplace() {
  try {
    const res = await fetch(`${API_BASE}/api/public/domains`, { next: { revalidate: 60 } });
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
      <section className="text-center space-y-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">Fair Crawl</h1>
        <p className="text-lg text-slate-600">A fair marketplace for AI crawlers and high-quality content.</p>
        <div className="flex justify-center gap-4">
          <a href="/signup?role=publisher" className="px-6 py-3 rounded bg-indigo-600 text-white font-semibold">
            I&apos;m a Publisher
          </a>
          <a href="/signup?role=aiclient" className="px-6 py-3 rounded border border-indigo-600 text-indigo-600 font-semibold">
            I build AI
          </a>
        </div>
      </section>
      <section className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-4">Featured verified domains</h2>
        {domains.length === 0 ? (
          <p className="text-slate-500">No domains have been verified yet. Be the first to join Fair Crawl!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {domains.map((domain: any) => (
              <div key={domain.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{domain.name}</h3>
                    <p className="text-sm text-slate-500">by {domain.publisher}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                </div>
                <ul className="mt-3 text-sm text-slate-600 space-y-1">
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

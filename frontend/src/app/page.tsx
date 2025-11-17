import { API_BASE } from '../lib/config';

async function fetchMarketplace() {
  const API_BASE_URL = API_BASE ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/domains`, { cache: 'no-store' });
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
        <div className="max-w-2xl mx-auto text-left space-y-3 text-slate-700">
          <p>Fair Crawl is a fair marketplace for AI crawlers and high-quality content.</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Publishers list their websites and set simple crawl and payment rules.</li>
            <li>AI builders fetch URLs through the Fair Crawl gateway and pay per request.</li>
            <li>We keep a usage log so both sides can see who crawled what and when.</li>
          </ul>
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center max-w-xs text-center gap-2">
            <a href="/signup?role=publisher" className="px-6 py-3 rounded bg-indigo-600 text-white font-semibold">
              I&apos;m a Publisher
            </a>
            <p className="text-sm text-slate-600">
              List your domain, verify it once, and set simple rules for how AI crawlers can access your content.
            </p>
          </div>
          <div className="flex flex-col items-center max-w-xs text-center gap-2">
            <a
              href="/signup?role=aiclient"
              className="px-6 py-3 rounded border border-indigo-600 text-indigo-600 font-semibold"
            >
              I build AI
            </a>
            <p className="text-sm text-slate-600">
              Get an API key and call the Fair Crawl gateway to fetch URLs that respect publisher policies.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl shadow p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">How it works</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">For publishers</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Add your domain.</li>
              <li>Drop a verification file once.</li>
              <li>Get paid when AIs crawl through the gateway.</li>
            </ol>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">For AI builders</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Generate an API key.</li>
              <li>Call the /api/gateway/fetch endpoint with your key.</li>
              <li>Receive the content, with policies and payments handled by Fair Crawl.</li>
            </ol>
          </div>
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';

interface Domain {
  id: number;
  name: string;
  verified: boolean;
  policies: any[];
}

export default function PublisherDashboard() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainName, setDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<Record<number, any>>({});
  const [policyForm, setPolicyForm] = useState({ pathPattern: '/*', allowAI: true, pricePer1k: 0, maxRps: '' });
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (getRole() !== 'PUBLISHER') {
      router.replace('/login');
      return;
    }
    loadDomains();
  }, [router]);

  const loadDomains = async () => {
    try {
      const result = await apiFetch('/api/publisher/domains');
      setDomains(result);
      if (result.length > 0) {
        setSelectedDomain(result[0].id);
        loadAnalytics(result[0].id);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('token')) {
        clearSession();
        router.replace('/login');
      }
    }
  };

  const loadAnalytics = async (domainId: number) => {
    try {
      const stats = await apiFetch(`/api/publisher/domains/${domainId}/analytics`);
      setAnalytics((prev) => ({ ...prev, [domainId]: stats }));
    } catch (err) {
      console.error(err);
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/publisher/domains', { method: 'POST', body: JSON.stringify({ name: domainName }) });
    setDomainName('');
    loadDomains();
  };

  const addPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDomain) return;
    const payload = {
      ...policyForm,
      pricePer1k: Number(policyForm.pricePer1k),
      maxRps: policyForm.maxRps ? Number(policyForm.maxRps) : null,
    };
    await apiFetch(`/api/publisher/domains/${selectedDomain}/policies`, { method: 'POST', body: JSON.stringify(payload) });
    setPolicyForm({ pathPattern: '/premium/*', allowAI: true, pricePer1k: 0, maxRps: '' });
    loadDomains();
  };

  const fetchToken = async () => {
    if (!selectedDomain) return;
    const data = await apiFetch(`/api/publisher/domains/${selectedDomain}/verification-token`);
    setVerificationToken(data.token);
  };

  const verifyDomain = async () => {
    if (!selectedDomain) return;
    try {
      await apiFetch(`/api/publisher/domains/${selectedDomain}/verify`, { method: 'POST' });
      setMessage('Domain verified!');
      loadDomains();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-10">
      <section className="bg-white rounded-xl shadow-sm p-6 flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Your creator dashboard</h1>
          <p className="text-sm text-slate-500">
            💭 Helper: Use this page to add your site, prove it&apos;s yours, and set rules for how AI agents can read your content.
          </p>
        </div>
        <button
          onClick={() => {
            clearSession();
            router.replace('/');
          }}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Log out
        </button>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Your sites</h2>
          <p className="text-sm text-slate-500">
            💭 Helper: Each row here is one site where you publish content. Add your Substack, blog, or docs site so AI agents can
            reach it through Fair Crawl.
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="py-2">Domain</th>
              <th>Verified</th>
              <th>Total requests</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr
                key={domain.id}
                className={`cursor-pointer ${selectedDomain === domain.id ? 'bg-indigo-50' : ''}`}
                onClick={() => {
                  setSelectedDomain(domain.id);
                  loadAnalytics(domain.id);
                }}
              >
                <td className="py-2 font-medium">{domain.name}</td>
                <td>{domain.verified ? 'Yes' : 'No'}</td>
                <td>{analytics[domain.id]?.totalRequests ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={addDomain} className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="example.com"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" type="submit">
            Add domain
          </button>
        </form>
      </section>

      {selectedDomain && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">AI access rules</h3>
              <p className="text-sm text-slate-500">
                💭 Helper: These rules say which pages AI agents can read, how fast they can read them, and whether that path is
                free or paid.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {domains
                .find((d) => d.id === selectedDomain)
                ?.policies.map((policy) => (
                  <li key={policy.id} className="border rounded px-3 py-2">
                    <div className="font-semibold">{policy.pathPattern}</div>
                    <div>{policy.allowAI ? 'Allows AI' : 'Blocks AI'} · {policy.pricePer1k}¢ / 1k · {policy.maxRps ? `${policy.maxRps} rps max` : 'No cap'}</div>
                  </li>
                ))}
            </ul>
            <form onSubmit={addPolicy} className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="/premium/*"
                value={policyForm.pathPattern}
                onChange={(e) => setPolicyForm({ ...policyForm, pathPattern: e.target.value })}
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={policyForm.allowAI}
                    onChange={(e) => setPolicyForm({ ...policyForm, allowAI: e.target.checked })}
                  />
                  Allow AI access
                </label>
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Price per 1k"
                  value={policyForm.pricePer1k}
                  onChange={(e) => setPolicyForm({ ...policyForm, pricePer1k: Number(e.target.value) })}
                />
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Max RPS"
                  value={policyForm.maxRps}
                  onChange={(e) => setPolicyForm({ ...policyForm, maxRps: e.target.value })}
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" type="submit">
                Save policy
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Verify that you own this site</h3>
              <p className="text-sm text-slate-500">
                💭 Helper: We ask you to put a small text file on your site once. When we can read that file, we know this site
                really belongs to you.
              </p>
            </div>
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold">Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click “Fetch verification token”.</li>
                <li>Create a file at: <span className="font-mono">/.well-known/faircrawl-verification.txt</span></li>
                <li>Put only the token in that file.</li>
                <li>Click “Verify domain”.</li>
              </ol>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchToken} className="text-blue-600 text-sm underline">
                Fetch verification token
              </button>
              {verificationToken && <p className="font-mono bg-slate-100 p-2 rounded break-all">{verificationToken}</p>}
            </div>
            <button onClick={verifyDomain} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Verify domain
            </button>
            {message && <p className="text-sm text-slate-600">{message}</p>}
            <div>
              <h4 className="font-semibold">Analytics</h4>
              <p className="text-sm">Total requests: {analytics[selectedDomain]?.totalRequests ?? 0}</p>
              <p className="text-sm">Estimated revenue: ${analytics[selectedDomain]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="font-semibold">Top AI clients</div>
                {analytics[selectedDomain]?.topClients?.length ? (
                  analytics[selectedDomain].topClients.map((client: any) => (
                    <div key={client.aiClientId} className="flex justify-between">
                      <span>{client.name}</span>
                      <span>{client.requests} req</span>
                    </div>
                  ))
                ) : (
                  <p>No data yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

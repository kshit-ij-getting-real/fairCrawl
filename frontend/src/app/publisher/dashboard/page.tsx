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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Publisher dashboard</h1>
        <button
          onClick={() => {
            clearSession();
            router.replace('/');
          }}
          className="text-sm text-slate-500"
        >
          Log out
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 text-sm text-slate-700">
        <p className="font-semibold">This is your Publisher dashboard.</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Add a domain you control (for example: https://angelsintheabstract.substack.com).</li>
          <li>Verify that you control it by serving a small text file at a special path.</li>
          <li>Set crawl policies that control which AI clients can access which URLs, and at what rate.</li>
        </ol>
      </div>

      <section className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Your domains</h2>
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="submit">
            Add domain
          </button>
        </form>
      </section>

      {selectedDomain && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>
            <p className="text-sm text-slate-600">
              Policies define which URLs an AI client may fetch and at what rate.
              <br />
              • Path pattern: which URLs the rule applies to (for example: /* for everything).
              <br />
              • Max RPS: maximum requests per second allowed from the gateway.
              <br />
              • “Allow AI access” toggles whether this rule is open to any AI client that pays via Fair Crawl.
            </p>
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
              <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">
                Save policy
              </button>
            </form>
          </div>
          <div className="bg-white rounded shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold">Verification</h3>
            <div className="text-sm text-slate-700 space-y-1">
              <p className="font-semibold">How to verify your domain:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click “Fetch verification token” to generate a unique token.</li>
                <li>
                  On your site, serve a plain text file at:
                  <div className="font-mono bg-slate-100 rounded px-2 py-1 mt-1">/.well-known/faircrawl-verification.txt</div>
                  The file should contain exactly this token and nothing else.
                </li>
                <li>Once the file is live, click “Verify domain” here.</li>
                <li>
                  When verification succeeds, the “Verified” column will show “Yes” and AI clients will be allowed to fetch URLs
                  from this domain according to your policies.
                </li>
              </ol>
            </div>
            <button onClick={fetchToken} className="text-indigo-600 text-sm underline">
              Fetch verification token
            </button>
            {verificationToken && <p className="font-mono bg-slate-100 p-2 rounded break-all">{verificationToken}</p>}
            <button onClick={verifyDomain} className="px-4 py-2 bg-green-600 text-white rounded">
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

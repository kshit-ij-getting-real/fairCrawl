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
      const defaultMsg =
        "We couldn’t read '/.well-known/faircrawl-verification.txt' on this domain. Check that the file exists and contains the token shown above.";
      const msg = err?.message ?? defaultMsg;
      if (msg.toLowerCase().includes('not found') || msg.includes('404')) {
        setMessage(defaultMsg);
      } else {
        setMessage(msg);
      }
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-faircrawl-textMuted">Publisher control</p>
            <h1 className="text-3xl font-semibold text-white">Your FairCrawl dashboard</h1>
            <p className="text-sm text-faircrawl-textMuted">
              Keep your domains verified, rules updated, and AI traffic predictable.
            </p>
          </div>
          <button
            onClick={() => {
              clearSession();
              router.replace('/');
            }}
            className="text-sm px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            Log out
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-faircrawl-textMain space-y-2">
          <h2 className="text-base font-semibold text-white">How this dashboard works</h2>
          <p className="leading-relaxed text-faircrawl-textMuted">
            You register your sites here, prove you own them once, and then set AI access rules per path. FairCrawl enforces
            these rules on every request from AI clients.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-lg p-6 space-y-6 text-slate-900">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Your sites</h2>
          <p className="text-sm text-slate-600">Track the domains you control and jump into their AI rules.</p>
        </div>
        {domains.length === 0 ? (
          <p className="text-sm text-slate-600">No sites yet. Add a domain you control to start setting AI rules.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Domain</th>
                <th>Verified</th>
                <th>Total requests</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.map((domain) => (
                <tr key={domain.id} className={selectedDomain === domain.id ? 'bg-slate-50' : ''}>
                  <td className="py-3 font-medium">{domain.name}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        domain.verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {domain.verified ? 'Verified' : 'Not verified'}
                    </span>
                  </td>
                  <td className="py-3">{analytics[domain.id]?.totalRequests ?? '—'}</td>
                  <td className="py-3 text-right">
                    <button
                      className="text-faircrawl-accent hover:text-faircrawl-accentSoft font-semibold"
                      onClick={() => {
                        setSelectedDomain(domain.id);
                        loadAnalytics(domain.id);
                        document.getElementById('ai-rules')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Manage AI rules
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form onSubmit={addDomain} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-semibold text-slate-800">Add a domain</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2"
              placeholder="example.com"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-faircrawl-accent text-white rounded-full hover:bg-faircrawl-accentSoft transition self-start"
            type="submit"
          >
            Add domain
          </button>
        </form>
      </section>

      {selectedDomain && (
        <section className="grid md:grid-cols-2 gap-6" id="ai-rules">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4 text-slate-900">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">AI access rules</h3>
              <p className="text-sm text-slate-600">
                These settings control which pages AI agents can read and how fast they can read them.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {domains
                .find((d) => d.id === selectedDomain)
                ?.policies.map((policy) => (
                  <li key={policy.id} className="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                    <div className="font-semibold">{policy.pathPattern}</div>
                    <div className="text-slate-600">
                      {policy.allowAI ? 'Allows AI' : 'Blocks AI'} · {policy.pricePer1k}¢ / 1k · {policy.maxRps ? `${policy.maxRps} rps max` : 'No cap'}
                    </div>
                  </li>
                ))}
            </ul>
            <form onSubmit={addPolicy} className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">Path</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                  placeholder="/, /blog/*, /docs/*"
                  value={policyForm.pathPattern}
                  onChange={(e) => setPolicyForm({ ...policyForm, pathPattern: e.target.value })}
                />
                <p className="text-xs text-slate-500">Which pages this rule applies to. * matches anything.</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800" title="On = AI agents can read this path. Off = all AI requests to this path are blocked.">
                  <input
                    type="checkbox"
                    checked={policyForm.allowAI}
                    onChange={(e) => setPolicyForm({ ...policyForm, allowAI: e.target.checked })}
                  />
                  Allow AI access
                </label>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-800">Price per 1k requests</label>
                  <input
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Price in cents"
                    value={policyForm.pricePer1k}
                    onChange={(e) => setPolicyForm({ ...policyForm, pricePer1k: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">Max requests per second</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. 1"
                  value={policyForm.maxRps}
                  onChange={(e) => setPolicyForm({ ...policyForm, maxRps: e.target.value })}
                />
                <p className="text-xs text-slate-500">Speed limit for bots. 1 = one page per second, 5 = five pages per second, 0 = no limit.</p>
              </div>
              <button className="bg-faircrawl-accent text-white px-4 py-2 rounded-full hover:bg-faircrawl-accentSoft transition" type="submit">
                Save rule
              </button>
            </form>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">Example</p>
              <p>
                Rule 1: Path = /, Allow AI access = Yes, Max requests per second = 1 → AI can read public pages, one page per
                second.
              </p>
              <p>
                Rule 2: Path = /paywalled/*, Allow AI access = No → AI cannot read any paywalled pages.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4 text-slate-900">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Verify that you own this site</h3>
              <p className="text-sm text-slate-600">
                To prove you own this domain, put a one-line file on it once. When we can read that file, we mark the domain as verified.
              </p>
            </div>
            <div className="text-sm text-slate-700 space-y-2">
              <p className="font-semibold">Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click 'Fetch verification token'.</li>
                <li>On your site, create a file at '/.well-known/faircrawl-verification.txt'.</li>
                <li>Put only this token in that file.</li>
                <li>Click 'Verify domain'.</li>
              </ol>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button onClick={fetchToken} className="text-faircrawl-accent text-sm font-semibold hover:text-faircrawl-accentSoft">
                  Fetch verification token
                </button>
                {verificationToken && <p className="font-mono bg-slate-100 p-2 rounded break-all">{verificationToken}</p>}
              </div>
              <button onClick={verifyDomain} className="px-4 py-2 bg-faircrawl-accent text-white rounded-full hover:bg-faircrawl-accentSoft transition self-start">
                Verify domain
              </button>
              {message && <p className="text-sm text-slate-600">{message}</p>}
            </div>
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

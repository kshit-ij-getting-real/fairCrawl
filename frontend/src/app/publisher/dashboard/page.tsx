'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getRole } from '../../../lib/api';
import { MarketingCard } from '../../../components/ui/MarketingCard';
import { SectionActions } from '../../../components/ui/SectionActions';

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
  const inputClasses =
    'w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white shadow-sm outline-none ring-0 placeholder:text-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40';

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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 lg:px-8">
      <section className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
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
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <MarketingCard className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-white">Your sites</h2>
            <p className="text-sm text-white/70">Track the domains you control and jump into their AI rules.</p>
          </div>
          <form onSubmit={addDomain} className="space-y-2">
            <label className="block text-sm font-medium text-white/80" htmlFor="domain-input">
              Add a domain
            </label>
            <div className="mt-2 flex gap-3">
              <input
                id="domain-input"
                className={`${inputClasses} flex-1`}
                placeholder="example.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
              <button
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                type="submit"
              >
                Add domain
              </button>
            </div>
          </form>
          {domains.length === 0 ? (
            <p className="text-sm text-white/70">No sites yet. Add a domain you control to start setting AI rules.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left text-sm text-white">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                  <tr>
                    <th className="py-2 px-3">Domain</th>
                    <th className="px-3">Verified</th>
                    <th className="px-3">Total requests</th>
                    <th className="px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {domains.map((domain) => (
                    <tr key={domain.id} className={selectedDomain === domain.id ? 'bg-white/5' : ''}>
                      <td className="py-3 px-3 font-medium">{domain.name}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            domain.verified
                              ? 'bg-green-500/20 text-green-100'
                              : 'bg-amber-500/20 text-amber-100'
                          }`}
                        >
                          {domain.verified ? 'Verified' : 'Not verified'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/80">{analytics[domain.id]?.totalRequests ?? '—'}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          className="font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft"
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
            </div>
          )}
        </MarketingCard>
      </section>

      {selectedDomain && (
        <section className="grid gap-8 lg:grid-cols-2" id="ai-rules">
          <MarketingCard className="space-y-5 text-white">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">AI access rules</h3>
              <p className="text-sm text-white/70">These settings control which pages AI crawlers can read and how fast they can read them.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-white/50">Current rules</p>
              <ul className="space-y-2 text-sm">
                {domains
                  .find((d) => d.id === selectedDomain)
                  ?.policies.map((policy) => (
                    <li key={policy.id} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-white/80">
                      <div className="font-semibold text-white">{policy.pathPattern}</div>
                      <div className="text-white/70">
                        {policy.allowAI ? 'Allows AI' : 'Blocks AI'} · {policy.pricePer1k}¢ / 1k · {policy.maxRps ? `${policy.maxRps} rps max` : 'No cap'}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <form onSubmit={addPolicy} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Path</p>
                <label className="text-sm font-semibold text-white" title="Pick the paths this rule covers. * matches anything in the path.">
                  Path pattern
                </label>
                <input
                  className={inputClasses}
                  placeholder="/, /blog/*, /docs/*"
                  value={policyForm.pathPattern}
                  onChange={(e) => setPolicyForm({ ...policyForm, pathPattern: e.target.value })}
                />
                <p className="text-xs text-white/60">Which pages this rule applies to.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Access</p>
                <label
                  className="flex items-center gap-2 text-sm font-semibold text-white"
                  title="On = AI crawlers can read this path. Off = all AI requests to this path are blocked."
                >
                  <input
                    type="checkbox"
                    checked={policyForm.allowAI}
                    onChange={(e) => setPolicyForm({ ...policyForm, allowAI: e.target.checked })}
                    className="h-4 w-4 rounded border-white/40 bg-transparent"
                  />
                  Allow AI access
                </label>
                <p className="text-xs text-white/60">Toggle access for this path.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Rate</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white" title="Charge AI crawlers per 1k requests if you want metered access.">
                      Price per 1k requests
                    </label>
                    <input
                      className={inputClasses}
                      placeholder="Price in cents"
                      value={policyForm.pricePer1k}
                      onChange={(e) => setPolicyForm({ ...policyForm, pricePer1k: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white" title="Speed limit for crawlers hitting this path.">
                      Max requests per second
                    </label>
                    <input
                      className={inputClasses}
                      placeholder="e.g. 1"
                      value={policyForm.maxRps}
                      onChange={(e) => setPolicyForm({ ...policyForm, maxRps: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-white/60">Set gentle speed limits and pricing for AI crawlers.</p>
              </div>
              <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs leading-relaxed text-white/70">
                <p className="text-xs font-medium uppercase text-white/50">Examples</p>
                <p className="text-white">Rule 1: Path = /, Allow AI access = Yes, Max requests per second = 1 → AI crawlers can read public pages slowly.</p>
                <p className="text-white">Rule 2: Path = /paywalled/*, Allow AI access = No → AI crawlers cannot read any paywalled pages.</p>
              </div>
              <SectionActions>
                <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80" type="submit">
                  Save rule
                </button>
              </SectionActions>
            </form>
          </MarketingCard>

          <MarketingCard className="space-y-5 text-white">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Verify that you own this site</h3>
              <p className="text-sm text-white/70">
                To prove you own this domain, put a one-line file on it once. When we can read that file, we mark the domain as verified.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">Steps</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                <li>Click 'Fetch verification token'.</li>
                <li>On your site, create a file at '/.well-known/faircrawl-verification.txt'.</li>
                <li>Put only this token in that file.</li>
                <li>Click 'Verify domain'.</li>
              </ol>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">Analytics</p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                <div className="flex justify-between"><span>Total requests</span><span>{analytics[selectedDomain]?.totalRequests ?? 0}</span></div>
                <div className="flex justify-between"><span>Estimated revenue</span><span>${analytics[selectedDomain]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-white/50">Top AI teams</p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                {analytics[selectedDomain]?.topClients?.length ? (
                  analytics[selectedDomain].topClients.map((client: any) => (
                    <div key={client.aiClientId} className="flex justify-between">
                      <span>{client.name}</span>
                      <span>{client.requests} req</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No data yet.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">Verify domain</p>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={fetchToken} className="text-sm font-semibold text-blue-300 hover:text-white">
                    Fetch verification token
                  </button>
                  {verificationToken && <p className="break-all rounded bg-white/10 p-2 font-mono text-white">{verificationToken}</p>}
                </div>
                {message && <p className="text-sm text-white/70">{message}</p>}
                <SectionActions>
                  <button onClick={verifyDomain} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80">
                    Verify domain
                  </button>
                </SectionActions>
              </div>
            </div>
          </MarketingCard>
        </section>
      )}
    </div>
  );
}

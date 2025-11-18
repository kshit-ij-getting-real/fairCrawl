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
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-faircrawl-textMuted">PUBLISHER CONTROL</p>
            <h1 className="text-3xl font-semibold text-white">Creator control panel</h1>
            <p className="text-sm text-faircrawl-textMuted">
              Verify your sites, set AI access rules, and track paid reads in one place.
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
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-left text-sm text-white">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-white/50">
                  <tr>
                    <th className="py-2 px-3">Domain</th>
                    <th className="px-3">Status</th>
                    <th className="px-3">Rules</th>
                    <th className="px-3">Total reads</th>
                    <th className="px-3 text-right">Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {domains.map((domain) => (
                    <tr key={domain.id} className={selectedDomain === domain.id ? 'bg-white/5' : ''}>
                      <td className="py-3 px-3 font-medium">{domain.name}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            domain.verified
                              ? 'border-green-400/50 bg-green-500/10 text-green-50'
                              : 'border-amber-300/50 bg-amber-500/10 text-amber-50'
                          }`}
                        >
                          {domain.verified ? 'Verified' : 'Not verified'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/80">
                        <button
                          className="font-semibold text-faircrawl-accent hover:text-faircrawl-accentSoft"
                          onClick={() => {
                            setSelectedDomain(domain.id);
                            loadAnalytics(domain.id);
                            document.getElementById('ai-rules')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Manage rules
                        </button>
                      </td>
                      <td className="py-3 px-3 text-white/80">{analytics[domain.id]?.totalRequests ?? '—'}</td>
                      <td className="py-3 px-3 text-right text-white/80">
                        ${analytics[domain.id]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          )}
        </MarketingCard>
      </section>

      {selectedDomain && (
        <section className="grid gap-8 lg:grid-cols-2" id="ai-rules">
          <MarketingCard className="space-y-5 text-white">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 1 · Verify domain</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Prove you own this site</h3>
              <p className="text-sm text-white/70">Add the verification file or meta tag to prove you control this domain.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">How to verify</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-white/80">
                <li>Fetch your unique verification token.</li>
                <li>
                  Add a file at <code className="rounded bg-white/10 px-2 py-1">/.well-known/faircrawl-verification.txt</code> with only
                  the token below.
                </li>
                <li>Click “Verify domain” once the file is live.</li>
              </ol>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/80">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={fetchToken} className="text-sm font-semibold text-blue-300 hover:text-white">
                    Fetch verification token
                  </button>
                  {verificationToken && <p className="break-all rounded bg-white/10 p-2 font-mono text-white">{verificationToken}</p>}
                </div>
                {message && <p className="text-sm text-white/70">{message}</p>}
              </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase text-white/50">Analytics</p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>Total reads</span>
                  <span>{analytics[selectedDomain]?.totalRequests ?? 0}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>Estimated revenue</span>
                  <span>${analytics[selectedDomain]?.estimatedRevenue?.toFixed?.(2) ?? '0.00'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-white/50">Top AI teams</p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/80">
                {analytics[selectedDomain]?.topClients?.length ? (
                  analytics[selectedDomain].topClients.map((client: any) => (
                    <div
                      key={client.aiClientId}
                      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-medium text-white">{client.name}</span>
                      <span className="text-white/80">{client.requests} reads</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">No data yet.</p>
                )}
              </div>
            </div>
            <SectionActions className="justify-start sm:justify-end">
              <button onClick={verifyDomain} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80">
                Verify domain
              </button>
            </SectionActions>
          </MarketingCard>

          <MarketingCard className="space-y-5 text-white">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1">STEP 2 · Publish AI access rules</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Set what AIs can read and pay</h3>
              <p className="text-sm text-white/70">
                Choose which paths are open, throttled, or blocked and how much AIs pay per 1,000 reads.
              </p>
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
                <label className="text-sm font-semibold text-white" title="Pick the paths this rule covers. * matches anything in the path.">
                  Path rule
                </label>
                <input
                  className={inputClasses}
                  placeholder="/, /blog/*, /docs/*"
                  value={policyForm.pathPattern}
                  onChange={(e) => setPolicyForm({ ...policyForm, pathPattern: e.target.value })}
                />
                <p className="text-xs text-white/60">Use wildcards like /blog/* or exact paths like /whitepaper.pdf.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Access</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Blocked', value: 'blocked' },
                    { label: 'Free access', value: 'free' },
                    { label: 'Metered (paid)', value: 'metered' },
                  ].map((option) => {
                    const accessState = !policyForm.allowAI
                      ? 'blocked'
                      : policyForm.pricePer1k > 0
                        ? 'metered'
                        : 'free';

                    return (
                      <label
                        key={option.value}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${
                          accessState === option.value ? 'border-blue-400/70 bg-blue-500/10 text-white' : 'border-white/20 text-white/80'
                        }`}
                      >
                        <input
                          type="radio"
                          className="h-4 w-4 accent-blue-500"
                          name="access-level"
                          checked={accessState === option.value}
                          onChange={() => {
                            if (option.value === 'blocked') {
                              setPolicyForm({ ...policyForm, allowAI: false, pricePer1k: policyForm.pricePer1k });
                            }
                            if (option.value === 'free') {
                              setPolicyForm({ ...policyForm, allowAI: true, pricePer1k: 0 });
                            }
                            if (option.value === 'metered') {
                              setPolicyForm({ ...policyForm, allowAI: true, pricePer1k: policyForm.pricePer1k || 1 });
                            }
                          }}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-white/60">Pick whether this path is blocked, free, or paid for AI crawlers.</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white">Rate</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-white" title="Charge AI crawlers per 1,000 reads if you want metered access.">
                      Price per 1,000 reads
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
                      Speed limit (requests per second)
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
              <p className="text-xs text-white/70">
                AI crawlers can read https://{domains.find((d) => d.id === selectedDomain)?.name ?? 'your-domain.com'}
                {policyForm.pathPattern || '/*'} at up to {policyForm.maxRps || '—'} req/sec for ${
                  policyForm.pricePer1k || 0
                } per 1,000 reads.
              </p>
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Examples</p>
                <ul className="space-y-2 text-white/80">
                  <li className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                    <span>/blog/*</span>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold text-blue-100">Metered</span>
                    <span className="text-white/70">$1 / 1,000 reads · 5 req/sec</span>
                  </li>
                  <li className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                    <span>/drafts/*</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">Blocked</span>
                    <span className="text-white/70">—</span>
                  </li>
                  <li className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                    <span>/premium/*</span>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold text-amber-100">Metered</span>
                    <span className="text-white/70">$5 / 1,000 reads · 1 req/sec</span>
                  </li>
                </ul>
              </div>
              <SectionActions className="justify-start sm:justify-end">
                <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500/80" type="submit">
                  Save rule
                </button>
              </SectionActions>
            </form>
          </MarketingCard>
        </section>
      )}
    </div>
  );
}

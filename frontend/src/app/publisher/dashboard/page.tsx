'use client';

import { useEffect, useState } from 'react';
import { apiFetch, getRole } from '@/lib/api';
import { useRouter } from 'next/navigation';

type Domain = { id: number; name: string; verified: boolean; subdomainHost?: string; subdomainCnameTarget?: string };

type Rule = { id: number; scope: string; pathPattern?: string; userAgentRegex?: string; priceMicros: number; licenseType?: string };

type Tx = { id: string; createdAt: string; path: string; totalMicros: number; licenseType: string; aiClient: { name: string }; domain: { name: string } };

export default function PublisherDashboard() {
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainName, setDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [ruleForm, setRuleForm] = useState({ scope: 'DIRECTORY', pathPattern: '/premium/*', userAgentRegex: '', priceMicros: 250000, licenseType: 'DISPLAY' });

  const loadDomains = async () => {
    const res = await apiFetch('/api/publisher/domains');
    setDomains(res);
    if (res[0] && !selectedDomain) setSelectedDomain(res[0].id);
  };

  const loadRules = async (domainId: number) => setRules(await apiFetch(`/api/publisher/domains/${domainId}/pricing-rules`));
  const loadTx = async (domainId?: number) => {
    const q = domainId ? `?domain_id=${domainId}` : '';
    setTransactions(await apiFetch(`/api/publisher/transactions${q}`));
  };

  useEffect(() => {
    if (getRole() !== 'PUBLISHER') router.replace('/login');
    loadDomains();
  }, []);

  useEffect(() => {
    if (!selectedDomain) return;
    loadRules(selectedDomain);
    loadTx(selectedDomain);
  }, [selectedDomain]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8 text-white">
      <h1 className="text-2xl font-semibold">Publisher Dashboard</h1>

      <section className="rounded border border-white/20 p-4">
        <h2 className="mb-2 font-semibold">Domain onboarding + verification</h2>
        <div className="flex gap-2">
          <input className="w-full bg-black/30 p-2" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="example.com" />
          <button className="bg-blue-600 px-3" onClick={async () => { await apiFetch('/api/publisher/domains', { method: 'POST', body: JSON.stringify({ name: domainName }) }); setDomainName(''); loadDomains(); }}>Add</button>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          {domains.map((d) => (
            <div key={d.id} className="flex items-center justify-between border border-white/10 p-2">
              <button onClick={() => setSelectedDomain(d.id)}>{d.name} ({d.verified ? 'verified' : 'pending'})</button>
              <button className="text-blue-300" onClick={async () => setTokenInfo(await apiFetch(`/api/publisher/domains/${d.id}/verification-token`))}>DNS details</button>
            </div>
          ))}
        </div>
        {tokenInfo && <pre className="mt-3 overflow-auto bg-black/50 p-2 text-xs">{JSON.stringify(tokenInfo, null, 2)}</pre>}
        {selectedDomain && <button className="mt-2 bg-emerald-600 px-3 py-1" onClick={async () => { await apiFetch(`/api/publisher/domains/${selectedDomain}/verify-dns`, { method: 'POST' }); loadDomains(); }}>Verify DNS TXT</button>}
      </section>

      <section className="rounded border border-white/20 p-4">
        <h2 className="mb-2 font-semibold">Pricing rules CRUD</h2>
        {selectedDomain && (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2 text-sm">
              <input className="bg-black/30 p-2" value={ruleForm.scope} onChange={(e) => setRuleForm({ ...ruleForm, scope: e.target.value })} />
              <input className="bg-black/30 p-2" value={ruleForm.pathPattern} onChange={(e) => setRuleForm({ ...ruleForm, pathPattern: e.target.value })} />
              <input className="bg-black/30 p-2" value={ruleForm.userAgentRegex} onChange={(e) => setRuleForm({ ...ruleForm, userAgentRegex: e.target.value })} />
              <input className="bg-black/30 p-2" type="number" value={ruleForm.priceMicros} onChange={(e) => setRuleForm({ ...ruleForm, priceMicros: Number(e.target.value) })} />
              <button className="bg-blue-600" onClick={async () => { await apiFetch(`/api/publisher/domains/${selectedDomain}/pricing-rules`, { method: 'POST', body: JSON.stringify(ruleForm) }); loadRules(selectedDomain); }}>Create</button>
            </div>
            <ul className="space-y-1 text-sm">
              {rules.map((r) => <li key={r.id}>{r.scope} · {r.pathPattern || '*'} · {r.priceMicros}µ</li>)}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded border border-white/20 p-4">
        <h2 className="mb-2 font-semibold">Transactions</h2>
        <ul className="space-y-1 text-sm">
          {transactions.map((t) => (
            <li key={t.id}>{new Date(t.createdAt).toLocaleString()} · {t.domain.name}{t.path} · {t.aiClient.name} · {t.licenseType} · {t.totalMicros}µ</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

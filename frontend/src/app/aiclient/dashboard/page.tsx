'use client';

import { useEffect, useState } from 'react';
import { apiFetch, getRole } from '@/lib/api';
import { useRouter } from 'next/navigation';

type ApiKey = { id: number; createdAt: string; revokedAt: string | null };

export default function AIClientDashboard() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const [uaRegex, setUaRegex] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>({ byDomain: [], byDay: [] });

  const load = async () => {
    setApiKeys(await apiFetch('/api/aiclient/apikeys'));
    setAgents(await apiFetch('/api/aiclient/agents'));
    setUsage(await apiFetch('/api/aiclient/usage-spend'));
  };

  useEffect(() => {
    if (getRole() !== 'AICLIENT') router.replace('/login');
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8 text-white">
      <h1 className="text-2xl font-semibold">Developer Dashboard</h1>

      <section className="rounded border border-white/20 p-4">
        <h2 className="font-semibold">API Keys</h2>
        <button className="mt-2 bg-blue-600 px-3 py-1" onClick={async () => { const r = await apiFetch('/api/aiclient/apikeys', { method: 'POST' }); setNewKey(r.key); load(); }}>Create key</button>
        {newKey && <p className="mt-2 text-sm">New key: <span className="font-mono">{newKey}</span></p>}
        <ul className="mt-2 text-sm">{apiKeys.map((k) => <li key={k.id}>#{k.id} {k.revokedAt ? 'revoked' : 'active'}</li>)}</ul>
      </section>

      <section className="rounded border border-white/20 p-4">
        <h2 className="font-semibold">Agent identity</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <input className="bg-black/30 p-2" placeholder="agent_id" value={agentId} onChange={(e) => setAgentId(e.target.value)} />
          <input className="bg-black/30 p-2" placeholder="allowed user-agent regex" value={uaRegex} onChange={(e) => setUaRegex(e.target.value)} />
          <button className="bg-blue-600" onClick={async () => { await apiFetch('/api/aiclient/agents', { method: 'POST', body: JSON.stringify({ agentId, allowedUserAgentRe: uaRegex }) }); setAgentId(''); setUaRegex(''); load(); }}>Save</button>
        </div>
        <ul className="mt-2 text-sm">{agents.map((a) => <li key={a.id}>{a.agentId} → {a.allowedUserAgentRe}</li>)}</ul>
      </section>

      <section className="rounded border border-white/20 p-4">
        <h2 className="font-semibold">Usage + spend</h2>
        <h3 className="mt-2 text-sm font-semibold">By domain</h3>
        <ul className="text-sm">{usage.byDomain?.map((d: any) => <li key={d.domainId}>{d.domain}: {d.requests} req · {d.spendMicros}µ</li>)}</ul>
        <h3 className="mt-2 text-sm font-semibold">By day</h3>
        <ul className="text-sm">{usage.byDay?.map((d: any) => <li key={d.day}>{d.day}: {d.spend_micros}µ</li>)}</ul>
      </section>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState, Input, Table } from '@/components/dashboard/primitives';

export default function AIClientDashboard() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [agentId, setAgentId] = useState('');
  const [uaRegex, setUaRegex] = useState('.*');
  const [usage, setUsage] = useState<any>({ byDomain: [], byDay: [] });

  const load = async () => {
    const [keys, usageResp] = await Promise.all([apiFetch('/api/aiclient/apikeys'), apiFetch('/api/aiclient/usage-spend')]);
    setApiKeys(keys);
    setUsage(usageResp);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-xs text-faircrawl-textMuted">Spend (30d)</p><p className="mt-2 text-2xl font-semibold">${((usage.byDay?.reduce((sum: number, d: any) => sum + (d.spend_micros || 0), 0) || 0) / 1_000_000).toFixed(2)}</p></Card>
        <Card><p className="text-xs text-faircrawl-textMuted">Requests</p><p className="mt-2 text-2xl font-semibold">{usage.byDomain?.reduce((sum: number, d: any) => sum + (d.requests || 0), 0) || 0}</p></Card>
        <Card><p className="text-xs text-faircrawl-textMuted">Active keys</p><p className="mt-2 text-2xl font-semibold">{apiKeys.filter((k) => !k.revokedAt).length}</p></Card>
        <Card><p className="text-xs text-faircrawl-textMuted">Top domain</p><p className="mt-2 text-2xl font-semibold">{usage.byDomain?.[0]?.domain || '—'}</p></Card>
      </div>
      <Card>
        <h2 className="text-lg font-semibold">API keys</h2>
        <Button className="mt-2" onClick={async () => { const key = await apiFetch('/api/aiclient/apikeys', { method: 'POST' }); setNewKey(key.key); load(); }}>Create key</Button>
        {newKey && <p className="mt-2 text-sm">New key: <code>{newKey}</code></p>}
        {apiKeys.length === 0 ? <div className="mt-3"><EmptyState title="No API keys" description="Create a key for token requests." /></div> : <ul className="mt-3 space-y-2">{apiKeys.map((k) => <li key={k.id} className="flex justify-between rounded-lg border border-white/10 p-3">Key #{k.id} <Button variant="ghost" onClick={async () => { await apiFetch(`/api/aiclient/apikeys/${k.id}/revoke`, { method: 'POST' }); load(); }}>Revoke</Button></li>)}</ul>}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Agent identity</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3"><Input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="agent_id" /><Input value={uaRegex} onChange={(e) => setUaRegex(e.target.value)} placeholder="allowed user-agent regex" /><Button onClick={async () => { await apiFetch('/api/aiclient/agents', { method: 'POST', body: JSON.stringify({ agentId, allowedUserAgentRe: uaRegex }) }); }}>Save</Button></div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Usage + spend</h2>
        <h3 className="mt-3 font-medium">By domain</h3>
        <Table className="mt-2"><thead><tr><th>Domain</th><th>Requests</th><th>Spend</th></tr></thead><tbody>{usage.byDomain?.map((d: any) => <tr key={d.domainId} className="border-t border-white/10"><td className="py-2">{d.domain}</td><td>{d.requests}</td><td>{d.spendMicros}</td></tr>)}</tbody></Table>
        <h3 className="mt-5 font-medium">By day</h3>
        <Table className="mt-2"><thead><tr><th>Day</th><th>Spend</th></tr></thead><tbody>{usage.byDay?.map((d: any) => <tr key={d.day} className="border-t border-white/10"><td className="py-2">{d.day}</td><td>{d.spend_micros}</td></tr>)}</tbody></Table>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Integration snippet</h2>
        <pre className="mt-3 overflow-auto rounded bg-black/40 p-3 text-xs">{`// Step A: request token\nPOST /api/tokens { url, license: 'SUMMARY', maxPriceMicros }\n// Step B: fetch content\nGET /api/content?url=... with x-fairfetch-token\n// Receipt includes transaction_id + price`}</pre>
      </Card>
    </div>
  );
}

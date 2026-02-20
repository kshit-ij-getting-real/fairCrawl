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
  const [testForm, setTestForm] = useState<any>({ url: '', license: 'SUMMARY', maxPriceMicros: '' });
  const [testResult, setTestResult] = useState<{ snippet: string; receipt: { txId: string; priceMicros: number; domain: string; path: string; license: string; timestamp: string } } | null>(null);

  const load = async () => {
    const [keys, usageByDomain, usageByDay] = await Promise.all([
      apiFetch('/api/aiclient/apikeys'),
      apiFetch('/api/aiclient/usage/by-domain'),
      apiFetch('/api/aiclient/usage/by-day'),
    ]);
    setApiKeys(keys);
    setUsage({ byDomain: usageByDomain, byDay: usageByDay });
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
        {apiKeys.length === 0 ? <div className="mt-3"><EmptyState title="No API keys" description="Create a key for token requests." /></div> : <ul className="mt-3 space-y-2">{apiKeys.map((k) => <li key={k.id} className="flex justify-between rounded-lg border border-white/10 p-3">{k.maskedKey} <Button variant="ghost" onClick={async () => { await apiFetch(`/api/aiclient/apikeys/${k.id}`, { method: 'DELETE' }); load(); }}>Revoke</Button></li>)}</ul>}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Agent identity</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3"><Input value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="agent_id" /><Input value={uaRegex} onChange={(e) => setUaRegex(e.target.value)} placeholder="allowed user-agent regex" /><Button onClick={async () => { await apiFetch('/api/aiclient/identity', { method: 'POST', body: JSON.stringify({ agentId, allowedUserAgentRegex: uaRegex }) }); }}>Save</Button></div>
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
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <Input placeholder="https://ai-essays.vercel.app/premium/demo" value={testForm.url} onChange={(e) => setTestForm({ ...testForm, url: e.target.value })} />
          <select className="rounded-lg border border-white/10 bg-black/20 px-3 py-2" value={testForm.license} onChange={(e) => setTestForm({ ...testForm, license: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></select>
          <Input placeholder="maxPriceMicros (optional)" value={testForm.maxPriceMicros} onChange={(e) => setTestForm({ ...testForm, maxPriceMicros: e.target.value })} />
          <Button onClick={async () => {
            const tokenResp = await apiFetch('/api/tokens', { method: 'POST', body: JSON.stringify({ url: testForm.url, license: testForm.license, maxPriceMicros: testForm.maxPriceMicros ? Number(testForm.maxPriceMicros) : undefined }) });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/content?url=${encodeURIComponent(testForm.url)}`, { headers: { 'x-fairfetch-token': tokenResp.token } });
            const content = await response.json();
            setTestResult({ snippet: content.excerpt || '', receipt: content.receipt });
            await load();
          }}>Test paid request</Button>
        </div>
        {testResult && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-faircrawl-textMuted">Content snippet</p>
              <pre className="mt-1 overflow-auto rounded bg-black/40 p-3 text-xs">{testResult.snippet || 'No snippet returned.'}</pre>
            </div>
            <div>
              <p className="text-xs text-faircrawl-textMuted">Receipt summary</p>
              <Table className="mt-1">
                <thead>
                  <tr>
                    <th>txId</th>
                    <th>priceMicros</th>
                    <th>domain</th>
                    <th>path</th>
                    <th>license</th>
                    <th>timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="py-2">{testResult.receipt.txId}</td>
                    <td>{testResult.receipt.priceMicros}</td>
                    <td>{testResult.receipt.domain}</td>
                    <td>{testResult.receipt.path}</td>
                    <td>{testResult.receipt.license}</td>
                    <td>{new Date(testResult.receipt.timestamp).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';

const emptyForm = { domainId: '', type: 'AICLIENT', matchValue: '', licenseType: 'SUMMARY', priceMicros: 100000, active: false, priority: 100 };

export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>({ SUMMARY: { enabled: false, basePriceMicros: 0 }, DISPLAY: { enabled: false, basePriceMicros: 0 } });
  const [form, setForm] = useState<any>(emptyForm);
  const [preview, setPreview] = useState<any>(null);

  const load = async () => {
    const [d, r, l] = await Promise.all([apiFetch('/api/publisher/domains'), apiFetch('/api/publisher/pricing-rules'), apiFetch('/api/publisher/license-settings')]);
    setDomains(d);
    setRules(r);
    setLicenses(l);
    if (d[0] && !form.domainId) setForm((f: any) => ({ ...f, domainId: d[0].id }));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">License toggles</h2>
        <p className="text-sm text-faircrawl-textMuted">Training usage is explicitly prohibited. Licenses are inactive until enabled.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(['SUMMARY', 'DISPLAY'] as const).map((license) => (
            <div key={license} className="rounded-lg border border-white/10 p-4">
              <p className="font-medium">{license === 'SUMMARY' ? 'Summarize / Grounding' : 'Full Display'}</p>
              <p className="mt-1 text-xs text-faircrawl-textMuted">{license === 'SUMMARY' ? 'Read + summarize/cite, no full text display.' : 'Display full content once.'}</p>
              <div className="mt-3 flex gap-2">
                <Input type="number" value={licenses[license]?.basePriceMicros || 0} onChange={(e) => setLicenses((s: any) => ({ ...s, [license]: { ...s[license], basePriceMicros: Number(e.target.value) } }))} />
                <Button variant={licenses[license]?.enabled ? 'secondary' : 'primary'} onClick={() => setLicenses((s: any) => ({ ...s, [license]: { ...s[license], enabled: !s[license].enabled } }))}>{licenses[license]?.enabled ? 'Enabled' : 'Disabled'}</Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={async () => { await apiFetch('/api/publisher/license-settings', { method: 'POST', body: JSON.stringify(licenses) }); load(); }}>Save license settings</Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Pricing rules builder</h2>
        <p className="text-sm text-faircrawl-textMuted">Highest priority match wins: AI client → page → keyword → freshness → directory/global.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-6">
          <Select value={form.domainId} onChange={(e) => setForm({ ...form, domainId: Number(e.target.value) })}>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>AICLIENT</option><option>PAGE</option><option>DIRECTORY</option><option>FRESHNESS</option><option>KEYWORD</option><option>GLOBAL</option></Select>
          <Input placeholder="match value" value={form.matchValue} onChange={(e) => setForm({ ...form, matchValue: e.target.value })} />
          <Select value={form.licenseType} onChange={(e) => setForm({ ...form, licenseType: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Input type="number" value={form.priceMicros} onChange={(e) => setForm({ ...form, priceMicros: Number(e.target.value) })} />
          <Button onClick={async () => { await apiFetch('/api/publisher/pricing-rules', { method: 'POST', body: JSON.stringify(form) }); setForm(emptyForm); load(); }}>Create</Button>
        </div>
        {rules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one rate to allow paid access." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Type</th><th>Match</th><th>License</th><th>Price</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{r.type}</td><td>{r.matchValue || '—'}</td><td>{r.licenseType}</td><td>{r.priceMicros}</td><td>{r.priority}</td><td><Badge tone={r.active ? 'success' : 'warning'}>{r.active ? 'Active' : 'Inactive'}</Badge></td><td><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/pricing-rules/${r.id}/activate`, { method: 'POST' }); load(); }}>Activate</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Price preview</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <Input placeholder="https://example.com/path" onBlur={(e) => setPreview((p: any) => ({ ...p, url: e.target.value }))} />
          <Input placeholder="AI client id (optional)" onBlur={(e) => setPreview((p: any) => ({ ...p, aiClientId: e.target.value }))} />
          <Select onChange={(e) => setPreview((p: any) => ({ ...p, licenseType: e.target.value }))}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Button onClick={async () => {
            const result = await apiFetch('/api/publisher/price-preview', { method: 'POST', body: JSON.stringify(preview || {}) });
            setPreview((p: any) => ({ ...(p || {}), result }));
          }}>Resolve</Button>
        </div>
        {preview?.result && <p className="mt-3 text-sm">Resolved rule: {preview.result.ruleId || 'none'} · Price: {preview.result.priceMicros}</p>}
      </Card>
    </div>
  );
}

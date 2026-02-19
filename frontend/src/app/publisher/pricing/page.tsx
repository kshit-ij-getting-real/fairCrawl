'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';

const emptyForm = { domainId: '', pathPrefix: '/', licenseType: 'SUMMARY', priceMicros: 100000, active: true };

export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>({ SUMMARY: { enabled: false, basePriceMicros: 0 }, DISPLAY: { enabled: false, basePriceMicros: 0 } });
  const [form, setForm] = useState<any>(emptyForm);

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
        <p className="text-sm text-faircrawl-textMuted">Default rule uses / and path overrides can use prefixes like /premium/.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <Select value={form.domainId} onChange={(e) => setForm({ ...form, domainId: Number(e.target.value) })}>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
          <Input placeholder="path prefix" value={form.pathPrefix} onChange={(e) => setForm({ ...form, pathPrefix: e.target.value })} />
          <Select value={form.licenseType} onChange={(e) => setForm({ ...form, licenseType: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Input type="number" value={form.priceMicros} onChange={(e) => setForm({ ...form, priceMicros: Number(e.target.value) })} />
          <Button onClick={async () => { await apiFetch(`/api/publisher/domains/${form.domainId}/pricing-rules`, { method: 'POST', body: JSON.stringify(form) }); setForm(emptyForm); load(); }}>Create</Button>
        </div>
        {rules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one rate to allow paid access." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Path</th><th>License</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{r.pathPrefix || '—'}</td><td>{r.licenseType}</td><td>{r.priceMicros}</td><td><Badge tone={r.active ? 'success' : 'warning'}>{r.active ? 'Active' : 'Inactive'}</Badge></td><td><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/pricing-rules/${r.id}`, { method: 'DELETE' }); load(); }}>Delete</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>
    </div>
  );
}

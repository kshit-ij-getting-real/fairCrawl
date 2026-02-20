'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { ApiError } from '@/lib/http';

const emptyForm = { domainId: '', pathPrefix: '/', licenseCode: 'SUMMARY', priceMicros: 100000, isActive: true };

export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>({ SUMMARY: { enabled: false, basePriceMicros: 0 }, DISPLAY: { enabled: false, basePriceMicros: 0 } });
  const [form, setForm] = useState<any>(emptyForm);
  const [createError, setCreateError] = useState('');

  const load = async () => {
    const [d, l] = await Promise.all([apiFetch('/api/publisher/domains'), apiFetch('/api/publisher/license-settings')]);
    setDomains(d);
    setLicenses(l);
    const selectedDomainId = form.domainId || d[0]?.id;
    if (selectedDomainId) {
      const response = await apiFetch(`/api/publisher/domains/${selectedDomainId}/pricing-rules`);
      setRules(response?.pricingRules || []);
      if (!form.domainId) setForm((f: any) => ({ ...f, domainId: selectedDomainId }));
    } else {
      setRules([]);
    }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!form.domainId) return;
    apiFetch(`/api/publisher/domains/${form.domainId}/pricing-rules`)
      .then((response) => setRules(response?.pricingRules || []));
  }, [form.domainId]);

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
          <Select value={form.licenseCode} onChange={(e) => setForm({ ...form, licenseCode: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Input type="number" value={form.priceMicros} onChange={(e) => setForm({ ...form, priceMicros: Number(e.target.value) })} />
          <Button onClick={async () => {
            try {
              setCreateError('');
              await apiFetch(`/api/publisher/domains/${form.domainId}/pricing-rules`, { method: 'POST', body: JSON.stringify(form) });
              setForm({ ...emptyForm, domainId: form.domainId });
              await load();
            } catch (error) {
              if (error instanceof ApiError) {
                setCreateError(error.message || error.code);
                return;
              }
              setCreateError('Failed to create pricing rule.');
            }
          }}>Create</Button>
        </div>
        {createError ? <p className="mt-2 text-sm text-red-300">{createError}</p> : null}
        {rules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one rate to allow paid access." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>Path</th><th>License</th><th>Price</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{rules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{domains.find((d) => d.id === r.domainId)?.name || r.domainId}</td><td>{r.pathPrefix || '—'}</td><td>{r.licenseCode || r.licenseType}</td><td>{r.priceMicros}</td><td><Badge tone={r.isActive || r.active ? 'success' : 'warning'}>{r.isActive || r.active ? 'Active' : 'Inactive'}</Badge></td><td>{new Date(r.createdAt).toLocaleString()}</td><td><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/pricing-rules/${r.id}`, { method: 'DELETE' }); load(); }}>Delete</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>
    </div>
  );
}

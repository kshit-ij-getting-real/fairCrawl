'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { ApiError } from '@/lib/http';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';

const emptyForm = { pathPrefix: '/', licenseCode: 'SUMMARY', priceMicros: 100000, isActive: true };


export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>({ SUMMARY: { enabled: false, basePriceMicros: 0 }, DISPLAY: { enabled: false, basePriceMicros: 0 } });
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [createError, setCreateError] = useState('');
  const [isSavingLicenses, setIsSavingLicenses] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  const loadDomains = async () => {
    const d = await apiFetch('/api/publisher/domains');
    setDomains(d);
    setSelectedDomainId((current) => current || d[0]?.id || null);
  };

  const loadDomainData = async (domainId?: number | null) => {
    const licenseSettings = await apiFetch('/api/publisher/license-settings');
    setLicenses(licenseSettings);

    if (!domainId) {
      setRules([]);
      return;
    }

    const response = await apiFetch('/api/publisher/pricing-rules');
    const allRules = response?.pricingRules || [];
    setRules(allRules.filter((rule: any) => Number(rule.domainId) === Number(domainId)));
  };

  useEffect(() => {
    loadDomains().catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    loadDomainData(selectedDomainId).catch((error) => toast.error(getErrorMessage(error)));
  }, [selectedDomainId]);

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
        <Button
          className="mt-4"
          disabled={isSavingLicenses}
          onClick={async () => {
            setIsSavingLicenses(true);
            try {
              await apiFetch('/api/publisher/license-settings', { method: 'POST', body: JSON.stringify(licenses) });
              toast.success('License settings saved');
            } catch (error) {
              toast.error(getErrorMessage(error));
            } finally {
              setIsSavingLicenses(false);
            }
          }}
        >
          {isSavingLicenses ? 'Saving...' : 'Save license settings'}
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Pricing rules builder</h2>
        <p className="text-sm text-faircrawl-textMuted">Default rule uses / and path overrides can use prefixes like /premium/.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <Select value={selectedDomainId ?? ''} onChange={(e) => setSelectedDomainId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Pick domain</option>
            {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Input placeholder="path prefix" value={form.pathPrefix} onChange={(e) => setForm({ ...form, pathPrefix: e.target.value })} />
          <Select value={form.licenseCode} onChange={(e) => setForm({ ...form, licenseCode: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Input type="number" value={form.priceMicros} onChange={(e) => setForm({ ...form, priceMicros: Number(e.target.value) })} />
          <Button disabled={!selectedDomainId || isCreatingRule} onClick={async () => {
            if (!selectedDomainId) {
              setCreateError('Pick a domain to set pricing rules.');
              return;
            }
            try {
              setIsCreatingRule(true);
              setCreateError('');
              const response = await apiFetch('/api/publisher/pricing-rules', {
                method: 'POST',
                body: JSON.stringify({ ...form, domainId: selectedDomainId }),
              });

              setRules((current) => [response.pricingRule, ...current]);
              setForm({ ...emptyForm });
              toast.success('Pricing rule created');
            } catch (error) {
              if (error instanceof ApiError) {
                setCreateError(error.message || error.code);
                toast.error(getErrorMessage(error));
                return;
              }
              setCreateError('Pricing rules are required to allow paid access.');
              toast.error(getErrorMessage(error));
            } finally {
              setIsCreatingRule(false);
            }
          }}>
            {isCreatingRule ? 'Creating...' : 'Create'}
          </Button>
        </div>
        {!selectedDomainId ? <p className="mt-2 text-xs text-faircrawl-textMuted">Pick a domain to set pricing rules.</p> : null}
        {createError ? <p className="mt-2 text-sm text-red-300">{createError}</p> : null}
        {rules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one pricing rule to allow paid access. New rules appear here after creation." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>Path</th><th>License</th><th>Price</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{rules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{domains.find((d) => d.id === r.domainId)?.name || r.domainId}</td><td>{r.pathPrefix || '/'}</td><td>{r.licenseCode || r.licenseType}</td><td>{r.priceMicros}</td><td><Badge tone={r.isActive || r.active ? 'success' : 'warning'}>{r.isActive || r.active ? 'Active' : 'Inactive'}</Badge></td><td>{new Date(r.createdAt).toLocaleString()}</td><td><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/pricing-rules/${r.id}`, { method: 'DELETE' }); await loadDomainData(selectedDomainId); }}>Delete</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>
    </div>
  );
}

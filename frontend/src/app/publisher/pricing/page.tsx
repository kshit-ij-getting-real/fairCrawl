'use client';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { demoLicenseSettings, demoPricingRules, demoPublisherDomains } from '@/lib/demoData';
import { publisherMockStore } from '@/lib/publisherMockStore';
import { apiFetch } from '@/lib/api';

const emptyForm = { pathPrefix: '/', licenseCode: 'SUMMARY', priceMicros: 100000, isActive: true };

export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>(demoLicenseSettings);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [savedLicenseSnapshot, setSavedLicenseSnapshot] = useState<any | null>(null);

  const toWholeNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly ? Number(digitsOnly) : 0;
  };

  const formatCreatedAt = (value: unknown) => {
    if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
  };

  useEffect(() => {
    const loadData = async () => {
      let loadedDomains = publisherMockStore.getDomains() || demoPublisherDomains;
      try {
        const domainsFromApi = await apiFetch('/api/domains?orgId=1');
        if (Array.isArray(domainsFromApi) && domainsFromApi.length > 0) {
          loadedDomains = domainsFromApi;
        }
      } catch {
        // Keep local fallback behavior for pricing page.
      }

      const loadedRules = publisherMockStore.getPricingRules() || demoPricingRules;
      const loadedLicenses = publisherMockStore.getLicenseSettings() || demoLicenseSettings;

      setDomains(loadedDomains);
      setRules(loadedRules);
      setLicenses(loadedLicenses);
      setSavedLicenseSnapshot(loadedLicenses);
      setSelectedDomainId(loadedDomains[0]?.id || null);
    };

    loadData();
  }, []);

  const visibleRules = selectedDomainId ? rules.filter((rule) => Number(rule.domainId) === Number(selectedDomainId)) : rules;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">License toggles</h2>
        <p className="text-sm text-faircrawl-textMuted">Training usage is explicitly prohibited. Licenses are inactive until enabled.</p>
        <p className="mt-2 text-sm text-faircrawl-textMuted">Database-backed license settings are temporarily disabled, so edits are saved locally.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(['SUMMARY', 'DISPLAY'] as const).map((license) => (
            <div key={license} className="rounded-lg border border-white/10 p-4">
              <p className="font-medium">{license === 'SUMMARY' ? 'Summarize / Grounding' : 'Full Display'}</p>
              <p className="mt-1 text-xs text-faircrawl-textMuted">{license === 'SUMMARY' ? 'Read + summarize/cite, no full text display.' : 'Display full content once.'}</p>
              <div className="mt-3 flex gap-2">
                <Input type="text" inputMode="numeric" pattern="[0-9]*" value={licenses[license]?.basePriceMicros ?? 0} onChange={(e) => setLicenses({ ...licenses, [license]: { ...licenses[license], basePriceMicros: toWholeNumber(e.target.value) } })} />
                <Button variant={licenses[license]?.enabled ? 'secondary' : 'ghost'} onClick={() => setLicenses({ ...licenses, [license]: { ...licenses[license], enabled: !licenses[license]?.enabled } })}>{licenses[license]?.enabled ? 'Enabled' : 'Disabled'}</Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={() => {
          publisherMockStore.setLicenseSettings(licenses);
          setSavedLicenseSnapshot(licenses);
          toast.success('License settings saved');
        }}>Save license settings</Button>
        {savedLicenseSnapshot ? (
          <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
            <p className="text-sm font-medium text-emerald-200">Saved license configuration</p>
            <ul className="mt-2 space-y-1 text-xs text-emerald-100/90">
              {(['SUMMARY', 'DISPLAY'] as const).map((license) => (
                <li key={`saved-${license}`}>
                  {license}: {savedLicenseSnapshot[license]?.enabled ? 'Enabled' : 'Disabled'} • Base price {savedLicenseSnapshot[license]?.basePriceMicros || 0} micros
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
          <Input type="text" inputMode="numeric" pattern="[0-9]*" value={form.priceMicros} onChange={(e) => setForm({ ...form, priceMicros: toWholeNumber(e.target.value) })} />
          <Button disabled={!selectedDomainId} onClick={() => {
            if (!selectedDomainId) {
              setCreateError('Pick a domain to set pricing rules.');
              setCreateSuccess('');
              return;
            }
            const createdRule = { ...form, id: Date.now(), domainId: selectedDomainId, createdAt: new Date().toISOString() };
            const nextRules = [createdRule, ...rules];
            setRules(nextRules);
            publisherMockStore.setPricingRules(nextRules);
            setForm({ ...emptyForm });
            setCreateError('');
            setCreateSuccess('Pricing rule created successfully.');
            toast.success('Pricing rule created');
          }}>Create</Button>
        </div>
        {createError ? <p className="mt-2 text-sm text-red-300">{createError}</p> : null}
        {createSuccess ? <p className="mt-2 text-sm text-emerald-300">{createSuccess}</p> : null}
        {visibleRules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one pricing rule to allow paid access." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>Path</th><th>License</th><th>Price</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{visibleRules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{domains.find((d) => d.id === r.domainId)?.name || r.domainId}</td><td>{r.pathPrefix || '/'}</td><td>{r.licenseCode || r.licenseType}</td><td>{r.priceMicros}</td><td><Badge tone={r.isActive || r.active ? 'success' : 'warning'}>{r.isActive || r.active ? 'Active' : 'Inactive'}</Badge></td><td>{formatCreatedAt(r.createdAt)}</td><td><Button variant="ghost" onClick={() => {
            const nextRules = rules.filter((rule) => rule.id !== r.id);
            setRules(nextRules);
            publisherMockStore.setPricingRules(nextRules);
          }}>Delete</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>
    </div>
  );
}

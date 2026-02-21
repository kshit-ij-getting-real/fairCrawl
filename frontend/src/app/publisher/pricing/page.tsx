'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Badge, Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { ApiError } from '@/lib/http';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { demoLicenseSettings, demoPricingRules, demoPublisherDomains, isDemoMode } from '@/lib/demoData';

const emptyForm = { pathPrefix: '/', licenseCode: 'SUMMARY', priceMicros: 100000, isActive: true };
const LICENSE_DRAFT_STORAGE_KEY = 'fairfetch.publisher.licenseSettings.draft';
const LICENSE_SAVED_STORAGE_KEY = 'fairfetch.publisher.licenseSettings.saved';
const SELECTED_DOMAIN_STORAGE_KEY = 'fairfetch.publisher.pricing.selectedDomainId';

export default function PricingPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any>({ SUMMARY: { enabled: false, basePriceMicros: 0 }, DISPLAY: { enabled: false, basePriceMicros: 0 } });
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [createError, setCreateError] = useState('');
  const [isSavingLicenses, setIsSavingLicenses] = useState(false);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  const [savedLicenseSnapshot, setSavedLicenseSnapshot] = useState<any | null>(null);

  const readStoredJson = (key: string) => {
    if (typeof window === 'undefined') return null;
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const writeStoredJson = (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const toWholeNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly ? Number(digitsOnly) : 0;
  };

  const loadDomains = async () => {
    try {
      const response = await apiFetch('/api/publisher/domains');
      const d = isDemoMode && (!response || response.length === 0) ? demoPublisherDomains : response;
      setDomains(d);
      const storedSelectedDomainId = Number(readStoredJson(SELECTED_DOMAIN_STORAGE_KEY));
      const hasStoredDomain = d.some((domain: any) => Number(domain.id) === storedSelectedDomainId);
      setSelectedDomainId((current) => current || (hasStoredDomain ? storedSelectedDomainId : null) || d[0]?.id || null);
    } catch (error) {
      if (!isDemoMode) throw error;
      setDomains(demoPublisherDomains);
      setSelectedDomainId((current) => current || demoPublisherDomains[0]?.id || null);
    }
  };

  const loadDomainData = async (domainId?: number | null) => {
    let licenseSettings = null;
    try {
      licenseSettings = await apiFetch('/api/publisher/license-settings');
    } catch (error) {
      if (!isDemoMode) throw error;
      licenseSettings = demoLicenseSettings;
    }
    const storedDraft = readStoredJson(LICENSE_DRAFT_STORAGE_KEY);
    const storedSaved = readStoredJson(LICENSE_SAVED_STORAGE_KEY);

    const resolvedLicenseSettings = (isDemoMode && !licenseSettings) ? demoLicenseSettings : licenseSettings;
    setLicenses(storedDraft || resolvedLicenseSettings);
    setSavedLicenseSnapshot(storedSaved || resolvedLicenseSettings);

    if (!domainId) {
      setRules([]);
      return;
    }

    try {
      const response = await apiFetch(`/api/publisher/domains/${domainId}/pricing-rules`);
      const allRules = Array.isArray(response?.pricingRules) ? response.pricingRules : [];
      setRules(isDemoMode && allRules.length === 0 ? demoPricingRules : allRules);
    } catch (error) {
      if (!isDemoMode) throw error;
      setRules(demoPricingRules);
    }
  };

  useEffect(() => {
    loadDomains().catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    const storedDraft = readStoredJson(LICENSE_DRAFT_STORAGE_KEY);
    const storedSaved = readStoredJson(LICENSE_SAVED_STORAGE_KEY);
    if (storedDraft) setLicenses(storedDraft);
    if (storedSaved) setSavedLicenseSnapshot(storedSaved);
  }, []);

  useEffect(() => {
    loadDomainData(selectedDomainId).catch((error) => toast.error(getErrorMessage(error)));
  }, [selectedDomainId]);

  useEffect(() => {
    writeStoredJson(LICENSE_DRAFT_STORAGE_KEY, licenses);
  }, [licenses]);

  useEffect(() => {
    if (!selectedDomainId) return;
    writeStoredJson(SELECTED_DOMAIN_STORAGE_KEY, selectedDomainId);
  }, [selectedDomainId]);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">License toggles</h2>
        <p className="text-sm text-faircrawl-textMuted">Training usage is explicitly prohibited. Licenses are inactive until enabled.</p>
        <p className="mt-2 text-sm text-faircrawl-textMuted">A license defines the type of access buyers can purchase. Enable only the license types you want to sell, then set a base price for each one in micros (1,000,000 micros = 1 currency unit).</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(['SUMMARY', 'DISPLAY'] as const).map((license) => (
            <div key={license} className="rounded-lg border border-white/10 p-4">
              <p className="font-medium">{license === 'SUMMARY' ? 'Summarize / Grounding' : 'Full Display'}</p>
              <p className="mt-1 text-xs text-faircrawl-textMuted">{license === 'SUMMARY' ? 'Read + summarize/cite, no full text display.' : 'Display full content once.'}</p>
              <div className="mt-3 flex gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={licenses[license]?.basePriceMicros || 0}
                  onChange={(e) => setLicenses((s: any) => ({ ...s, [license]: { ...s[license], basePriceMicros: toWholeNumber(e.target.value) } }))}
                />
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
              setSavedLicenseSnapshot(licenses);
              writeStoredJson(LICENSE_SAVED_STORAGE_KEY, licenses);
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
        {savedLicenseSnapshot ? (
          <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
            <p className="text-sm font-medium text-emerald-200">Saved license configuration</p>
            <p className="mt-1 text-xs text-emerald-100/90">These license settings are currently saved and ready to be used by pricing rules.</p>
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
        <p className="mt-2 text-sm text-faircrawl-textMuted">Pricing controls how much buyers pay for each request. Choose the domain + path, pick the license type being sold, and set the per-request price in micros.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <Select value={selectedDomainId ?? ''} onChange={(e) => setSelectedDomainId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Pick domain</option>
            {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Input placeholder="path prefix" value={form.pathPrefix} onChange={(e) => setForm({ ...form, pathPrefix: e.target.value })} />
          <Select value={form.licenseCode} onChange={(e) => setForm({ ...form, licenseCode: e.target.value })}><option>SUMMARY</option><option>DISPLAY</option></Select>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.priceMicros}
            onChange={(e) => setForm({ ...form, priceMicros: toWholeNumber(e.target.value) })}
          />
          <Button disabled={!selectedDomainId || isCreatingRule} onClick={async () => {
            if (!selectedDomainId) {
              setCreateError('Pick a domain to set pricing rules.');
              setCreateSuccess('');
              return;
            }
            try {
              setIsCreatingRule(true);
              setCreateError('');
              setCreateSuccess('');
              const response = await apiFetch(`/api/publisher/domains/${selectedDomainId}/pricing-rules`, {
                method: 'POST',
                body: JSON.stringify(form),
              });

              const createdRule = response?.pricingRule || response?.rule || response;
              if (createdRule?.id) {
                setRules((current) => [createdRule, ...current.filter((rule) => rule.id !== createdRule.id)]);
              } else {
                await loadDomainData(selectedDomainId);
              }
              setForm({ ...emptyForm });
              setCreateSuccess('Pricing rule created successfully.');
              toast.success('Pricing rule created');
            } catch (error) {
              if (error instanceof ApiError) {
                setCreateError(error.message || error.code);
                setCreateSuccess('');
                toast.error(getErrorMessage(error));
                return;
              }
              setCreateError('Pricing rules are required to allow paid access.');
              setCreateSuccess('');
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
        {createSuccess ? <p className="mt-2 text-sm text-emerald-300">{createSuccess}</p> : null}
        {rules.length === 0 ? <div className="mt-4"><EmptyState title="No pricing rules" description="Create and activate at least one pricing rule to allow paid access. New rules appear here after creation." /></div> : (
          <div className="mt-4 overflow-x-auto"><Table><thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>Path</th><th>License</th><th>Price</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead><tbody>{rules.map((r) => <tr key={r.id} className="border-t border-white/10"><td className="py-2">{domains.find((d) => d.id === r.domainId)?.name || r.domainId}</td><td>{r.pathPrefix || '/'}</td><td>{r.licenseCode || r.licenseType}</td><td>{r.priceMicros}</td><td><Badge tone={r.isActive || r.active ? 'success' : 'warning'}>{r.isActive || r.active ? 'Active' : 'Inactive'}</Badge></td><td>{new Date(r.createdAt).toLocaleString()}</td><td><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/pricing-rules/${r.id}`, { method: 'DELETE' }); await loadDomainData(selectedDomainId); }}>Delete</Button></td></tr>)}</tbody></Table></div>
        )}
      </Card>
    </div>
  );
}

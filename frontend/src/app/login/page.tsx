'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/http';
import {
  clearSession,
  getOrgId,
  getUserId,
  setSession,
  setSessionContext,
  type Role,
} from '@/lib/session';
import { Button } from '@/components/ui/Button';

type Organisation = {
  id: number;
  name?: string;
  orgName?: string;
};

type Domain = {
  id: number;
  domain?: string;
  name?: string;
  createdAt?: string;
};

type FlowStep = 'auth' | 'select-org' | 'create-org' | 'domains';

const parseJwtPayload = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(atob(padded));
    return payload;
  } catch {
    return null;
  }
};

const resolveUserIdFromAuth = (data: any, accessToken: string) => {
  const direct = Number(data?.userId || data?.id || 0);
  if (Number.isInteger(direct) && direct > 0) return direct;
  const payload = parseJwtPayload(accessToken);
  const fromToken = Number(payload?.userId || payload?.sub || 0);
  if (Number.isInteger(fromToken) && fromToken > 0) return fromToken;
  return null;
};

const normalizeOrganisations = (input: any): Organisation[] => {
  const list = Array.isArray(input) ? input : Array.isArray(input?.organisations) ? input.organisations : [];
  return list
    .map((org: any) => ({
      id: Number(org?.id || org?.orgId || 0),
      name: String(org?.name || org?.orgName || '').trim(),
      orgName: String(org?.orgName || org?.name || '').trim(),
    }))
    .filter((org: Organisation) => Number.isInteger(org.id) && org.id > 0);
};

const normalizeDomains = (input: any): Domain[] => {
  const list = Array.isArray(input) ? input : Array.isArray(input?.domains) ? input.domains : [];
  return list
    .map((domain: any) => ({
      id: Number(domain?.id || 0),
      domain: domain?.domain || domain?.name,
      name: domain?.name || domain?.domain,
      createdAt: domain?.createdAt,
    }))
    .filter((domain: Domain) => Number.isInteger(domain.id) && domain.id > 0);
};

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<FlowStep>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('PUBLISHER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');

  const selectedOrg = useMemo(
    () => organisations.find((org) => org.id === selectedOrgId) || null,
    [organisations, selectedOrgId],
  );

  const loadDomains = async (orgId: number) => {
    try {
      const response = await apiFetch(`/api/domains?orgId=${orgId}`);
      setDomains(normalizeDomains(response));
    } catch {
      const fallbackResponse = await apiFetch('/api/domains');
      setDomains(normalizeDomains(fallbackResponse));
    }
  };

  const handleOrganisations = async (resolvedUserId: number) => {
    const response = await apiFetch(`/api/organisations?userId=${resolvedUserId}`);
    const orgs = normalizeOrganisations(response);
    setOrganisations(orgs);

    if (orgs.length === 0) {
      setSelectedOrgId(null);
      setSessionContext({ orgId: null });
      setStep('create-org');
      return;
    }

    if (orgs.length === 1) {
      const onlyOrgId = orgs[0].id;
      setSelectedOrgId(onlyOrgId);
      setSessionContext({ orgId: onlyOrgId });
      await loadDomains(onlyOrgId);
      setStep('domains');
      return;
    }

    setStep('select-org');
  };

  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const payload =
        mode === 'login'
          ? { email, password }
          : {
              email,
              password,
              role,
              name,
            };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken || null;
      const resolvedRole = (data?.role || role) as Role;

      if (!accessToken) {
        throw new Error('Missing access token in auth response');
      }

      setSession(accessToken, refreshToken, resolvedRole, email);

      const resolvedUserId = resolveUserIdFromAuth(data, accessToken);
      if (!resolvedUserId) {
        throw new Error('Unable to resolve user id from auth response');
      }

      setUserId(resolvedUserId);
      setSessionContext({ userId: resolvedUserId });
      await handleOrganisations(resolvedUserId);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const createOrg = async () => {
    if (!userId) {
      setError('Missing user context. Please log in again.');
      return;
    }

    const created = await apiFetch('/api/organisations', {
      method: 'POST',
      body: JSON.stringify({ name: orgName.trim(), userId }),
    });

    const orgs = normalizeOrganisations(created);
    let org: Organisation | null = orgs[0] || null;

    if (!org) {
      org = {
        id: Number(created?.id || created?.orgId || 0),
        name: String(created?.name || created?.orgName || orgName.trim()),
      };
    }

    if (!org || !org.id) {
      throw new Error('Organisation creation failed');
    }

    setOrganisations([org]);
    setSelectedOrgId(org.id);
    setSessionContext({ orgId: org.id });
    await loadDomains(org.id);
    setOrgName('');
    setStep('domains');
  };

  const confirmOrgSelection = async () => {
    if (!selectedOrgId) {
      setError('Select an organisation to continue.');
      return;
    }
    setSessionContext({ orgId: selectedOrgId });
    await loadDomains(selectedOrgId);
    setStep('domains');
  };

  const addDomain = async () => {
    if (!selectedOrgId) {
      setError('Select an organisation first.');
      return;
    }
    const domain = newDomain.trim();
    if (!domain) return;

    await apiFetch('/api/domains', {
      method: 'POST',
      body: JSON.stringify({
        domain,
        orgId: selectedOrgId,
      }),
    });

    setNewDomain('');
    await loadDomains(selectedOrgId);
  };

  useEffect(() => {
    const cachedUserId = getUserId();
    const cachedOrgId = getOrgId();
    if (!cachedUserId) return;

    setUserId(cachedUserId);
    if (cachedOrgId) {
      setSelectedOrgId(cachedOrgId);
      setStep('domains');
      loadDomains(cachedOrgId).catch(() => {
        // ignore initial load errors on refresh
      });
      return;
    }

    handleOrganisations(cachedUserId).catch(() => {
      // ignore initial flow errors on refresh
    });
  }, []);

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold text-white">FairFetch Access</h1>
        <p className="mb-6 text-sm text-white/70">Authenticate, choose organisation, and manage domains.</p>

        {step === 'auth' && (
          <>
            <div className="mb-4 flex gap-2">
              <Button variant={mode === 'login' ? 'primary' : 'secondary'} onClick={() => setMode('login')}>
                Login
              </Button>
              <Button variant={mode === 'signup' ? 'primary' : 'secondary'} onClick={() => setMode('signup')}>
                Signup
              </Button>
            </div>
            <form onSubmit={submitAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white">Name</label>
                  <input
                    className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Email</label>
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-white">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white">Role</label>
                  <select
                    className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="PUBLISHER">Publisher</option>
                    <option value="AICLIENT">AI team</option>
                  </select>
                </div>
              )}
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create account'}
              </Button>
            </form>
          </>
        )}

        {step === 'select-org' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Select organisation</h2>
            <select
              className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
              value={selectedOrgId || ''}
              onChange={(e) => setSelectedOrgId(Number(e.target.value))}
            >
              <option value="">Choose organisation</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name || org.orgName || `Org ${org.id}`}
                </option>
              ))}
            </select>
            <Button onClick={confirmOrgSelection}>Continue</Button>
          </div>
        )}

        {step === 'create-org' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Create organisation</h2>
            <input
              className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
              placeholder="Organisation name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <Button disabled={!orgName.trim()} onClick={createOrg}>
              Create organisation
            </Button>
          </div>
        )}

        {step === 'domains' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Domains {selectedOrg ? `(${selectedOrg.name || selectedOrg.orgName || selectedOrg.id})` : ''}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  clearSession();
                  setStep('auth');
                  setDomains([]);
                  setOrganisations([]);
                  setSelectedOrgId(null);
                  setUserId(null);
                }}
              >
                Logout
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                className="w-full rounded-xl border border-white/15 bg-[#101424] px-4 py-2 text-sm text-white"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <Button onClick={addDomain} disabled={!newDomain.trim()}>
                Add domain
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-sm text-white">
                <thead className="bg-white/5 text-white/60">
                  <tr>
                    <th className="px-3 py-2">Domain</th>
                    <th className="px-3 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-3 py-6 text-center text-white/60">
                        No domains yet.
                      </td>
                    </tr>
                  ) : (
                    domains.map((domain) => (
                      <tr key={domain.id} className="border-t border-white/10">
                        <td className="px-3 py-2">{domain.domain || domain.name}</td>
                        <td className="px-3 py-2">{domain.createdAt ? new Date(domain.createdAt).toLocaleString() : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

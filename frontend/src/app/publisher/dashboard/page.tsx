'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, EmptyState, Table } from '@/components/dashboard/primitives';
import { apiFetch } from '@/lib/api';
import { canUseDemoFallback, demoPublisherOverview, demoPublisherTraffic } from '@/lib/demoData';
import { toast } from '@/components/toast/ToastProvider';
import { getErrorMessage } from '@/lib/errorMessage';
import { getOrgId, setSessionContext } from '@/lib/session';

type UserAgentTrafficRow = {
  userAgent: string;
  requests: number;
  firstSeen: string;
  lastSeen: string;
};

type DomainRow = {
  id: number;
  domain: string;
  status?: string;
  createdAt?: string;
};

export default function PublisherOverviewPage() {
  const [data, setData] = useState<any>(demoPublisherOverview);
  const [traffic, setTraffic] = useState<{ rows: UserAgentTrafficRow[]; summary: { totalLogs: number; uniqueUserAgents: number } }>(demoPublisherTraffic);
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainsLoading, setDomainsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setDomainsLoading(true);
      try {
        let resolvedOrgId = getOrgId();

        if (!resolvedOrgId) {
          const orgsResponse = await apiFetch('/api/organisations');
          const orgs = Array.isArray(orgsResponse) ? orgsResponse : [];
          if (orgs.length > 0) {
            resolvedOrgId = Number(orgs[0]?.id || 0);
            if (resolvedOrgId > 0) {
              setSessionContext({ orgId: resolvedOrgId });
            }
          }
        }

        const domainsPromise = resolvedOrgId
          ? apiFetch(`/api/domains?orgId=${resolvedOrgId}`)
          : Promise.resolve([]);

        const [overview, trafficResponse, domainsResponse] = await Promise.all([
          apiFetch('/api/publisher/overview'),
          apiFetch('/api/publisher/traffic/user-agents?limit=10'),
          domainsPromise,
        ]);

        setData({
          ...demoPublisherOverview,
          ...overview,
          kpis: { ...demoPublisherOverview.kpis, ...(overview?.kpis || {}) },
          recentTransactions: Array.isArray(overview?.recentTransactions)
            ? overview.recentTransactions.map((tx: any) => ({
                ...tx,
                aiClient: tx.aiClient || `AI Client #${tx.aiClientId || 'Unknown'}`,
              }))
            : demoPublisherOverview.recentTransactions,
        });

        setTraffic({
          rows: Array.isArray(trafficResponse?.rows) ? trafficResponse.rows : [],
          summary: {
            totalLogs: Number(trafficResponse?.summary?.totalLogs || 0),
            uniqueUserAgents: Number(trafficResponse?.summary?.uniqueUserAgents || 0),
          },
        });

        const normalizedDomains = Array.isArray(domainsResponse)
          ? domainsResponse
              .map((domain: any) => ({
                id: Number(domain?.id || 0),
                domain: String(domain?.domain || '').trim(),
                status: domain?.status ? String(domain.status) : undefined,
                createdAt: domain?.createdAt,
              }))
              .filter((domain: DomainRow) => domain.id > 0 && domain.domain)
          : [];
        setDomains(normalizedDomains);
      } catch (error) {
        if (canUseDemoFallback) {
          setData(demoPublisherOverview);
          setTraffic(demoPublisherTraffic);
          setDomains([]);
        } else {
          toast.error(getErrorMessage(error));
        }
      } finally {
        setLoading(false);
        setDomainsLoading(false);
      }
    };

    load();
  }, []);

  const checklist = data?.checklist || [];
  const transactions = data?.recentTransactions || [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-faircrawl-textMuted">
        Use this overview as your control room: the KPI cards summarize last 30 days, checklist shows setup gaps, and transactions prove payouts.
      </p>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Revenue (30d)', value: `$${((data?.kpis?.revenueMicros || 0) / 1_000_000).toFixed(2)}` },
          { label: 'Requests (30d)', value: data?.kpis?.requests30d || 0 },
          { label: 'Active domains', value: domains.length || data?.kpis?.activeDomains || 0 },
          { label: 'Top AI client', value: data?.kpis?.topAIClient || 'None yet' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-xs text-faircrawl-textMuted">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Traffic by user-agent</h2>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Top user agents seen in request logs for your domains.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-faircrawl-textMuted">Total log entries</p>
            <p className="mt-1 text-xl font-semibold text-white">{traffic.summary.totalLogs}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-faircrawl-textMuted">Unique user agents</p>
            <p className="mt-1 text-xl font-semibold text-white">{traffic.summary.uniqueUserAgents}</p>
          </div>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-faircrawl-textMuted">Loading traffic...</p>
        ) : traffic.rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No traffic logs yet" description="Log entries will appear after your site pushes user-agent data." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted">
                <tr><th>User agent</th><th>Requests</th><th>First seen</th><th>Last seen</th></tr>
              </thead>
              <tbody>
                {traffic.rows.map((row, index) => (
                  <tr key={`${row.userAgent}-${index}`} className="border-t border-white/10">
                    <td className="py-2">{row.userAgent}</td>
                    <td>{row.requests}</td>
                    <td>{row.firstSeen ? new Date(row.firstSeen).toLocaleString() : '—'}</td>
                    <td>{row.lastSeen ? new Date(row.lastSeen).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Organisation domains</h2>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Domains are loaded from `/api/domains` for your selected organisation.</p>
        {domainsLoading ? (
          <p className="mt-4 text-sm text-faircrawl-textMuted">Loading domains...</p>
        ) : domains.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No domains found" description="Add a domain from login flow or domains page." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted">
                <tr><th>Domain</th><th>Status</th><th>Created</th></tr>
              </thead>
              <tbody>
                {domains.map((domain) => (
                  <tr key={domain.id} className="border-t border-white/10">
                    <td className="py-2">{domain.domain}</td>
                    <td>{domain.status || '—'}</td>
                    <td>{domain.createdAt ? new Date(domain.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Onboarding checklist</h2>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Complete all items to ensure AI requests can be priced, verified, and paid out.</p>
        <div className="mt-3 space-y-2">
          {checklist.map((item: any) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <span>{item.label}</span>
              <Badge tone={item.done ? 'success' : 'warning'}>{item.done ? 'Complete' : 'Pending'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Recent transactions</h2>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Each row is a successful paid redemption with your publisher share.</p>
        {transactions.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No transactions yet" description="A transaction appears here after an AI client redeems a token for content." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted">
                <tr><th>Time</th><th>AI Client</th><th>Path</th><th>License</th><th>Price</th></tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr key={tx.id} className="border-t border-white/10">
                    <td className="py-2">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>{tx.aiClient}</td>
                    <td>{tx.path}</td>
                    <td>{tx.licenseType}</td>
                    <td>${(tx.publisherAmountMicros / 1_000_000).toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

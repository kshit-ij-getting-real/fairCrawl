'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, EmptyState, Table } from '@/components/dashboard/primitives';
import { demoPublisherOverview } from '@/lib/demoData';
import { publisherMockStore } from '@/lib/publisherMockStore';

export default function PublisherOverviewPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setData(publisherMockStore.getOverview() || demoPublisherOverview);
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
          { label: 'Active domains', value: data?.kpis?.activeDomains || 0 },
          { label: 'Top AI client', value: data?.kpis?.topAIClient || 'None yet' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-xs text-faircrawl-textMuted">{kpi.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
          </Card>
        ))}
      </div>

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

'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Card, EmptyState, Table } from '@/components/dashboard/primitives';

export default function PayoutsPage() {
  const [data, setData] = useState<any>({ summary: null, history: [] });
  useEffect(() => { apiFetch('/api/publisher/payouts').then(setData); }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Revenue summary</h2>
        <p className="mt-3 text-2xl font-semibold">${((data.summary?.revenueMicros || 0) / 1_000_000).toFixed(2)}</p>
        <p className="text-sm text-faircrawl-textMuted">Payout method: {data.summary?.methodStatus || 'Not configured'}</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Payout history</h2>
        {data.history.length === 0 ? <div className="mt-4"><EmptyState title="No payouts yet" description="Payout entries appear when settlements run." /></div> : (
          <Table className="mt-4"><thead><tr><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data.history.map((p: any, idx: number) => <tr key={idx} className="border-t border-[rgba(126,135,212,0.12)]"><td className="py-2">{p.date}</td><td>{p.amountMicros}</td><td>{p.status}</td></tr>)}</tbody></Table>
        )}
      </Card>
    </div>
  );
}

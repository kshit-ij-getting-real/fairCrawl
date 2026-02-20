'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Card, Table } from '@/components/dashboard/primitives';

export default function AIClientUsageSpendPage() {
  const [usage, setUsage] = useState<any>({ byDomain: [], byDay: [] });

  useEffect(() => {
    const load = async () => {
      const [usageByDomain, usageByDay] = await Promise.all([
        apiFetch('/api/aiclient/usage/by-domain'),
        apiFetch('/api/aiclient/usage/by-day'),
      ]);
      setUsage({ byDomain: usageByDomain, byDay: usageByDay });
    };

    load();
  }, []);

  const spend30d = useMemo(
    () => ((usage.byDay?.reduce((sum: number, d: any) => sum + (d.spend_micros || 0), 0) || 0) / 1_000_000).toFixed(2),
    [usage.byDay],
  );
  const requests = useMemo(
    () => usage.byDomain?.reduce((sum: number, d: any) => sum + (d.requests || 0), 0) || 0,
    [usage.byDomain],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs text-faircrawl-textMuted">Spend (30d)</p>
          <p className="mt-2 text-2xl font-semibold">${spend30d}</p>
        </Card>
        <Card>
          <p className="text-xs text-faircrawl-textMuted">Requests</p>
          <p className="mt-2 text-2xl font-semibold">{requests}</p>
        </Card>
      </div>
      <Card>
        <h2 className="text-lg font-semibold">Usage + spend</h2>
        <h3 className="mt-3 font-medium">By domain</h3>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Requests</th>
              <th>Spend</th>
            </tr>
          </thead>
          <tbody>
            {usage.byDomain?.map((d: any) => (
              <tr key={d.domainId} className="border-t border-white/10">
                <td className="py-2">{d.domain}</td>
                <td>{d.requests}</td>
                <td>{d.spendMicros}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h3 className="mt-5 font-medium">By day</h3>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Day</th>
              <th>Spend</th>
            </tr>
          </thead>
          <tbody>
            {usage.byDay?.map((d: any) => (
              <tr key={d.day} className="border-t border-white/10">
                <td className="py-2">{d.day}</td>
                <td>{d.spend_micros}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

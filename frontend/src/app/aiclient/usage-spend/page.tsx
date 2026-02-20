'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Card, EmptyState, Table } from '@/components/dashboard/primitives';

const toDollars = (micros: number) => `$${(micros / 1_000_000).toFixed(4)}`;

type UsageByDomain = {
  domainId: string;
  domain: string;
  requests: number;
  spendMicros: number;
};

type UsageByDay = {
  day: string;
  requests: number;
  spend_micros: number;
};

const CHART_HEIGHT = 220;
const CHART_WIDTH = 840;

export default function AIClientUsageSpendPage() {
  const [usage, setUsage] = useState<{ byDomain: UsageByDomain[]; byDay: UsageByDay[] }>({ byDomain: [], byDay: [] });

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
    () => ((usage.byDay?.reduce((sum, d) => sum + (d.spend_micros || 0), 0) || 0) / 1_000_000).toFixed(2),
    [usage.byDay],
  );
  const requests = useMemo(() => usage.byDomain?.reduce((sum, d) => sum + (d.requests || 0), 0) || 0, [usage.byDomain]);

  const chartPoints = useMemo(() => {
    if (!usage.byDay.length) return '';
    const maxRequests = Math.max(...usage.byDay.map((row) => row.requests), 1);
    return usage.byDay
      .map((row, index) => {
        const x = usage.byDay.length === 1 ? 0 : (index / (usage.byDay.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - (row.requests / maxRequests) * CHART_HEIGHT;
        return `${x},${y}`;
      })
      .join(' ');
  }, [usage.byDay]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-faircrawl-textMuted">
        This page is your billing audit: totals at top, then detailed breakdowns showing where spend comes from.
      </p>
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
        <h3 className="mt-3 font-medium">Requests by day</h3>
        <p className="mt-1 text-xs text-faircrawl-textMuted">A visual daily trend to quickly spot spikes and drops in request volume.</p>
        <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-[#050815] p-3">
          {usage.byDay.length === 0 ? (
            <EmptyState title="No usage yet" description="Paid requests will appear here once your agent starts redeeming tokens." />
          ) : (
            <>
              <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-56 w-full">
                <line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} className="stroke-white/20" strokeWidth="2" />
                <polyline fill="none" stroke="#6b8dff" strokeWidth="4" points={chartPoints} strokeLinejoin="round" strokeLinecap="round" />
                {usage.byDay.map((row, index) => {
                  const x = usage.byDay.length === 1 ? 0 : (index / (usage.byDay.length - 1)) * CHART_WIDTH;
                  const maxRequests = Math.max(...usage.byDay.map((d) => d.requests), 1);
                  const y = CHART_HEIGHT - (row.requests / maxRequests) * CHART_HEIGHT;
                  return <circle key={row.day} cx={x} cy={y} r="5" className="fill-[#8aa4ff]" />;
                })}
              </svg>
              <div className="mt-2 grid gap-2 text-xs text-faircrawl-textMuted sm:grid-cols-2">
                <p>Start: {usage.byDay[0]?.day}</p>
                <p className="sm:text-right">End: {usage.byDay[usage.byDay.length - 1]?.day}</p>
              </div>
            </>
          )}
        </div>

        <h3 className="mt-3 font-medium">By domain</h3>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Each row combines all paid reads for one publisher domain.</p>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Requests</th>
              <th>Spend</th>
            </tr>
          </thead>
          <tbody>
            {usage.byDomain?.map((d) => (
              <tr key={d.domainId} className="border-t border-white/10">
                <td className="py-2">{d.domain}</td>
                <td>{d.requests}</td>
                <td>{toDollars(d.spendMicros || 0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h3 className="mt-5 font-medium">By day</h3>
        <p className="mt-1 text-xs text-faircrawl-textMuted">Daily trend of paid requests; use this to spot sudden spikes.</p>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Day</th>
              <th>Requests</th>
              <th>Spend</th>
            </tr>
          </thead>
          <tbody>
            {usage.byDay?.map((d) => (
              <tr key={d.day} className="border-t border-white/10">
                <td className="py-2">{d.day}</td>
                <td>{d.requests}</td>
                <td>{toDollars(d.spend_micros || 0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

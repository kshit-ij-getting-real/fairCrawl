'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { formatMicrosToCurrency } from '@/lib/money';

type UsageRow = {
  txId: string;
  timestamp: string;
  domain: string;
  path: string;
  license: 'SUMMARY' | 'DISPLAY';
  priceMicros: number;
};

type UsageLedgerResponse = {
  rows: UsageRow[];
  summary: { runningSpendMicros: number; totalSpendMicros: number };
  page: { pageSize: number; hasMore: boolean; nextCursor: string | null };
};

const DEFAULT_PAGE_SIZE = 25;

export default function UsageSpendPage() {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [runningSpendMicros, setRunningSpendMicros] = useState(0);
  const [totalSpendMicros, setTotalSpendMicros] = useState(0);
  const [filters, setFilters] = useState({ from: '', to: '', domain: '', licenseType: '' });
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);

  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    if (filters.from) query.set('from', filters.from);
    if (filters.to) query.set('to', filters.to);
    if (filters.domain) query.set('domain', filters.domain);
    if (filters.licenseType) query.set('licenseType', filters.licenseType);
    if (cursor) query.set('cursor', cursor);
    query.set('pageSize', String(DEFAULT_PAGE_SIZE));
    return query.toString();
  }, [filters, cursor]);

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch(`/api/aiclient/usage/ledger?${queryString}`) as UsageLedgerResponse;
      setRows(response.rows || []);
      setRunningSpendMicros(response.summary?.runningSpendMicros || 0);
      setTotalSpendMicros(response.summary?.totalSpendMicros || 0);
      setNextCursor(response.page?.nextCursor || null);
    };
    load();
  }, [queryString]);

  const applyFilters = () => {
    setCursor(null);
    setCursorHistory([]);
  };

  const goNextPage = () => {
    if (!nextCursor) return;
    setCursorHistory((history) => [...history, cursor]);
    setCursor(nextCursor);
  };

  const goPreviousPage = () => {
    setCursorHistory((history) => {
      const nextHistory = [...history];
      const previousCursor = nextHistory.pop() ?? null;
      setCursor(previousCursor);
      return nextHistory;
    });
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold">AI Usage & Spend</h2>
      <p className="mt-1 text-sm text-faircrawl-textMuted">Running spend total (current page): {formatMicrosToCurrency(runningSpendMicros)}</p>
      <p className="text-sm text-faircrawl-textMuted">Total spend (matching filters): {formatMicrosToCurrency(totalSpendMicros)}</p>

      <div className="mt-3 grid gap-2 md:grid-cols-5">
        <Input value={filters.from} placeholder="From YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <Input value={filters.to} placeholder="To YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <Input value={filters.domain} placeholder="Domain" onChange={(e) => setFilters({ ...filters, domain: e.target.value })} />
        <Select value={filters.licenseType} onChange={(e) => setFilters({ ...filters, licenseType: e.target.value })}>
          <option value="">Any license</option>
          <option value="SUMMARY">SUMMARY</option>
          <option value="DISPLAY">DISPLAY</option>
        </Select>
        <Button onClick={applyFilters}>Apply filters</Button>
      </div>

      {rows.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No usage yet" description="Ledger receipts will appear after paid requests." />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <thead className="text-left text-faircrawl-textMuted">
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Domain</th>
                <th>Path</th>
                <th>License</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.txId} className="border-t border-white/10">
                  <td className="py-2">{row.txId}</td>
                  <td>{new Date(row.timestamp).toLocaleString()}</td>
                  <td>{row.domain}</td>
                  <td>{row.path}</td>
                  <td>{row.license}</td>
                  <td>{formatMicrosToCurrency(row.priceMicros)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button variant="secondary" onClick={goPreviousPage} disabled={cursorHistory.length === 0}>Previous</Button>
        <Button variant="secondary" onClick={goNextPage} disabled={!nextCursor}>Next</Button>
      </div>
    </Card>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState, Input, Select, Table } from '@/components/dashboard/primitives';
import { formatMicrosToCurrency } from '@/lib/money';
import { toast } from '@/components/toast/ToastProvider';
import { demoTransactions, isDemoMode } from '@/lib/demoData';

type ReceiptRow = {
  txId: string;
  timestamp: string;
  domain: string;
  path: string;
  license: 'SUMMARY' | 'DISPLAY';
  priceMicros: number;
};

type TransactionsResponse = {
  rows: ReceiptRow[];
  page: {
    pageSize: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
};

const DEFAULT_PAGE_SIZE = 25;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ReceiptRow[]>([]);
  const [filters, setFilters] = useState({ from: '', to: '', domain: '', licenseType: '' });
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const load = async () => {
    try {
      const response = await apiFetch(`/api/publisher/transactions?${queryString}`) as TransactionsResponse;
      const rows = response.rows || [];
      const resolvedRows = isDemoMode && rows.length === 0 ? demoTransactions.rows : rows;
      setTransactions(resolvedRows as ReceiptRow[]);
      setNextCursor((isDemoMode && rows.length === 0 ? demoTransactions : response).page?.nextCursor || null);
    } catch (error) {
      if (!isDemoMode) throw error;
      setTransactions(demoTransactions.rows as ReceiptRow[]);
      setNextCursor(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const applyFilters = async () => {
    setIsRefreshing(true);
    setCursor(null);
    setCursorHistory([]);
    await load();
    toast.success('Updated');
    setIsRefreshing(false);
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
      <h2 className="text-lg font-semibold">Transactions</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        <Input value={filters.from} placeholder="From YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <Input value={filters.to} placeholder="To YYYY-MM-DD" onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <Input value={filters.domain} placeholder="Domain" onChange={(e) => setFilters({ ...filters, domain: e.target.value })} />
        <Select value={filters.licenseType} onChange={(e) => setFilters({ ...filters, licenseType: e.target.value })}>
          <option value="">Any license</option>
          <option value="SUMMARY">SUMMARY</option>
          <option value="DISPLAY">DISPLAY</option>
        </Select>
        <Button onClick={applyFilters} disabled={isRefreshing}>{isRefreshing ? 'Updating...' : 'Apply filters'}</Button>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No transactions" description="Transactions appear after an AI client redeems a token for your content." />
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
              {transactions.map((tx) => (
                <tr key={tx.txId} className="border-t border-white/10">
                  <td className="py-2">{tx.txId}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>{tx.domain}</td>
                  <td>{tx.path}</td>
                  <td>{tx.license}</td>
                  <td>{formatMicrosToCurrency(tx.priceMicros)}</td>
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

      <Button className="mt-4" variant="secondary" onClick={async () => { const csv = await apiFetch('/api/publisher/transactions/export'); const blob = new Blob([csv.csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click(); }}>Export CSV</Button>
    </Card>
  );
}

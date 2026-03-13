'use client';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, EmptyState, Input, Table } from '@/components/dashboard/primitives';
import { toast } from '@/components/toast/ToastProvider';
import { apiFetch } from '@/lib/api';
import { getErrorMessage } from '@/lib/errorMessage';
import { getOrResolveOrgId } from '@/lib/orgContext';

type PublisherDomain = {
  id: number;
  domain: string;
  status?: string;
  createdAt?: string;
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<PublisherDomain[]>([]);
  const [domain, setDomain] = useState('');
  const [orgId, setOrgId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const resolvedOrgId = await getOrResolveOrgId();
      setOrgId(resolvedOrgId);
      if (!resolvedOrgId) {
        setDomains([]);
        return;
      }
      const response = await apiFetch(`/api/domains?orgId=1`);
      const normalized = Array.isArray(response)
        ? response
            .map((item: any) => ({
              id: Number(item?.id || 0),
              domain: String(item?.domain || '').trim(),
              status: item?.status ? String(item.status) : undefined,
              createdAt: item?.createdAt,
            }))
            .filter((item: PublisherDomain) => item.id > 0 && item.domain)
        : [];
      setDomains(normalized);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setDomains([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Add domain</h2>
        <p className="mt-2 text-sm text-faircrawl-textMuted">Domains are stored in FairFetch and mapped to your publisher account.</p>
        <div className="mt-3 flex gap-2">
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          <Button
            onClick={async () => {
              setIsAdding(true);
              try {
                const resolvedOrgId = orgId || (await getOrResolveOrgId());
                if (!resolvedOrgId) {
                  throw new Error('No organisation found. Create an organisation first.');
                }

                await apiFetch('/api/domains', {
                  method: 'POST',
                  body: JSON.stringify({ domain: domain.trim(), orgId: 1 }),
                });
                setDomain('');
                toast.success('Domain added');
                await load();
              } catch (error) {
                toast.error(getErrorMessage(error));
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={!domain.trim() || isAdding}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Domain setup</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-faircrawl-textMuted">Loading domains...</p>
        ) : domains.length === 0 ? <div className="mt-4"><EmptyState title="No domains yet" description="Add your first domain to begin onboarding." /></div> : (
          <div className="mt-4 overflow-x-auto">
            <Table>
              <thead className="text-left text-faircrawl-textMuted"><tr><th>Domain</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {domains.map((d) => (
                  <tr key={d.id} className="border-t border-white/10">
                    <td className="py-2">{d.domain}</td>
                    <td><Badge tone={d.status === 'VERIFIED' ? 'success' : 'warning'}>{d.status || 'PENDING_VERIFICATION'}</Badge></td>
                    <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
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

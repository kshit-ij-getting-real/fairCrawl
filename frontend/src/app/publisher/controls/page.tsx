'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button, Card, EmptyState, Input } from '@/components/dashboard/primitives';
import { canUseDemoFallback, demoContentControls } from '@/lib/demoData';

export default function ControlsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [value, setValue] = useState('');
  const load = async () => {
    try {
      const response = await apiFetch('/api/publisher/content-controls');
      setItems(canUseDemoFallback && response.length === 0 ? demoContentControls : response);
    } catch (error) {
      if (!canUseDemoFallback) throw error;
      setItems(demoContentControls);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Excluded paths/prefixes</h2>
      <div className="mt-3 flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="/private/*" />
        <Button onClick={async () => { await apiFetch('/api/publisher/content-controls', { method: 'POST', body: JSON.stringify({ pattern: value }) }); setValue(''); load(); }}>Add</Button>
      </div>
      {items.length === 0 ? <div className="mt-4"><EmptyState title="No exclusions" description="Add paths that should never be returned." /></div> : (
        <ul className="mt-4 space-y-2">{items.map((i) => <li key={i.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3"><span>{i.pattern}</span><Button variant="ghost" onClick={async () => { await apiFetch(`/api/publisher/content-controls/${i.id}`, { method: 'DELETE' }); load(); }}>Delete</Button></li>)}</ul>
      )}
    </Card>
  );
}

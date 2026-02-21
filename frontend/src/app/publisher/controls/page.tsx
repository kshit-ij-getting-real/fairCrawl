'use client';
import { useEffect, useState } from 'react';
import { Button, Card, EmptyState, Input } from '@/components/dashboard/primitives';
import { publisherMockStore } from '@/lib/publisherMockStore';

export default function ControlsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [value, setValue] = useState('');

  const load = () => setItems(publisherMockStore.getContentControls());

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Excluded paths/prefixes</h2>
      <p className="mt-1 text-xs text-faircrawl-textMuted">Database-backed controls are temporarily disabled; exclusions on this page are stored locally.</p>
      <div className="mt-3 flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="/private/*" />
        <Button onClick={() => {
          const nextItems = [{ id: Date.now().toString(), pattern: value }, ...items];
          publisherMockStore.setContentControls(nextItems);
          setValue('');
          setItems(nextItems);
        }}>Add</Button>
      </div>
      {items.length === 0 ? <div className="mt-4"><EmptyState title="No exclusions" description="Add paths that should never be returned." /></div> : (
        <ul className="mt-4 space-y-2">{items.map((i) => <li key={i.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3"><span>{i.pattern}</span><Button variant="ghost" onClick={() => {
          const nextItems = items.filter((item) => item.id !== i.id);
          publisherMockStore.setContentControls(nextItems);
          setItems(nextItems);
        }}>Delete</Button></li>)}</ul>
      )}
    </Card>
  );
}

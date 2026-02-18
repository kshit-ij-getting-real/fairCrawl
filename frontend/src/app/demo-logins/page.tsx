'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@/components/dashboard/primitives';
import { apiFetch } from '@/lib/api';

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export default function DemoLoginsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!isDemo) return;
    apiFetch('/api/demo/credentials').then(setData).catch(() => setData(null));
  }, []);

  if (!isDemo) return <main className="mx-auto max-w-3xl px-4 py-12"><Card><p>Demo mode disabled.</p></Card></main>;

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <Card>
        <h1 className="text-2xl font-semibold">Demo logins</h1>
        <p className="mt-2 text-sm text-faircrawl-textMuted">Use these emails for demo walkthroughs.</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Publisher logins</h2>
        <ul className="mt-3 space-y-2">
          {(data?.publisherLogins || []).map((email: string) => (
            <li key={email} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <span>{email}</span>
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(email)}>Copy</Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">AI team logins</h2>
        <ul className="mt-3 space-y-2">
          {(data?.aiTeamLogins || []).map((email: string) => (
            <li key={email} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <span>{email}</span>
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(email)}>Copy</Button>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}

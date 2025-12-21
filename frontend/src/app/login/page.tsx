'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/http';
import { setSession } from '@/lib/session';
import { SectionActions } from '../../components/ui/SectionActions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.role);
      router.push(data.role === 'PUBLISHER' ? '/publisher/dashboard' : '/aiclient/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-2">Login</h1>
        <p className="text-sm text-white/70 mb-6">FairFetch keeps AI access transparent.</p>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder-white/50 focus:border-faircrawl-accent focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white placeholder-white/50 focus:border-faircrawl-accent focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SectionActions>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </SectionActions>
        </form>
      </div>
    </div>
  );
}

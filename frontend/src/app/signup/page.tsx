'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE } from '../../lib/config';
import { setSession, Role } from '../../lib/api';
import { SectionActions } from '../../components/ui/SectionActions';

function SignupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('PUBLISHER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClasses =
    'w-full rounded-2xl bg-[#090f20] border border-white/15 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  useEffect(() => {
    const roleParam = params.get('role');
    if (roleParam === 'aiclient') setRole('AICLIENT');
    if (roleParam === 'publisher') setRole('PUBLISHER');
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name }),
      });
      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      setSession(data.token, role);
      router.push(role === 'PUBLISHER' ? '/publisher/dashboard' : '/aiclient/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Create your FairCrawl account</h1>
          <p className="text-sm text-white/70">FairCrawl keeps AI access transparent.</p>
        </div>
        {role === 'PUBLISHER' ? (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="font-semibold text-white">You&apos;re signing up as a Publisher.</p>
            <div className="space-y-1">
              <p className="font-medium">After you create an account, you&apos;ll:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Add a domain you control.</li>
                <li>Prove you own it by serving a small verification file.</li>
                <li>Set crawl policies and see which AI crawlers access your site.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="font-semibold text-white">You&apos;re signing up as an AI team.</p>
            <div className="space-y-1">
              <p className="font-medium">After you create an account, you&apos;ll:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Generate an API key.</li>
                <li>Call the FairCrawl gateway with your key and target URL.</li>
                <li>See usage and estimated spend in your dashboard.</li>
              </ul>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Name</label>
            <input className={fieldClasses} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Email</label>
            <input className={fieldClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Password</label>
            <input type="password" className={fieldClasses} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white">Role</label>
            <select
              className={`${fieldClasses} appearance-none`}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="PUBLISHER" className="bg-[#090f20] text-white">
                Publisher
              </option>
              <option value="AICLIENT" className="bg-[#090f20] text-white">
                AI team
              </option>
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <SectionActions>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft disabled:opacity-70"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </SectionActions>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}

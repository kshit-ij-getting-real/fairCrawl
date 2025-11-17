'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE } from '../../lib/config';
import { setSession, Role } from '../../lib/api';

function SignupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('PUBLISHER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-md mx-auto bg-white shadow rounded p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Create your Fair Crawl account</h1>
      {role === 'PUBLISHER' ? (
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 space-y-2">
          <p className="font-semibold">You&apos;re signing up as a Publisher.</p>
          <div>
            <p className="font-medium">After you create an account, you&apos;ll:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Add a domain you control.</li>
              <li>Prove you own it by serving a small verification file.</li>
              <li>Set crawl policies and see which AI clients access your site.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700 space-y-2">
          <p className="font-semibold">You&apos;re signing up as an AI Client.</p>
          <div>
            <p className="font-medium">After you create an account, you&apos;ll:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Generate an API key.</li>
              <li>Call the Fair Crawl gateway with your key and target URL.</li>
              <li>See usage and estimated spend in your dashboard.</li>
            </ul>
          </div>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select className="mt-1 w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="PUBLISHER">Publisher</option>
            <option value="AICLIENT">AI Client</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded font-semibold">
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
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

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/http';
import { setSession, setSessionContext, Role } from '@/lib/session';
import { SectionActions } from '../../components/ui/SectionActions';
import { Button } from '@/components/ui/Button';

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
    'w-full rounded-xl border border-[rgba(125,133,211,0.24)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm text-[#2a3274] shadow-sm outline-none ring-0 placeholder:text-[#9096b8] focus:border-[#6873e5] focus:ring-2 focus:ring-[rgba(104,115,229,0.18)]';

  useEffect(() => {
    const roleParam = params.get('role');
    if (roleParam === 'aiclient') setRole('AICLIENT');
    if (roleParam === 'publisher') setRole('PUBLISHER');
  }, [params]);

  const parseJwtPayload = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, role, name }),
      });
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken || null;
      if (!accessToken) {
        throw new Error('Missing access token in signup response');
      }
      setSession(accessToken, refreshToken, role, email);

      const payload = parseJwtPayload(accessToken);
      const resolvedUserId = Number(data?.userId || data?.id || payload?.userId || payload?.sub || 0);
      if (Number.isInteger(resolvedUserId) && resolvedUserId > 0) {
        setSessionContext({ userId: resolvedUserId, orgId: null });
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-md space-y-6 rounded-[32px] border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.76)] p-8 shadow-[0_28px_70px_rgba(126,118,215,0.16)] backdrop-blur-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[#25306d]">Create your FairFetch account</h1>
          <p className="text-sm text-[#7b82a8]">FairFetch keeps AI access transparent.</p>
        </div>
        {role === 'PUBLISHER' ? (
          <div className="space-y-2 rounded-2xl border border-[rgba(126,135,212,0.16)] bg-[rgba(112,124,232,0.08)] p-4 text-sm text-[#59618f]">
            <p className="font-semibold text-[#25306d]">You&apos;re signing up as a Publisher.</p>
            <div className="space-y-1">
              <p className="font-medium">After you create an account, you&apos;ll:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Add a domain you control.</li>
                <li>Verify ownership from the Domains setup flow (auto-verified in demo mode).</li>
                <li>Create pricing and content controls for the paths you want to allow or monetize.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-2 rounded-2xl border border-[rgba(126,135,212,0.16)] bg-[rgba(214,105,243,0.08)] p-4 text-sm text-[#59618f]">
            <p className="font-semibold text-[#25306d]">You&apos;re signing up as an AI team.</p>
            <div className="space-y-1">
              <p className="font-medium">After you create an account, you&apos;ll:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Generate an API key.</li>
                <li>Call the FairFetch gateway with your key and target URL.</li>
                <li>See usage and estimated spend in your dashboard.</li>
              </ul>
            </div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#33408a]">Name</label>
            <input className={fieldClasses} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#33408a]">Email</label>
            <input className={fieldClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#33408a]">Password</label>
            <input type="password" className={fieldClasses} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#33408a]">Role</label>
            <select
              className={`${fieldClasses} appearance-none`}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="PUBLISHER" className="bg-white text-[#2a3274]">
                Publisher
              </option>
              <option value="AICLIENT" className="bg-white text-[#2a3274]">
                AI team
              </option>
            </select>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <SectionActions>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
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

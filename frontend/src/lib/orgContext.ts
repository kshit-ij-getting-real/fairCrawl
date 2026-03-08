'use client';

import { apiFetch } from '@/lib/api';
import { getOrgId, setSessionContext } from '@/lib/session';

let pendingOrgResolution: Promise<number | null> | null = null;

export async function getOrResolveOrgId(): Promise<number | null> {
  const cachedOrgId = getOrgId();
  if (cachedOrgId) return cachedOrgId;

  if (pendingOrgResolution) return pendingOrgResolution;

  pendingOrgResolution = (async () => {
    const orgsResponse = await apiFetch('/api/organisations');
    const orgs = Array.isArray(orgsResponse) ? orgsResponse : [];
    const nextOrgId = Number(orgs[0]?.id || 0);
    if (nextOrgId > 0) {
      setSessionContext({ orgId: nextOrgId });
      return nextOrgId;
    }
    return null;
  })();

  try {
    return await pendingOrgResolution;
  } finally {
    pendingOrgResolution = null;
  }
}

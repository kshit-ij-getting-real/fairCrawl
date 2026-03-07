'use client';

import { API_BASE_URL } from './apiBase';
import { getToken } from './session';
import {
  demoAgentIdentity,
  demoApiKeys,
  demoPublisherDomains,
  demoPublisherOverview,
  demoPublisherTraffic,
  demoTransactions,
  demoUsageByDay,
  demoUsageByDomain,
} from './demoData';
import { publisherMockStore } from './publisherMockStore';

export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

const AUTH_SERVICE_BASE = 'https://fairfetch-backend-c9cu.onrender.com';
let mockApiKeys = [...demoApiKeys];
let mockAgentIdentity = { ...demoAgentIdentity };

const parseJsonBody = (init: RequestInit = {}) => {
  if (!init.body || typeof init.body !== 'string') return {};
  try {
    return JSON.parse(init.body);
  } catch {
    return {};
  }
};

const randomId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const createMaskedKey = () => {
  const suffix = Math.random().toString(16).slice(2, 6);
  return `ff_live_*****************${suffix}`;
};

const mockApiFetch = async (path: string, init: RequestInit = {}) => {
  const method = (init.method || 'GET').toUpperCase();
  const body = parseJsonBody(init);

  if (path === '/api/publisher/overview') {
    return demoPublisherOverview;
  }

  if (path.startsWith('/api/publisher/traffic/user-agents')) {
    return demoPublisherTraffic;
  }

  if (path === '/api/publisher/domains' && method === 'GET') {
    return publisherMockStore.getDomains() || demoPublisherDomains;
  }

  if (path === '/api/publisher/domains' && method === 'POST') {
    const domainName = String(body.domain || '').trim();
    if (!domainName) throw new ApiError('INVALID_DOMAIN', 'Domain is required.');
    const existing = (publisherMockStore.getDomains() || []).find((d: any) => d.name === domainName);
    if (existing) throw new ApiError('DOMAIN_EXISTS', 'Domain already exists.');
    const created = {
      id: Number(randomId()),
      name: domainName,
      verified: false,
      verifyToken: `demo-token-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      subdomainHost: `pay.${domainName}`,
      subdomainCnameTarget: 'edge.fairfetch.dev',
    };
    const nextDomains = [created, ...(publisherMockStore.getDomains() || [])];
    publisherMockStore.setDomains(nextDomains);
    return created;
  }

  if (path.match(/^\/api\/publisher\/domains\/\d+\/verify-dns$/) && method === 'POST') {
    const id = Number(path.split('/')[4]);
    const domains = [...(publisherMockStore.getDomains() || [])];
    const index = domains.findIndex((d: any) => Number(d.id) === id);
    if (index === -1) throw new ApiError('DOMAIN_NOT_FOUND', 'Domain not found.');
    domains[index] = { ...domains[index], verified: true };
    publisherMockStore.setDomains(domains);
    return domains[index];
  }

  if (path === '/api/aiclient/apikeys' && method === 'GET') {
    return mockApiKeys;
  }

  if (path === '/api/aiclient/apikeys' && method === 'POST') {
    const plainKey = `ff_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const record = { id: randomId(), maskedKey: createMaskedKey() };
    mockApiKeys = [record, ...mockApiKeys];
    return { id: record.id, key: plainKey, createdAt: new Date().toISOString() };
  }

  if (path.match(/^\/api\/aiclient\/apikeys\/[^/]+$/) && method === 'DELETE') {
    const id = path.split('/').pop();
    mockApiKeys = mockApiKeys.filter((k: any) => String(k.id) !== String(id));
    return null;
  }

  if (path === '/api/aiclient/identity' && method === 'GET') {
    return { ...mockAgentIdentity };
  }

  if (path === '/api/aiclient/identity' && method === 'POST') {
    mockAgentIdentity = {
      agentId: String(body.agentId || '').trim(),
      allowedUserAgentRegex: String(body.allowedUserAgentRegex || '.*'),
    };
    return { ...mockAgentIdentity };
  }

  if (path === '/api/aiclient/agents' && method === 'GET') {
    return [{ agentId: mockAgentIdentity.agentId, allowedUserAgentRe: mockAgentIdentity.allowedUserAgentRegex }];
  }

  if (path === '/api/aiclient/agents' && method === 'POST') {
    mockAgentIdentity = {
      agentId: String(body.agentId || '').trim(),
      allowedUserAgentRegex: String(body.allowedUserAgentRe || '.*'),
    };
    return { agentId: mockAgentIdentity.agentId, allowedUserAgentRe: mockAgentIdentity.allowedUserAgentRegex };
  }

  if (path === '/api/aiclient/usage/by-domain') {
    return demoUsageByDomain;
  }

  if (path === '/api/aiclient/usage/by-day') {
    return demoUsageByDay;
  }

  if (path === '/api/publisher/payouts') {
    return {
      summary: { revenueMicros: demoPublisherOverview.kpis.revenueMicros, methodStatus: 'Not configured' },
      history: [],
    };
  }

  if (path === '/api/tokens' && method === 'POST') {
    return {
      token: `demo-token-${Math.random().toString(36).slice(2, 12)}`,
      priceMicros: 100000,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      domain: 'demo.local',
      path: '/premium/demo',
      license: body.license || 'SUMMARY',
    };
  }

  if (path === '/api/demo/seed' && method === 'POST') {
    return { publisherId: 1, domainId: 101, aiClientId: 1, sampleContent: ['/premium/story-1', '/premium/story-2'] };
  }

  if (path === '/api/demo/simulate-transaction' && method === 'POST') {
    return {
      txId: `demo_tx_${randomId()}`,
      domainId: body.domainId || 101,
      path: body.path || '/premium/story-1',
      licenseType: body.licenseType || 'SUMMARY',
      publisherAmountMicros: body.licenseType === 'DISPLAY' ? 500000 : 150000,
      createdAt: new Date().toISOString(),
    };
  }

  if (path === '/api/demo/generate-logs' && method === 'POST') {
    return { success: true };
  }

  return null;
};

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const demoSecret = process.env.NEXT_PUBLIC_DEMO_SECRET;
  if (path.startsWith('/api/demo') && demoSecret) {
    headers['x-demo-secret'] = demoSecret;
  }

  const isAuthPath = path === '/api/auth/login' || path === '/api/auth/signup';
  if (!isAuthPath) {
    return mockApiFetch(path, { ...init, headers });
  }

  const authBase = AUTH_SERVICE_BASE.replace(/\/+$/, '');
  const response = await fetch(`${authBase}${path}`, { ...init, headers });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'REQUEST_FAILED', message: 'Request failed' }));
    throw new ApiError(err.error || 'REQUEST_FAILED', err.message || err.error || 'Request failed', err.details);
  }

  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const isJsonResponse = contentType.includes('application/json');
  const hasContentLengthHeader = contentLength !== null;

  const isEmptyResponse =
    response.status === 204 ||
    contentLength === '0' ||
    (!hasContentLengthHeader && !isJsonResponse);

  if (isEmptyResponse || !isJsonResponse) {
    return null;
  }

  return response.json();
}

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
export const canUseDemoFallback = process.env.NEXT_PUBLIC_DEMO_FALLBACK !== 'false';

export const demoPublisherOverview = {
  kpis: {
    revenueMicros: 48250000,
    requests30d: 312,
    activeDomains: 2,
    topAIClient: 'research-bot-v2',
  },
  checklist: [
    { key: 'domain', label: 'Add domain', done: true },
    { key: 'verify', label: 'Verify domain (DNS token)', done: true },
    { key: 'subdomain', label: 'Configure paid-access subdomain', done: true },
    { key: 'pricing', label: 'Set pricing + activate licenses', done: true },
    { key: 'integrations', label: '(Optional) Enable integrations/log forwarding', done: false },
  ],
  recentTransactions: [
    {
      id: 'tx_demo_1',
      createdAt: '2026-02-20T16:10:00.000Z',
      aiClient: 'research-bot-v2',
      path: '/premium/weekly-roundup',
      licenseType: 'SUMMARY',
      publisherAmountMicros: 125000,
    },
    {
      id: 'tx_demo_2',
      createdAt: '2026-02-20T15:46:00.000Z',
      aiClient: 'market-assistant',
      path: '/insights/china-semiconductors',
      licenseType: 'DISPLAY',
      publisherAmountMicros: 450000,
    },
  ],
};

export const demoPublisherDomains = [
  {
    id: 101,
    name: 'ai-essays.vercel.app',
    verified: true,
    subdomainVerified: true,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 102,
    name: 'fairfetch-publisher-macro-notes.vercel.app',
    verified: true,
    subdomainVerified: true,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
];

export const demoLicenseSettings = {
  SUMMARY: { enabled: true, basePriceMicros: 100000 },
  DISPLAY: { enabled: true, basePriceMicros: 300000 },
};

export const demoPricingRules = [
  {
    id: 501,
    pathPrefix: '/',
    licenseCode: 'SUMMARY',
    priceMicros: 100000,
    isActive: true,
    domainId: 101,
    createdAt: '2026-02-20T16:10:00.000Z',
  },
  {
    id: 502,
    pathPrefix: '/premium/',
    licenseCode: 'DISPLAY',
    priceMicros: 500000,
    isActive: true,
    domainId: 101,
    createdAt: '2026-02-20T15:46:00.000Z',
  },
];

export const demoTransactions = {
  rows: [
    {
      txId: 'ff_tx_8A3D1',
      timestamp: '2026-02-20T16:10:00.000Z',
      domain: 'ai-essays.vercel.app',
      path: '/premium/weekly-roundup',
      license: 'SUMMARY',
      priceMicros: 150000,
    },
    {
      txId: 'ff_tx_8A3D0',
      timestamp: '2026-02-20T15:46:00.000Z',
      domain: 'fairfetch-publisher-macro-notes.vercel.app',
      path: '/macro/rates-vs-inflation',
      license: 'DISPLAY',
      priceMicros: 500000,
    },
  ],
  page: {
    pageSize: 25,
    hasMore: false,
    nextCursor: null,
  },
};

export const demoContentControls = [
  { id: 'ctl_1', pattern: '/private/*' },
  { id: 'ctl_2', pattern: '/members/*' },
];

export const demoApiKeys = [
  { id: 'key_1', maskedKey: 'ff_live_*****************9f32' },
  { id: 'key_2', maskedKey: 'ff_live_*****************af45' },
];

export const demoAgentIdentity = {
  agentId: 'fra_123',
  allowedUserAgentRegex: '.*',
};

export const demoUsageByDomain = [
  { domainId: '101', domain: 'ai-essays.vercel.app', requests: 92, spendMicros: 13800000 },
  { domainId: '102', domain: 'fairfetch-publisher-macro-notes.vercel.app', requests: 54, spendMicros: 16200000 },
];

export const demoUsageByDay = [
  { day: '2026-02-14', requests: 11, spend_micros: 1150000 },
  { day: '2026-02-15', requests: 16, spend_micros: 2200000 },
  { day: '2026-02-16', requests: 13, spend_micros: 1750000 },
  { day: '2026-02-17', requests: 19, spend_micros: 2600000 },
  { day: '2026-02-18', requests: 24, spend_micros: 4100000 },
  { day: '2026-02-19', requests: 20, spend_micros: 3800000 },
  { day: '2026-02-20', requests: 21, spend_micros: 4200000 },
];

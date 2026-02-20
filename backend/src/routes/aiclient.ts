import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');
const getAIClient = (userId: number) => prisma.aIClient.findUnique({ where: { userId } });
const maskKeyHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;

const parseDateFilter = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parsePageSize = (value: unknown, fallback = 25, max = 100) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
};

router.get('/me', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  return res.json(aiClient);
});

router.post('/apikeys', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const plainKey = crypto.randomBytes(32).toString('hex');
  const apiKey = await prisma.aPIKey.create({ data: { aiClientId: aiClient.id, keyHash: hashKey(plainKey) } });
  return res.status(201).json({ id: apiKey.id, key: plainKey, createdAt: apiKey.createdAt });
});

router.delete('/apikeys/:id', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const updated = await prisma.aPIKey.updateMany({ where: { id: Number(req.params.id), aiClientId: aiClient.id }, data: { revokedAt: new Date() } });
  if (!updated.count) return res.status(404).json({ error: 'API_KEY_NOT_FOUND' });
  return res.status(204).send();
});

router.post('/apikeys/:id/revoke', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  await prisma.aPIKey.updateMany({ where: { id: Number(req.params.id), aiClientId: aiClient.id }, data: { revokedAt: new Date() } });
  return res.json({ success: true });
});

router.get('/apikeys', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const keys = await prisma.aPIKey.findMany({ where: { aiClientId: aiClient.id }, orderBy: { createdAt: 'desc' } });
  return res.json(keys.map((k) => ({ id: k.id, maskedKey: maskKeyHash(k.keyHash), createdAt: k.createdAt, revokedAt: k.revokedAt })));
});

router.get('/identity', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const identity = await prisma.agentIdentity.findFirst({ where: { aiClientId: aiClient.id }, orderBy: { updatedAt: 'desc' } });
  return res.json(identity || { agentId: '', allowedUserAgentRegex: '.*' });
});

router.post('/identity', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const agentId = String(req.body?.agentId || '').trim();
  if (!agentId) return res.status(400).json({ error: 'AGENT_ID_REQUIRED' });
  const allowedUserAgentRegex = String(req.body?.allowedUserAgentRegex || '.*');
  try {
    new RegExp(allowedUserAgentRegex);
  } catch {
    return res.status(400).json({ error: 'INVALID_REGEX' });
  }
  const identity = await prisma.agentIdentity.upsert({
    where: { aiClientId_agentId: { aiClientId: aiClient.id, agentId } },
    update: { allowedUserAgentRe: allowedUserAgentRegex },
    create: { aiClientId: aiClient.id, agentId, allowedUserAgentRe: allowedUserAgentRegex },
  });
  return res.json({ id: identity.id, agentId: identity.agentId, allowedUserAgentRegex: identity.allowedUserAgentRe });
});

router.get('/usage/by-domain', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });

  const grouped = await prisma.ledgerTransaction.groupBy({
    by: ['domainId'],
    where: { aiClientId: aiClient.id },
    _count: { _all: true },
    _sum: { totalMicros: true },
    orderBy: { _sum: { totalMicros: 'desc' } },
  });
  const domains = await prisma.domain.findMany({ where: { id: { in: grouped.map((g) => g.domainId) } } });
  return res.json(grouped.map((g) => ({ domainId: g.domainId, domain: domains.find((d) => d.id === g.domainId)?.name || 'Unknown', requests: g._count._all, spendMicros: g._sum.totalMicros || 0 })));
});

router.get('/usage/by-day', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });

  const byDay = await prisma.$queryRaw<Array<{ day: string; spend_micros: number; requests: number }>>`
    SELECT DATE("createdAt")::text AS day,
           COALESCE(SUM("totalMicros"),0)::int as spend_micros,
           COUNT(*)::int as requests
    FROM "LedgerTransaction"
    WHERE "aiClientId" = ${aiClient.id}
    GROUP BY DATE("createdAt")
    ORDER BY day DESC
    LIMIT 30
  `;
  return res.json(byDay);
});


router.get('/usage/ledger', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });

  const from = parseDateFilter(String(req.query.from || ''));
  const to = parseDateFilter(String(req.query.to || ''));
  const domainFilter = String(req.query.domain || '').trim();
  const licenseFilter = String(req.query.licenseType || '').trim().toUpperCase();
  const cursor = String(req.query.cursor || '');
  const pageSize = parsePageSize(req.query.pageSize, 25, 100);

  const rows = await prisma.ledgerTransaction.findMany({
    where: {
      aiClientId: aiClient.id,
      createdAt: { gte: from, lte: to },
      ...(domainFilter ? { domain: { name: { contains: domainFilter, mode: 'insensitive' } } } : {}),
      ...(licenseFilter === 'SUMMARY' || licenseFilter === 'DISPLAY' ? { licenseType: licenseFilter as 'SUMMARY' | 'DISPLAY' } : {}),
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { domain: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: pageSize + 1,
  });

  const hasMore = rows.length > pageSize;
  const pageRows = hasMore ? rows.slice(0, pageSize) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.id || null : null;

  const totals = await prisma.ledgerTransaction.aggregate({
    where: {
      aiClientId: aiClient.id,
      createdAt: { gte: from, lte: to },
      ...(domainFilter ? { domain: { name: { contains: domainFilter, mode: 'insensitive' } } } : {}),
      ...(licenseFilter === 'SUMMARY' || licenseFilter === 'DISPLAY' ? { licenseType: licenseFilter as 'SUMMARY' | 'DISPLAY' } : {}),
    },
    _sum: { totalMicros: true },
  });

  return res.json({
    rows: pageRows.map((row) => ({
      txId: row.id,
      timestamp: row.createdAt,
      domain: row.domain.name,
      path: row.path,
      license: row.licenseType,
      priceMicros: row.totalMicros,
    })),
    summary: {
      runningSpendMicros: pageRows.reduce((sum, row) => sum + row.totalMicros, 0),
      totalSpendMicros: totals._sum.totalMicros || 0,
    },
    page: {
      pageSize,
      hasMore,
      nextCursor,
    },
  });
});

router.get('/usage-spend', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const [byDomain, byDay] = await Promise.all([
    prisma.ledgerTransaction.groupBy({ by: ['domainId'], where: { aiClientId: aiClient.id }, _count: { _all: true }, _sum: { totalMicros: true } }),
    prisma.$queryRaw<Array<{ day: string; spend_micros: number }>>`
      SELECT DATE("createdAt")::text AS day, COALESCE(SUM("totalMicros"),0)::int as spend_micros
      FROM "LedgerTransaction"
      WHERE "aiClientId" = ${aiClient.id}
      GROUP BY DATE("createdAt")
      ORDER BY day DESC
      LIMIT 30
    `,
  ]);
  const domains = await prisma.domain.findMany({ where: { id: { in: byDomain.map((d) => d.domainId) } } });
  return res.json({ byDomain: byDomain.map((row) => ({ domainId: row.domainId, domain: domains.find((d) => d.id === row.domainId)?.name || 'Unknown', requests: row._count._all, spendMicros: row._sum.totalMicros || 0 })), byDay });
});

router.get('/agents', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const identity = await prisma.agentIdentity.findMany({ where: { aiClientId: aiClient.id } });
  return res.json(identity);
});

router.post('/agents', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AICLIENT_NOT_FOUND' });
  const agentId = String(req.body?.agentId || '').trim();
  if (!agentId) return res.status(400).json({ error: 'AGENT_ID_REQUIRED' });
  const regex = String(req.body?.allowedUserAgentRe || '.*');
  try {
    new RegExp(regex);
  } catch {
    return res.status(400).json({ error: 'INVALID_REGEX' });
  }
  const identity = await prisma.agentIdentity.upsert({
    where: { aiClientId_agentId: { aiClientId: aiClient.id, agentId } },
    update: { allowedUserAgentRe: regex },
    create: { aiClientId: aiClient.id, agentId, allowedUserAgentRe: regex },
  });
  return res.json(identity);
});

export default router;

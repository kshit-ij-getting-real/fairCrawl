import { Router } from 'express';
import crypto from 'crypto';
import { AccessType } from '@prisma/client';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

const getAIClient = (userId: number) => prisma.aIClient.findUnique({ where: { userId } });

const buildUsageSummary = async (aiClientId: number) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [overall, paid, last7Days, last30Days, topDomainsRaw] = await Promise.all([
    prisma.readEvent.aggregate({
      where: { aiClientId },
      _count: { _all: true },
      _sum: { priceMicros: true },
    }),
    prisma.readEvent.aggregate({
      where: { aiClientId, accessType: AccessType.PAID },
      _count: { _all: true },
      _sum: { priceMicros: true },
    }),
    prisma.readEvent.aggregate({
      where: { aiClientId, createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
      _sum: { priceMicros: true },
    }),
    prisma.readEvent.aggregate({
      where: { aiClientId, createdAt: { gte: thirtyDaysAgo } },
      _count: { _all: true },
      _sum: { priceMicros: true },
    }),
    prisma.readEvent.groupBy({
      by: ['domainId'],
      where: { aiClientId },
      _count: { _all: true },
      _sum: { priceMicros: true },
      orderBy: { _sum: { priceMicros: 'desc' } },
      take: 5,
    }),
  ]);

  const domainIds = topDomainsRaw.map((row) => row.domainId);
  const domains = domainIds.length ? await prisma.domain.findMany({ where: { id: { in: domainIds } } }) : [];

  const topDomains = topDomainsRaw.map((row) => ({
    domainId: row.domainId,
    domainName: domains.find((d) => d.id === row.domainId)?.name || 'Unknown',
    reads: row._count._all || 0,
    spendMicros: row._sum.priceMicros || 0,
  }));

  return {
    totalReads: overall._count._all || 0,
    totalSpendMicros: overall._sum.priceMicros || 0,
    paidReads: paid._count._all || 0,
    paidSpendMicros: paid._sum.priceMicros || 0,
    last7Days: { reads: last7Days._count._all || 0, spendMicros: last7Days._sum.priceMicros || 0 },
    last30Days: { reads: last30Days._count._all || 0, spendMicros: last30Days._sum.priceMicros || 0 },
    topDomains,
  };
};

router.get('/me', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    return res.json(aiClient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.post('/apikeys', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const plainKey = crypto.randomBytes(32).toString('base64');
    const keyHash = hashKey(plainKey);
    const apiKey = await prisma.aPIKey.create({ data: { aiClientId: aiClient.id, keyHash } });
    return res.json({ id: apiKey.id, key: plainKey, createdAt: apiKey.createdAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create API key' });
  }
});

router.post('/apikeys/:id/revoke', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const id = Number(req.params.id);
    await prisma.aPIKey.updateMany({ where: { id, aiClientId: aiClient.id }, data: { revokedAt: new Date() } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

router.get('/read-events', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const events = await prisma.readEvent.findMany({
      where: { aiClientId: aiClient.id },
      include: { domain: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return res.json(
      events.map((event) => ({
        id: event.id,
        domainId: event.domainId,
        domain: event.domain?.name || 'Unknown',
        url: event.url,
        path: event.path,
        accessType: event.accessType,
        priceMicros: event.priceMicros,
        createdAt: event.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load read events' });
  }
});

router.get('/usage-summary', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const summary = await buildUsageSummary(aiClient.id);
    return res.json(summary);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load summary' });
  }
});

router.get('/usage', async (req: AuthRequest, res) => {
  try {
    const aiClient = await getAIClient(req.user!.id);
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const summary = await buildUsageSummary(aiClient.id);
    return res.json({
      totalRequests: summary.totalReads,
      usageByDomain: summary.topDomains.map((domain) => ({
        domain: domain.domainName,
        requests: domain.reads,
        spend: domain.spendMicros / 1_000_000,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load usage' });
  }
});

export default router;

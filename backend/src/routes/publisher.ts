import { Router } from 'express';
import { AccessType } from '@prisma/client';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const domainOwnedBy = async (domainId: number, publisherId: number) => {
  return prisma.domain.findFirst({ where: { id: domainId, publisherId }, include: { policies: true } });
};

const deriveAccessType = (body: any): AccessType => {
  if (body.accessType && ['OPEN', 'PAID', 'BLOCKED'].includes(body.accessType)) {
    return body.accessType as AccessType;
  }
  if (body.allowAI === false) return AccessType.BLOCKED;
  const legacyPrice = body.pricePer1k ? Number(body.pricePer1k) : 0;
  if (legacyPrice > 0) return AccessType.PAID;
  return AccessType.OPEN;
};

const normalizeRulePayload = (body: any) => {
  const pattern = body.pattern || body.pathPattern;
  if (!pattern || typeof pattern !== 'string') {
    throw new Error('Path pattern is required');
  }

  const accessType = deriveAccessType(body);
  const rawPriceMicros = body.priceMicros !== undefined ? Number(body.priceMicros) : undefined;
  const legacyPricePer1k = body.pricePer1k !== undefined ? Number(body.pricePer1k) : undefined;
  const priceMicrosFromLegacy = legacyPricePer1k !== undefined ? Math.max(0, Math.round(legacyPricePer1k * 10000)) : undefined;
  let priceMicros = rawPriceMicros ?? priceMicrosFromLegacy ?? 0;
  if (accessType !== AccessType.PAID) {
    priceMicros = 0;
  }
  if (accessType === AccessType.PAID && (!priceMicros || priceMicros <= 0)) {
    throw new Error('Paid rules require a price');
  }

  const pricePer1k = Math.round((priceMicros || 0) / 10000);
  const maxRps = body.maxRps !== undefined && body.maxRps !== null ? Number(body.maxRps) : null;

  return {
    pathPattern: pattern,
    accessType,
    allowAI: accessType !== AccessType.BLOCKED,
    priceMicros,
    pricePer1k,
    maxRps,
  };
};

const createRuleHandler = async (req: AuthRequest, res: any) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    let payload;
    try {
      payload = normalizeRulePayload(req.body || {});
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Invalid rule payload' });
    }

    const rule = await prisma.aIPolicy.create({
      data: {
        domainId: domain.id,
        ...payload,
      },
    });

    return res.json(rule);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create rule' });
  }
};

router.get('/domains/:domainId/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { userId: req.user!.id },
    });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Domain name required' });
    const domain = await prisma.domain.create({ data: { name, publisherId: publisher.id } });
    return res.json(domain);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create domain' });
  }
});

router.get('/domains', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { userId: req.user!.userId },
      include: { domains: { include: { policies: true } } },
    });
    return res.json(publisher?.domains || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to list domains' });
  }
});

router.post('/domains/:domainId/rules', createRuleHandler);
router.post('/domains/:domainId/policies', createRuleHandler);

router.get('/domains/:domainId/rules', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const policies = await prisma.aIPolicy.findMany({
      where: { domainId: domain.id },
      orderBy: { pathPattern: 'asc' },
    });
    return res.json(policies);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load rules' });
  }
});

router.get('/domains/:domainId/verification-token', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });
    return res.json({ token: domain.verifyToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get token' });
  }
});

router.get('/domains/:domainId/read-events', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const events = await prisma.readEvent.findMany({
      where: { domainId: domain.id },
      include: { aiClient: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return res.json(
      events.map((event) => ({
        id: event.id,
        url: event.url,
        path: event.path,
        pathPattern: event.pathPattern,
        accessType: event.accessType,
        priceMicros: event.priceMicros,
        bytes: event.bytes,
        createdAt: event.createdAt,
        aiClient: { id: event.aiClientId, name: event.aiClient?.name || 'Unknown' },
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load read events' });
  }
});

router.get('/domains/:domainId/earnings-summary', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [overall, paid, last7Days, last30Days, topClientsRaw] = await Promise.all([
      prisma.readEvent.aggregate({
        where: { domainId: domain.id },
        _count: { _all: true },
        _sum: { priceMicros: true },
      }),
      prisma.readEvent.aggregate({
        where: { domainId: domain.id, accessType: AccessType.PAID },
        _count: { _all: true },
        _sum: { priceMicros: true },
      }),
      prisma.readEvent.aggregate({
        where: { domainId: domain.id, createdAt: { gte: sevenDaysAgo } },
        _count: { _all: true },
        _sum: { priceMicros: true },
      }),
      prisma.readEvent.aggregate({
        where: { domainId: domain.id, createdAt: { gte: thirtyDaysAgo } },
        _count: { _all: true },
        _sum: { priceMicros: true },
      }),
      prisma.readEvent.groupBy({
        by: ['aiClientId'],
        where: { domainId: domain.id },
        _count: { _all: true },
        _sum: { priceMicros: true },
        orderBy: { _sum: { priceMicros: 'desc' } },
        take: 5,
      }),
    ]);

    const clientIds = topClientsRaw.map((row) => row.aiClientId);
    const clients = clientIds.length
      ? await prisma.aIClient.findMany({ where: { id: { in: clientIds } } })
      : [];

    const topClients = topClientsRaw.map((row) => ({
      aiClientId: row.aiClientId,
      name: clients.find((c) => c.id === row.aiClientId)?.name || 'Unknown',
      reads: row._count._all || 0,
      earningsMicros: row._sum.priceMicros || 0,
    }));

    return res.json({
      totalReads: overall._count._all || 0,
      totalEarningsMicros: overall._sum.priceMicros || 0,
      paidReads: paid._count._all || 0,
      paidEarningsMicros: paid._sum.priceMicros || 0,
      last7Days: {
        reads: last7Days._count._all || 0,
        earningsMicros: last7Days._sum.priceMicros || 0,
      },
      last30Days: {
        reads: last30Days._count._all || 0,
        earningsMicros: last30Days._sum.priceMicros || 0,
      },
      topClients,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load summary' });
  }
});

router.post('/domains/:domainId/verify', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const url = `https://${domain.name}/.well-known/fairmarket-verification.txt`;
    const response = await fetch(url).catch(() => null);
    if (!response || !response.ok) {
      return res.status(400).json({ error: 'Verification file not accessible' });
    }
    const text = await response.text();
    if (text.trim() !== domain.verifyToken) {
      return res.status(400).json({ error: 'Token mismatch' });
    }
    await prisma.domain.update({ where: { id: domain.id }, data: { verified: true } });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

router.get('/domains/:domainId/analytics', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const total = await prisma.requestLog.aggregate({
      where: { domainId: domain.id },
      _count: { _all: true },
      _sum: { bytesSent: true },
    });

    const topClientsRaw = await prisma.requestLog.groupBy({
      by: ['aiClientId'],
      where: { domainId: domain.id },
      _count: { aiClientId: true },
      orderBy: { _count: { aiClientId: 'desc' } },
      take: 5,
    });

    const clientIds = topClientsRaw.map((c) => c.aiClientId);
    const clients = await prisma.aIClient.findMany({ where: { id: { in: clientIds } } });
    const topClients = topClientsRaw.map((row) => ({
      aiClientId: row.aiClientId,
      requests: row._count.aiClientId,
      name: clients.find((c) => c.id === row.aiClientId)?.name || 'Unknown',
    }));

    const firstPolicy = domain.policies[0];
    const priceMicros = firstPolicy ? firstPolicy.priceMicros ?? firstPolicy.pricePer1k * 10000 : 0;
    const estimatedRevenue = ((total._count._all || 0) / 1000) * (priceMicros / 1_000_000);

    return res.json({
      totalRequests,
      totalBytes,
      topClients,
      estimatedRevenue,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

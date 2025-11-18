import { Router } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const domainOwnedBy = async (domainId: number, publisherId: number) => {
  return prisma.domain.findFirst({ where: { id: domainId, publisherId }, include: { policies: true } });
};

router.get('/me', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { userId: req.user!.userId },
      include: { domains: { include: { policies: true } } },
    });
    return res.json(publisher);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.get('/sites', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.json({ sites: [] });

    const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id } });

    if (domains.length === 0) {
      return res.json({ sites: [] });
    }

    const stats = await prisma.readEvent.groupBy({
      by: ['domainId'],
      where: { domainId: { in: domains.map((d) => d.id) } },
      _count: { _all: true },
      _sum: { priceMicros: true },
    });

    const statsByDomain: Record<number, { reads: number; earnedMicros: number }> = {};
    for (const row of stats) {
      statsByDomain[row.domainId] = {
        reads: row._count._all,
        earnedMicros: row._sum.priceMicros || 0,
      };
    }

    const sites = domains.map((d) => {
      const s = statsByDomain[d.id] || { reads: 0, earnedMicros: 0 };
      return {
        id: d.id,
        host: d.name,
        status: d.verified ? 'verified' : 'not_verified',
        totalReads: s.reads,
        earnedUsd: s.earnedMicros / 1_000_000,
      };
    });

    return res.json({ sites });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load sites' });
  }
});

router.post('/domains', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
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

router.post('/domains/:domainId/policies', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const { pathPattern, allowAI, pricePer1k, maxRps } = req.body;
    if (!pathPattern || allowAI === undefined || pricePer1k === undefined) {
      return res.status(400).json({ error: 'Missing policy fields' });
    }

    const policy = await prisma.aIPolicy.create({
      data: { domainId: domain.id, pathPattern, allowAI, pricePer1k: Number(pricePer1k), maxRps: maxRps ? Number(maxRps) : null },
    });

    return res.json(policy);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create policy' });
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

router.post('/domains/:domainId/verify', async (req: AuthRequest, res) => {
  try {
    const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.userId } });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const url = `https://${domain.name}/.well-known/faircrawl-verification.txt`;
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
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 5,
    });

    const clientIds = topClientsRaw.map((c) => c.aiClientId);
    const clients = await prisma.aIClient.findMany({ where: { id: { in: clientIds } } });
    const topClients = topClientsRaw.map((row) => ({
      aiClientId: row.aiClientId,
      requests: row._count._all,
      name: clients.find((c) => c.id === row.aiClientId)?.name || 'Unknown',
    }));

    const price = domain.policies[0]?.pricePer1k || 0;
    const estimatedRevenue = ((total._count._all || 0) * price) / 1000;

    return res.json({
      totalRequests: total._count._all || 0,
      totalBytes: total._sum.bytesSent || 0,
      topClients,
      estimatedRevenue,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

router.get('/me', async (req: AuthRequest, res) => {
  try {
    const aiClient = await prisma.aIClient.findUnique({ where: { userId: req.user!.userId } });
    return res.json(aiClient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.post('/apikeys', async (req: AuthRequest, res) => {
  try {
    const aiClient = await prisma.aIClient.findUnique({ where: { userId: req.user!.userId } });
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

router.get('/apikeys', async (req: AuthRequest, res) => {
  try {
    const aiClient = await prisma.aIClient.findUnique({
      where: { userId: req.user!.userId },
      include: { apiKeys: true },
    });
    return res.json(aiClient?.apiKeys || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to list keys' });
  }
});

router.post('/apikeys/:id/revoke', async (req: AuthRequest, res) => {
  try {
    const aiClient = await prisma.aIClient.findUnique({ where: { userId: req.user!.userId } });
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
    const id = Number(req.params.id);
    await prisma.aPIKey.updateMany({ where: { id, aiClientId: aiClient.id }, data: { revokedAt: new Date() } });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to revoke key' });
  }
});

router.get('/usage', async (req: AuthRequest, res) => {
  try {
    const aiClient = await prisma.aIClient.findUnique({ where: { userId: req.user!.userId } });
    if (!aiClient) return res.status(404).json({ error: 'AI client not found' });

    const stats = await prisma.readEvent.groupBy({
      by: ['domainId'],
      where: { clientId: aiClient.id },
      _count: { _all: true },
      _sum: { priceMicros: true },
      _max: { createdAt: true },
    });

    const domainIds = stats.map((s) => s.domainId);
    const domains = await prisma.domain.findMany({ where: { id: { in: domainIds } } });
    const domainById = Object.fromEntries(domains.map((d) => [d.id, d]));

    const usage = stats.map((s) => ({
      domainId: s.domainId,
      domain: domainById[s.domainId]?.name || 'Unknown',
      reads: s._count._all,
      spendUsd: (s._sum.priceMicros || 0) / 1_000_000,
      lastSeen: s._max.createdAt,
    }));

    const totalReads = stats.reduce((sum, s) => sum + s._count._all, 0);
    const totalSpendUsd = stats.reduce((sum, s) => sum + (s._sum.priceMicros || 0), 0) / 1_000_000;

    return res.json({ totalReads, totalSpendUsd, usage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load usage' });
  }
});

export default router;

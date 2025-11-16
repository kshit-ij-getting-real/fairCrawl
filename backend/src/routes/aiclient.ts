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

    const totals = await prisma.requestLog.groupBy({
      by: ['domainId'],
      where: { aiClientId: aiClient.id },
      _count: { _all: true },
    });

    const domainIds = totals.map((t) => t.domainId);
    const domains = await prisma.domain.findMany({ where: { id: { in: domainIds } } });

    const usageByDomain = totals.map((row) => ({
      domain: domains.find((d) => d.id === row.domainId)?.name || 'Unknown',
      requests: row._count._all,
    }));

    const totalRequests = totals.reduce((sum, row) => sum + row._count._all, 0);

    return res.json({ totalRequests, usageByDomain });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load usage' });
  }
});

export default router;

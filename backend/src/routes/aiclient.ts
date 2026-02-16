import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');
const getAIClient = (userId: number) => prisma.aIClient.findUnique({ where: { userId } });

router.get('/me', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  return res.json(aiClient);
});

router.post('/apikeys', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
  const plainKey = crypto.randomBytes(32).toString('base64');
  const apiKey = await prisma.aPIKey.create({ data: { aiClientId: aiClient.id, keyHash: hashKey(plainKey) } });
  return res.json({ id: apiKey.id, key: plainKey, createdAt: apiKey.createdAt });
});

router.post('/apikeys/:id/revoke', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
  await prisma.aPIKey.updateMany({ where: { id: Number(req.params.id), aiClientId: aiClient.id }, data: { revokedAt: new Date() } });
  return res.json({ success: true });
});

router.get('/apikeys', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
  const keys = await prisma.aPIKey.findMany({ where: { aiClientId: aiClient.id }, orderBy: { createdAt: 'desc' } });
  return res.json(keys);
});

router.get('/agents', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
  const agents = await prisma.agentIdentity.findMany({ where: { aiClientId: aiClient.id }, orderBy: { createdAt: 'desc' } });
  return res.json(agents);
});

router.post('/agents', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });
  const agent = await prisma.agentIdentity.upsert({
    where: { aiClientId_agentId: { aiClientId: aiClient.id, agentId: String(req.body.agentId) } },
    update: { allowedUserAgentRe: String(req.body.allowedUserAgentRe || '.*') },
    create: {
      aiClientId: aiClient.id,
      agentId: String(req.body.agentId),
      allowedUserAgentRe: String(req.body.allowedUserAgentRe || '.*'),
    },
  });
  return res.json(agent);
});

router.get('/usage-spend', async (req: AuthRequest, res) => {
  const aiClient = await getAIClient(req.user!.id);
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });

  const byDomain = await prisma.ledgerTransaction.groupBy({
    by: ['domainId'],
    where: { aiClientId: aiClient.id },
    _sum: { totalMicros: true },
    _count: { _all: true },
    orderBy: { _sum: { totalMicros: 'desc' } },
  });
  const domains = await prisma.domain.findMany({ where: { id: { in: byDomain.map((d) => d.domainId) } } });

  const byDay = await prisma.$queryRaw<Array<{ day: string; spend_micros: number }>>`
    SELECT DATE("createdAt")::text AS day, COALESCE(SUM("totalMicros"),0)::int as spend_micros
    FROM "LedgerTransaction"
    WHERE "aiClientId" = ${aiClient.id}
    GROUP BY DATE("createdAt")
    ORDER BY day DESC
    LIMIT 30
  `;

  return res.json({
    byDomain: byDomain.map((row) => ({
      domainId: row.domainId,
      domain: domains.find((d) => d.id === row.domainId)?.name || 'Unknown',
      requests: row._count._all,
      spendMicros: row._sum.totalMicros || 0,
    })),
    byDay,
  });
});

export default router;

import { Router } from 'express';
import crypto from 'crypto';
import { LicenseType } from '@prisma/client';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { resolvePrice } from '../services/pricing';

const router = Router();

const assertDemoAccess = (req: AuthRequest, res: any) => {
  if (process.env.DEMO_MODE !== 'true') {
    res.status(403).json({ error: 'Demo mode disabled' });
    return false;
  }
  if (req.header('x-demo-secret') !== process.env.DEMO_SECRET) {
    res.status(401).json({ error: 'Invalid demo secret' });
    return false;
  }
  return true;
};

router.post('/seed', async (req: AuthRequest, res) => {
  if (!assertDemoAccess(req, res)) return;
  const publisher = await prisma.publisher.findUnique({ where: { userId: req.user!.id } });
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });

  const aiUser = await prisma.user.create({ data: { email: `demo-ai-${Date.now()}@fairfetch.dev`, passwordHash: 'demo', role: 'AICLIENT' } });
  const aiClient = await prisma.aIClient.create({ data: { userId: aiUser.id, name: 'Demo AI Team' } });
  const domain = await prisma.domain.create({ data: { publisherId: publisher.id, name: `demo-${Date.now()}.fairfetch.test`, verified: true, subdomainHost: 'paid.demo.fairfetch.test', subdomainCnameTarget: 'fetch.demo.fairfetch.test' } });
  const keyValue = crypto.randomBytes(24).toString('hex');
  const keyHash = crypto.createHash('sha256').update(keyValue).digest('hex');
  const apiKey = await prisma.aPIKey.create({ data: { aiClientId: aiClient.id, keyHash } });
  await prisma.agentIdentity.create({ data: { aiClientId: aiClient.id, agentId: 'demo-agent', allowedUserAgentRe: 'DemoBot/.*' } });

  const summaryLicense = await prisma.license.upsert({ where: { domainId_code: { domainId: domain.id, code: 'SUMMARY' } }, create: { domainId: domain.id, code: 'SUMMARY', terms: 'No training usage allowed.' }, update: { terms: 'No training usage allowed.' } });
  await prisma.pricingRule.createMany({ data: [
    { domainId: domain.id, scope: 'GLOBAL', licenseId: summaryLicense.id, licenseType: 'SUMMARY', priceMicros: 120000, enabled: true, priority: 500 },
    { domainId: domain.id, scope: 'PAGE', pathPattern: '/premium/story-1', licenseType: 'SUMMARY', priceMicros: 220000, enabled: true, priority: 50 },
  ] });

  return res.json({ publisherId: publisher.id, domainId: domain.id, aiClientId: aiClient.id, apiKey: keyValue, agentId: 'demo-agent', sampleContent: ['/premium/story-1', '/premium/story-2'] });
});

router.post('/simulate-transaction', async (req: AuthRequest, res) => {
  if (!assertDemoAccess(req, res)) return;
  const domainId = Number(req.body?.domainId);
  const path = String(req.body?.path || '/premium/story-1');
  const licenseType = (String(req.body?.licenseType || 'SUMMARY').toUpperCase() === 'DISPLAY' ? 'DISPLAY' : 'SUMMARY') as LicenseType;

  const domain = await prisma.domain.findUnique({ where: { id: domainId }, include: { pricingRules: true } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });

  const aiClient = await prisma.aIClient.findFirst({ orderBy: { createdAt: 'desc' } });
  if (!aiClient) return res.status(404).json({ error: 'AI client not found' });

  const resolved = resolvePrice({ rules: domain.pricingRules, path, fullUrl: `https://${domain.name}${path}`, userAgent: 'DemoBot/1.0', licenseType });
  if (resolved.priceMicros < 0) return res.status(403).json({ error: 'No matching rate' });

  const tx = await prisma.ledgerTransaction.create({
    data: {
      aiClientId: aiClient.id,
      domainId: domain.id,
      idempotencyKey: `demo:${Date.now()}:${Math.random()}`,
      source: 'DEMO',
      url: `https://${domain.name}${path}`,
      path,
      licenseType,
      format: 'MARKDOWN',
      publisherAmountMicros: resolved.priceMicros,
      platformFeeMicros: Math.round(resolved.priceMicros * 0.1),
      totalMicros: resolved.priceMicros + Math.round(resolved.priceMicros * 0.1),
      matchedRuleId: resolved.ruleId || undefined,
    },
  });

  const byDay = await prisma.$queryRaw<Array<{ day: string; spend_micros: number }>>`
    SELECT DATE("createdAt")::text AS day, COALESCE(SUM("totalMicros"),0)::int as spend_micros
    FROM "LedgerTransaction"
    WHERE "aiClientId" = ${aiClient.id}
    GROUP BY DATE("createdAt")
    ORDER BY day DESC
    LIMIT 30
  `;

  return res.json({ receipt: { transaction_id: tx.id, price_micros: tx.publisherAmountMicros, timestamp: tx.createdAt }, aggregates: { byDay } });
});

router.post('/reset', async (req: AuthRequest, res) => {
  if (!assertDemoAccess(req, res)) return;
  await prisma.ledgerTransaction.deleteMany({ where: { source: 'DEMO' } });
  return res.json({ reset: true });
});

router.post('/generate-logs', async (req: AuthRequest, res) => {
  if (!assertDemoAccess(req, res)) return;
  return res.json({ generated: true });
});

export default router;

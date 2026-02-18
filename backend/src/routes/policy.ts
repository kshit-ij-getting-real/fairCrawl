import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/ai-policy', async (req, res) => {
  const { domain } = req.query as { domain?: string };
  if (!domain) return res.status(400).json({ error: 'domain query required' });
  const domainRecord = await prisma.domain.findUnique({
    where: { name: domain },
    include: { policies: true },
  });
  if (!domainRecord) return res.status(404).json({ error: 'Domain not found' });
  return res.json({
    domain: domainRecord.name,
    allow_ai: domainRecord.policies.some((p) => p.allowAI),
    policies: domainRecord.policies.map((p) => ({
      path_pattern: p.pathPattern,
      allow_ai: p.allowAI,
      access_type: p.accessType,
      price_micros: p.priceMicros,
      price_per_1000_requests_cents: p.pricePer1k,
      max_rps: p.maxRps,
    })),
  });
});

router.get('/public/domains', async (_req, res) => {
  const domains = await prisma.domain.findMany({
    where: { verified: true },
    include: { policies: true, publisher: true },
    take: 20,
  });
  return res.json(
    domains.map((d) => ({
      name: d.name,
      publisher: d.publisher.name,
      policies: d.policies.map((p) => ({
        pathPattern: p.pathPattern,
        allowAI: p.allowAI,
        accessType: p.accessType,
        pricePer1k: p.pricePer1k,
        priceMicros: p.priceMicros,
      })),
    }))
  );
});

export default router;

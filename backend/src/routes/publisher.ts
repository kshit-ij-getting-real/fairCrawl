import { Router } from 'express';
import { PriceRuleScope } from '@prisma/client';
import dns from 'dns/promises';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const getPublisher = async (userId: number) => prisma.publisher.findUnique({ where: { userId } });

router.post('/domains', async (req: AuthRequest, res) => {
  try {
    const publisher = await getPublisher(req.user!.id);
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
    const name = String(req.body?.name || '').toLowerCase().trim();
    if (!name) return res.status(400).json({ error: 'Domain name required' });
    const domain = await prisma.domain.create({
      data: {
        publisherId: publisher.id,
        name,
        subdomainHost: `fairfetch.${name}`,
        subdomainCnameTarget: 'edge.fairfetch.com',
      },
    });
    return res.json(domain);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create domain' });
  }
});

router.get('/domains', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
  const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id }, orderBy: { createdAt: 'desc' } });
  return res.json(domains);
});

router.get('/domains/:domainId/verification-token', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
  const domain = await prisma.domain.findFirst({ where: { id: Number(req.params.domainId), publisherId: publisher.id } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  return res.json({
    token: domain.verifyToken,
    txt_record_name: `_fairfetch-verify.${domain.name}`,
    txt_record_value: domain.verifyToken,
    cname_host: domain.subdomainHost,
    cname_target: domain.subdomainCnameTarget,
  });
});

router.post('/domains/:domainId/verify-dns', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
  const domain = await prisma.domain.findFirst({ where: { id: Number(req.params.domainId), publisherId: publisher.id } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });

  const txtName = `_fairfetch-verify.${domain.name}`;
  const records = await dns.resolveTxt(txtName).catch(() => [] as string[][]);
  const flattened = records.flat().join(' ');
  if (!flattened.includes(domain.verifyToken)) {
    return res.status(400).json({ verified: false, reason: 'TXT token not found' });
  }

  await prisma.domain.update({ where: { id: domain.id }, data: { verified: true } });
  return res.json({ verified: true });
});

router.get('/domains/:domainId/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
  const domainId = Number(req.params.domainId);
  const domain = await prisma.domain.findFirst({ where: { id: domainId, publisherId: publisher.id } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  const rules = await prisma.pricingRule.findMany({ where: { domainId }, orderBy: [{ scope: 'asc' }, { priority: 'asc' }] });
  return res.json(rules);
});

router.post('/domains/:domainId/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });
  const domainId = Number(req.params.domainId);
  const domain = await prisma.domain.findFirst({ where: { id: domainId, publisherId: publisher.id } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });

  const rule = await prisma.pricingRule.create({
    data: {
      domainId,
      scope: (req.body.scope as PriceRuleScope) || 'DIRECTORY',
      pathPattern: req.body.pathPattern || null,
      exactUrl: req.body.exactUrl || null,
      userAgentRegex: req.body.userAgentRegex || null,
      keywordExpression: req.body.keywordExpression || null,
      freshnessWindowMins: req.body.freshnessWindowMins || null,
      licenseType: req.body.licenseType || null,
      priceMicros: Number(req.body.priceMicros || 0),
      priority: Number(req.body.priority || 100),
      enabled: req.body.enabled !== false,
    },
  });

  return res.json(rule);
});

router.get('/transactions', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return res.status(404).json({ error: 'Publisher not found' });

  const domainId = req.query.domain_id ? Number(req.query.domain_id) : undefined;
  const developerOrgId = req.query.developer_org_id ? Number(req.query.developer_org_id) : undefined;
  const licenseType = req.query.license_type ? String(req.query.license_type).toUpperCase() : undefined;
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  const domainIds = (await prisma.domain.findMany({ where: { publisherId: publisher.id }, select: { id: true } })).map((d) => d.id);
  const txs = await prisma.ledgerTransaction.findMany({
    where: {
      domainId: domainId || { in: domainIds },
      aiClientId: developerOrgId,
      licenseType: licenseType as any,
      createdAt: from || to ? { gte: from, lte: to } : undefined,
    },
    include: { domain: true, aiClient: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return res.json(txs);
});

export default router;

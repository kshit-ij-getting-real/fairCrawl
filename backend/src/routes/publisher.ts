import { Router } from 'express';
import { PriceRuleScope } from '@prisma/client';
import dns from 'dns/promises';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const errorResponse = (res: any, status: number, code: string, message: string, details?: unknown) =>
  res.status(status).json({ error: { code, message, details } });

const getPublisher = async (userId: number) => prisma.publisher.findUnique({ where: { userId } });

const toRatePayload = (rate: any) => ({
  id: rate.id,
  propertyId: rate.domainId,
  matcher: {
    exactUrl: rate.exactUrl,
    pathPrefix: rate.pathPattern,
    regex: rate.userAgentRegex,
    scope: rate.scope,
  },
  license: rate.license?.code || rate.licenseType,
  priceMicros: rate.priceMicros,
  currency: 'USD',
  enabled: rate.enabled,
  priority: rate.priority,
});

router.post('/properties', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const domain = String(req.body?.domain || '').toLowerCase().trim();
  if (!domain) return errorResponse(res, 400, 'INVALID_INPUT', 'domain is required');

  const property = await prisma.domain.create({
    data: {
      publisherId: publisher.id,
      name: domain,
      subdomainHost: `fairfetch.${domain}`,
      subdomainCnameTarget: 'edge.fairfetch.local',
    },
  });

  return res.json({
    id: property.id,
    domain: property.name,
    verificationToken: property.verifyToken,
    verificationStatus: property.verified ? 'VERIFIED' : 'PENDING',
  });
});

router.post('/properties/:id/verify-dns', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');

  const property = await prisma.domain.findFirst({ where: { id: Number(req.params.id), publisherId: publisher.id } });
  if (!property) return errorResponse(res, 404, 'PROPERTY_NOT_FOUND', 'Property not found');

  const txtName = `_fairfetch-verify.${property.name}`;
  const records = await dns.resolveTxt(txtName).catch(() => [] as string[][]);
  const flattened = records.flat().join(' ');
  if (!flattened.includes(property.verifyToken)) {
    return errorResponse(res, 400, 'DNS_TOKEN_MISMATCH', 'DNS token not found', {
      expectedToken: property.verifyToken,
      txtRecordName: txtName,
    });
  }

  await prisma.domain.update({ where: { id: property.id }, data: { verified: true } });
  return res.json({ id: property.id, verificationStatus: 'VERIFIED' });
});

router.post('/rates', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');

  const propertyId = Number(req.body?.propertyId);
  const property = await prisma.domain.findFirst({ where: { id: propertyId, publisherId: publisher.id } });
  if (!property) return errorResponse(res, 404, 'PROPERTY_NOT_FOUND', 'Property not found');

  const licenseCode = String(req.body?.licenseCode || '').toUpperCase();
  const licenseTerms = String(req.body?.licenseTerms || 'Standard license terms');
  if (!licenseCode) return errorResponse(res, 400, 'INVALID_INPUT', 'licenseCode is required');

  const license = await prisma.license.upsert({
    where: { domainId_code: { domainId: propertyId, code: licenseCode } },
    create: { domainId: propertyId, code: licenseCode, terms: licenseTerms },
    update: { terms: licenseTerms },
  });

  const rate = await prisma.pricingRule.create({
    data: {
      domainId: propertyId,
      scope: (req.body?.scope as PriceRuleScope) || 'DIRECTORY',
      exactUrl: req.body?.exactUrl || null,
      pathPattern: req.body?.pathPrefix || null,
      userAgentRegex: req.body?.regex || null,
      licenseId: license.id,
      priceMicros: Number(req.body?.priceMicros || 0),
      priority: Number(req.body?.priority || 100),
      enabled: req.body?.enabled !== false,
    },
    include: { license: true },
  });

  return res.status(201).json(toRatePayload(rate));
});

router.get('/rates', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');

  const rates = await prisma.pricingRule.findMany({
    where: { domain: { publisherId: publisher.id } },
    include: { license: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(rates.map(toRatePayload));
});

router.put('/rates/:id', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');

  const existing = await prisma.pricingRule.findFirst({
    where: { id: Number(req.params.id), domain: { publisherId: publisher.id } },
    include: { license: true },
  });
  if (!existing) return errorResponse(res, 404, 'RATE_NOT_FOUND', 'Rate not found');

  const updated = await prisma.pricingRule.update({
    where: { id: existing.id },
    data: {
      exactUrl: req.body?.exactUrl ?? existing.exactUrl,
      pathPattern: req.body?.pathPrefix ?? existing.pathPattern,
      userAgentRegex: req.body?.regex ?? existing.userAgentRegex,
      priceMicros: req.body?.priceMicros ?? existing.priceMicros,
      enabled: req.body?.enabled ?? existing.enabled,
    },
    include: { license: true },
  });

  return res.json(toRatePayload(updated));
});

router.delete('/rates/:id', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const deleted = await prisma.pricingRule.deleteMany({
    where: { id: Number(req.params.id), domain: { publisherId: publisher.id } },
  });
  if (!deleted.count) return errorResponse(res, 404, 'RATE_NOT_FOUND', 'Rate not found');
  return res.status(204).send();
});

router.get('/transactions', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');

  const domainIds = (await prisma.domain.findMany({ where: { publisherId: publisher.id }, select: { id: true } })).map((d) => d.id);
  const txs = await prisma.ledgerTransaction.findMany({
    where: { domainId: { in: domainIds } },
    include: { domain: true, aiClient: true, token: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return res.json(
    txs.map((tx) => ({
      id: tx.id,
      property: tx.domain.name,
      url: tx.url,
      priceMicros: tx.publisherAmountMicros,
      currency: tx.currency,
      aiClientId: tx.aiClientId,
      tokenId: tx.tokenId,
      createdAt: tx.createdAt,
    }))
  );
});

router.get('/webhooks', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const hooks = await prisma.publisherWebhook.findMany({ where: { domain: { publisherId: publisher.id } }, orderBy: { createdAt: 'desc' } });
  return res.json(hooks);
});

router.post('/webhooks', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const propertyId = Number(req.body?.propertyId);
  const property = await prisma.domain.findFirst({ where: { id: propertyId, publisherId: publisher.id } });
  if (!property) return errorResponse(res, 404, 'PROPERTY_NOT_FOUND', 'Property not found');

  const hook = await prisma.publisherWebhook.create({
    data: {
      domainId: property.id,
      url: String(req.body?.url || ''),
      eventType: String(req.body?.eventType || 'transaction.created'),
      secret: req.body?.secret ? String(req.body.secret) : null,
    },
  });
  return res.status(201).json(hook);
});

router.put('/webhooks/:id', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const hook = await prisma.publisherWebhook.updateMany({
    where: { id: Number(req.params.id), domain: { publisherId: publisher.id } },
    data: { active: Boolean(req.body?.active) },
  });
  if (!hook.count) return errorResponse(res, 404, 'WEBHOOK_NOT_FOUND', 'Webhook not found');
  return res.json({ updated: true });
});

router.delete('/webhooks/:id', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const deleted = await prisma.publisherWebhook.deleteMany({ where: { id: Number(req.params.id), domain: { publisherId: publisher.id } } });
  if (!deleted.count) return errorResponse(res, 404, 'WEBHOOK_NOT_FOUND', 'Webhook not found');
  return res.status(204).send();
});



router.get('/me', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  return res.json(publisher);
});

router.get('/domains', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id }, orderBy: { createdAt: 'desc' } });
  res.json(domains.map((d) => ({ ...d, subdomainVerified: Boolean(d.subdomainHost && d.subdomainCnameTarget && d.verified) })));
});

router.post('/domains', async (req: AuthRequest, res) => {
  req.body.domain = req.body.domain || req.body.name;
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const name = String(req.body?.domain || '').trim().toLowerCase();
  if (!name) return errorResponse(res, 400, 'INVALID_INPUT', 'domain is required');
  const created = await prisma.domain.create({ data: { publisherId: publisher.id, name, subdomainHost: `paid.${name}`, subdomainCnameTarget: `fetch.${name}` } });
  return res.status(201).json(created);
});

router.post('/domains/:id/demo-verify', async (req: AuthRequest, res) => {
  if (process.env.DEMO_MODE !== 'true') return errorResponse(res, 403, 'DEMO_DISABLED', 'Demo mode disabled');
  const publisher = await getPublisher(req.user!.id);
  const domain = await prisma.domain.findFirst({ where: { id: Number(req.params.id), publisherId: publisher?.id } });
  if (!domain) return errorResponse(res, 404, 'DOMAIN_NOT_FOUND', 'Domain not found');
  const updated = await prisma.domain.update({ where: { id: domain.id }, data: { verified: true } });
  return res.json(updated);
});

router.get('/overview', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorResponse(res, 404, 'PUBLISHER_NOT_FOUND', 'Publisher not found');
  const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id } });
  const domainIds = domains.map((d) => d.id);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const txs = await prisma.ledgerTransaction.findMany({ where: { domainId: { in: domainIds }, createdAt: { gte: since } }, include: { aiClient: true }, orderBy: { createdAt: 'desc' }, take: 10 });
  const topClient = txs.reduce((acc: any, tx: any) => {
    acc[tx.aiClient.name] = (acc[tx.aiClient.name] || 0) + tx.totalMicros;
    return acc;
  }, {} as Record<string, number>);
  const topAIClient = Object.entries(topClient).sort((a: any, b: any) => Number(b[1]) - Number(a[1]))[0]?.[0] || null;
  const revenueMicros = txs.reduce((sum, tx) => sum + tx.publisherAmountMicros, 0);
  const licenses = await prisma.license.findMany({ where: { domainId: { in: domainIds } } });
  const checklist = [
    { key: 'domain', label: 'Add domain', done: domains.length > 0 },
    { key: 'verify', label: 'Verify domain (DNS token)', done: domains.some((d) => d.verified) },
    { key: 'subdomain', label: 'Configure paid-access subdomain', done: domains.some((d) => Boolean(d.subdomainHost)) },
    { key: 'pricing', label: 'Set pricing + activate licenses', done: licenses.length > 0 },
    { key: 'integrations', label: '(Optional) Enable integrations/log forwarding', done: false },
  ];
  return res.json({
    kpis: { revenueMicros, requests30d: txs.length, activeDomains: domains.filter((d) => d.verified).length, topAIClient },
    checklist,
    recentTransactions: txs.map((tx) => ({ id: tx.id, createdAt: tx.createdAt, aiClient: tx.aiClient.name, path: tx.path, licenseType: tx.licenseType, publisherAmountMicros: tx.publisherAmountMicros })),
  });
});

router.get('/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const rules = await prisma.pricingRule.findMany({ where: { domain: { publisherId: publisher?.id } }, orderBy: { createdAt: 'desc' } });
  res.json(rules.map((r) => ({ id: r.id, domainId: r.domainId, type: r.scope === 'BOT' ? 'AICLIENT' : r.scope, matchValue: r.userAgentRegex || r.pathPattern || r.keywordExpression || String(r.freshnessWindowMins || ''), licenseType: r.licenseType || 'SUMMARY', priceMicros: r.priceMicros, priority: r.priority, active: r.enabled })));
});

router.post('/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domain = await prisma.domain.findFirst({ where: { id: Number(req.body.domainId), publisherId: publisher?.id } });
  if (!domain) return errorResponse(res, 404, 'DOMAIN_NOT_FOUND', 'Domain not found');
  const mapScope: Record<string, PriceRuleScope> = { AICLIENT: 'BOT', PAGE: 'PAGE', DIRECTORY: 'DIRECTORY', FRESHNESS: 'FRESHNESS', KEYWORD: 'KEYWORD', GLOBAL: 'GLOBAL' };
  const scope = mapScope[String(req.body.type)] || 'GLOBAL';
  const rule = await prisma.pricingRule.create({ data: { domainId: domain.id, scope, userAgentRegex: scope === 'BOT' ? String(req.body.matchValue || '') : null, pathPattern: scope === 'PAGE' || scope === 'DIRECTORY' ? String(req.body.matchValue || '') : null, keywordExpression: scope === 'KEYWORD' ? String(req.body.matchValue || '') : null, freshnessWindowMins: scope === 'FRESHNESS' ? Number(req.body.matchValue || 0) : null, licenseType: req.body.licenseType === 'DISPLAY' ? 'DISPLAY' : 'SUMMARY', priceMicros: Number(req.body.priceMicros || 0), enabled: Boolean(req.body.active), priority: Number(req.body.priority || 100) } });
  res.status(201).json(rule);
});

router.post('/pricing-rules/:id/activate', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const updated = await prisma.pricingRule.updateMany({ where: { id: Number(req.params.id), domain: { publisherId: publisher?.id } }, data: { enabled: true } });
  if (!updated.count) return errorResponse(res, 404, 'RULE_NOT_FOUND', 'Rule not found');
  res.json({ activated: true });
});

router.get('/license-settings', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domains = await prisma.domain.findMany({ where: { publisherId: publisher?.id }, select: { id: true } });
  const licenses = await prisma.license.findMany({ where: { domainId: { in: domains.map((d) => d.id) } } });
  const summary = licenses.find((l) => l.code === 'SUMMARY');
  const display = licenses.find((l) => l.code === 'DISPLAY');
  res.json({ SUMMARY: { enabled: Boolean(summary), basePriceMicros: 0 }, DISPLAY: { enabled: Boolean(display), basePriceMicros: 0 } });
});

router.post('/license-settings', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domain = await prisma.domain.findFirst({ where: { publisherId: publisher?.id }, orderBy: { createdAt: 'asc' } });
  if (!domain) return errorResponse(res, 404, 'DOMAIN_NOT_FOUND', 'No domain found');
  const payload = req.body || {};
  for (const code of ['SUMMARY', 'DISPLAY']) {
    if (payload?.[code]?.enabled) {
      await prisma.license.upsert({ where: { domainId_code: { domainId: domain.id, code } }, create: { domainId: domain.id, code, terms: 'No training usage allowed. Access limited to licensed inference use.' }, update: { terms: 'No training usage allowed. Access limited to licensed inference use.' } });
    }
  }
  res.json({ success: true });
});

router.post('/price-preview', async (req: AuthRequest, res) => {
  const url = String(req.body?.url || '');
  const parsed = new URL(url);
  const domain = await prisma.domain.findUnique({ where: { name: parsed.host }, include: { pricingRules: true } });
  if (!domain) return res.json({ ruleId: null, priceMicros: -1 });
  const { resolvePrice } = await import('../services/pricing');
  const out = resolvePrice({ rules: domain.pricingRules, path: parsed.pathname, fullUrl: url, userAgent: String(req.body?.aiClientId || ''), licenseType: req.body?.licenseType === 'DISPLAY' ? 'DISPLAY' : 'SUMMARY' });
  res.json(out);
});

router.get('/transactions/export', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domainIds = (await prisma.domain.findMany({ where: { publisherId: publisher?.id }, select: { id: true } })).map((d) => d.id);
  const txs = await prisma.ledgerTransaction.findMany({ where: { domainId: { in: domainIds } }, include: { aiClient: true, domain: true }, orderBy: { createdAt: 'desc' }, take: 500 });
  const lines = ['timestamp,ai_client,domain,path,license,price_micros,status,transaction_id', ...txs.map((tx) => `${tx.createdAt.toISOString()},${tx.aiClient.name},${tx.domain.name},${tx.path},${tx.licenseType},${tx.publisherAmountMicros},settled,${tx.id}`)];
  res.json({ csv: lines.join('\n') });
});

router.get('/content-controls', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const controls = await prisma.contentFilter.findMany({ where: { domain: { publisherId: publisher?.id } }, orderBy: { createdAt: 'desc' } });
  res.json(controls.map((c) => ({ id: c.id, pattern: c.blockedPathRegex || '' })));
});

router.post('/content-controls', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domain = await prisma.domain.findFirst({ where: { publisherId: publisher?.id } });
  if (!domain) return errorResponse(res, 404, 'DOMAIN_NOT_FOUND', 'No domain found');
  const created = await prisma.contentFilter.create({ data: { domainId: domain.id, blockedPathRegex: String(req.body?.pattern || '') } });
  res.status(201).json({ id: created.id, pattern: created.blockedPathRegex });
});

router.delete('/content-controls/:id', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const deleted = await prisma.contentFilter.deleteMany({ where: { id: Number(req.params.id), domain: { publisherId: publisher?.id } } });
  if (!deleted.count) return errorResponse(res, 404, 'CONTROL_NOT_FOUND', 'Control not found');
  res.status(204).send();
});

router.get('/payouts', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  const domainIds = (await prisma.domain.findMany({ where: { publisherId: publisher?.id }, select: { id: true } })).map((d) => d.id);
  const txs = await prisma.ledgerTransaction.findMany({ where: { domainId: { in: domainIds } }, orderBy: { createdAt: 'desc' } });
  const revenueMicros = txs.reduce((sum, tx) => sum + tx.publisherAmountMicros, 0);
  const history = txs.slice(0, 5).map((tx) => ({ date: tx.createdAt.toISOString().slice(0, 10), amountMicros: tx.publisherAmountMicros, status: 'pending' }));
  res.json({ summary: { revenueMicros, methodStatus: 'Manual review' }, history });
});

export default router;

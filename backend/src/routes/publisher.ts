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

export default router;

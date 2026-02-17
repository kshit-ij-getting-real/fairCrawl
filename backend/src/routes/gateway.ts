import { Router } from 'express';
import crypto, { randomUUID } from 'crypto';
import { ContentFormat, LicenseType } from '@prisma/client';
import prisma from '../db';
import { resolvePrice } from '../services/pricing';
import { mintToken, verifyToken } from '../services/token';
import { canonicalizeUrl } from '../services/url';

const router = Router();
const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

const err = (res: any, status: number, code: string, message: string, details?: unknown) =>
  res.status(status).json({ error: { code, message, details } });

const parseLicenseType = (value?: string): LicenseType => (value?.toUpperCase() === 'SUMMARY' ? 'SUMMARY' : 'DISPLAY');
const parseFormat = (value?: string): ContentFormat => (value === 'json' ? 'JSON' : 'MARKDOWN');
const platformFeeFor = (priceMicros: number) => Math.round(priceMicros * 0.1);

const authenticateApiKey = async (raw: string | undefined) => {
  if (!raw) return null;
  return prisma.aPIKey.findFirst({ where: { keyHash: hashKey(raw), revokedAt: null } });
};

const findDomainForHost = async (host: string) =>
  prisma.domain.findFirst({ where: { OR: [{ name: host.toLowerCase() }, { subdomainHost: host.toLowerCase() }], verified: true }, include: { pricingRules: { include: { license: true } } } });

router.get('/rates', async (req, res) => {
  const url = String(req.query.url || '');
  if (!url) return err(res, 400, 'INVALID_INPUT', 'url query parameter is required');
  const canonical = canonicalizeUrl(url);
  const domain = await findDomainForHost(canonical.host);
  if (!domain) return err(res, 404, 'NO_RATE', 'No verified property found for URL');

  const rates = domain.pricingRules
    .filter((r) => r.enabled)
    .map((r) => ({
      id: r.id,
      matcher: { exactUrl: r.exactUrl, pathPrefix: r.pathPattern, regex: r.userAgentRegex },
      license: r.license?.code || r.licenseType || 'DISPLAY',
      priceMicros: r.priceMicros,
      currency: 'USD',
    }));

  return res.json({ property: domain.name, url: canonical.full, rates });
});

router.post('/tokens', async (req, res) => {
  const key = await authenticateApiKey(req.header('x-api-key'));
  if (!key) return err(res, 401, 'INVALID_API_KEY', 'Missing or invalid X-API-Key');

  const canonical = canonicalizeUrl(String(req.body?.url || ''));
  const domain = await findDomainForHost(canonical.host);
  if (!domain) return err(res, 404, 'NO_RATE', 'No verified property found for URL');

  const licenseType = parseLicenseType(req.body?.license);
  const format = parseFormat(req.body?.format);
  const resolution = resolvePrice({ rules: domain.pricingRules, path: canonical.path, fullUrl: canonical.full, userAgent: String(req.body?.userAgent || ''), licenseType });
  if (resolution.priceMicros < 0) return err(res, 403, 'UNPRICED', 'No matching rate for this URL');

  const maxPriceMicros = req.body?.maxPriceMicros !== undefined ? Number(req.body.maxPriceMicros) : undefined;
  if (maxPriceMicros !== undefined && resolution.priceMicros > maxPriceMicros) {
    return err(res, 403, 'MAX_PRICE_EXCEEDED', 'Resolved price exceeds maxPriceMicros', { priceMicros: resolution.priceMicros });
  }

  const tokenId = randomUUID();
  const platformFeeMicros = platformFeeFor(resolution.priceMicros);
  const minted = await mintToken({
    token_id: tokenId,
    developer_org_id: key.aiClientId,
    property_id: domain.id,
    host: canonical.host,
    path: canonical.path,
    full: canonical.full,
    license_type: licenseType,
    format,
    user_agent: String(req.body?.userAgent || ''),
    price_micros: resolution.priceMicros,
    platform_fee_micros: platformFeeMicros,
    agent_identity: req.body?.agentIdentity ? String(req.body.agentIdentity) : undefined,
    max_price_micros: maxPriceMicros,
  });

  return res.status(201).json({ token: minted.token, token_id: tokenId, expires_at: new Date(minted.exp * 1000).toISOString(), price_micros: resolution.priceMicros, currency: 'USD', license: licenseType });
});

router.get('/content', async (req, res) => {
  const token = req.header('x-fairfetch-token');
  if (!token) return err(res, 401, 'INVALID_TOKEN', 'Missing x-fairfetch-token header');

  const payload = verifyToken(token);
  const canonical = canonicalizeUrl(String(req.query.url || ''));
  if (payload.full !== canonical.full) return err(res, 401, 'INVALID_TOKEN', 'Token URL mismatch');

  const txResult = await prisma.$transaction(async (tx) => {
    const tokenRow = await tx.spendToken.findUnique({ where: { id: payload.token_id } });
    if (!tokenRow || tokenRow.status !== 'ACTIVE' || tokenRow.expiresAt < new Date()) return { error: 'TOKEN_NOT_ACTIVE' as const };

    const existing = await tx.ledgerTransaction.findUnique({ where: { idempotencyKey: `token:${payload.token_id}` } });
    if (existing) return { transaction: existing };

    const transaction = await tx.ledgerTransaction.create({
      data: {
        aiClientId: payload.developer_org_id,
        domainId: payload.property_id,
        tokenId: payload.token_id,
        idempotencyKey: `token:${payload.token_id}`,
        source: 'TOKEN_SPEND',
        url: payload.full,
        path: payload.path,
        licenseType: payload.license_type,
        format: payload.format,
        publisherAmountMicros: payload.price_micros,
        platformFeeMicros: payload.platform_fee_micros,
        totalMicros: payload.price_micros + payload.platform_fee_micros,
      },
    });

    await tx.spendToken.update({ where: { id: payload.token_id }, data: { spentAt: new Date(), status: 'SPENT' } });
    return { transaction };
  });

  if ('error' in txResult) return err(res, 409, 'TOKEN_NOT_ACTIVE', 'Token has already been spent or expired');

  return res.json({
    token_id: payload.token_id,
    price_micros: payload.price_micros,
    currency: 'USD',
    license: payload.license_type,
    content_markdown: `# Paid content placeholder\n\nThis is placeholder markdown for ${payload.full}.`,
    metadata: { source_url: payload.full, fetched_at: new Date().toISOString() },
    transaction_id: txResult.transaction.id,
  });
});

router.get('/aiclient/transactions', async (req, res) => {
  const key = await authenticateApiKey(req.header('x-api-key'));
  if (!key) return err(res, 401, 'INVALID_API_KEY', 'Missing or invalid X-API-Key');
  const txs = await prisma.ledgerTransaction.findMany({ where: { aiClientId: key.aiClientId }, orderBy: { createdAt: 'desc' }, take: 200 });
  return res.json(txs);
});

export default router;

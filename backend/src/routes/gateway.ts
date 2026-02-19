import { ContentFormat, LicenseType } from '@prisma/client';
import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { getJwtSecret } from '../config';

const router = Router();

const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const bypassVerification = () => process.env.MVP_BYPASS_VERIFICATION === 'true';
const err = (res: any, status: number, error: string, details?: unknown) => res.status(status).json({ error, details });

const parseUrl = (url: string) => {
  const parsed = new URL(url);
  return { full: parsed.toString(), hostname: parsed.hostname.toLowerCase(), path: parsed.pathname || '/' };
};

const resolvePriceMicros = (rules: Array<any>, license: LicenseType, path: string) => {
  const candidates = rules
    .filter((rule) => rule.enabled)
    .filter((rule) => !rule.licenseType || rule.licenseType === license)
    .map((rule) => ({ ...rule, prefix: rule.pathPattern || '/' }))
    .filter((rule) => path.startsWith(rule.prefix));

  if (!candidates.length) return null;
  const sorted = candidates.sort((a, b) => (b.prefix.length - a.prefix.length) || a.priority - b.priority);
  return sorted[0];
};

const authenticateAIClient = async (req: any) => {
  const apiKey = req.header('x-api-key');
  if (apiKey) {
    const key = await prisma.aPIKey.findFirst({ where: { keyHash: hash(apiKey), revokedAt: null } });
    if (!key) return null;
    return { aiClientId: key.aiClientId, apiKeyId: key.id };
  }

  const auth = req.header('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(auth.slice(7), getJwtSecret()) as { userId: number; role: string };
    if (payload.role !== 'AICLIENT') return null;
    const aiClient = await prisma.aIClient.findUnique({ where: { userId: payload.userId } });
    if (!aiClient) return null;
    return { aiClientId: aiClient.id, apiKeyId: null };
  } catch {
    return null;
  }
};

router.post('/tokens', async (req, res) => {
  const auth = await authenticateAIClient(req);
  if (!auth) return err(res, 401, 'INVALID_AUTH');

  const url = String(req.body?.url || '');
  if (!url) return err(res, 400, 'URL_REQUIRED');

  let parsed: { full: string; hostname: string; path: string };
  try {
    parsed = parseUrl(url);
  } catch {
    return err(res, 400, 'INVALID_URL');
  }

  const domain = await prisma.domain.findUnique({ where: { name: parsed.hostname }, include: { pricingRules: true } });
  if (!domain) return err(res, 404, 'NOT_LISTED');
  if (!bypassVerification() && !domain.verified) return err(res, 403, 'DOMAIN_NOT_VERIFIED');

  const license: LicenseType = String(req.body?.license || 'SUMMARY').toUpperCase() === 'DISPLAY' ? 'DISPLAY' : 'SUMMARY';

  const identity = await prisma.agentIdentity.findFirst({ where: { aiClientId: auth.aiClientId }, orderBy: { updatedAt: 'desc' } });
  if (identity && req.header('user-agent')) {
    try {
      if (!new RegExp(identity.allowedUserAgentRe).test(String(req.header('user-agent')))) {
        return err(res, 403, 'USER_AGENT_NOT_ALLOWED');
      }
    } catch {
      return err(res, 400, 'INVALID_AGENT_REGEX');
    }
  }

  const resolvedRule = resolvePriceMicros(domain.pricingRules, license, parsed.path);
  if (!resolvedRule) return err(res, 404, 'NOT_LISTED');
  const priceMicros = resolvedRule.priceMicros;
  const maxPriceMicros = req.body?.maxPriceMicros !== undefined ? Number(req.body.maxPriceMicros) : undefined;
  if (maxPriceMicros !== undefined && priceMicros > maxPriceMicros) return err(res, 402, 'PRICE_TOO_HIGH', { priceMicros });

  const rawToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.spendToken.create({
    data: {
      aiClientId: auth.aiClientId,
      domainId: domain.id,
      canonicalHost: parsed.hostname,
      canonicalPath: parsed.path,
      canonicalFullUrl: parsed.full,
      licenseType: license,
      format: 'JSON',
      userAgent: String(req.header('user-agent') || ''),
      agentIdentity: identity?.agentId || null,
      maxPriceMicros: maxPriceMicros ?? null,
      priceMicros,
      platformFeeMicros: 0,
      totalMicros: priceMicros,
      tokenHash: hash(rawToken),
      expiresAt,
    },
  });

  return res.status(201).json({ token: rawToken, priceMicros, expiresAt, domain: parsed.hostname, path: parsed.path, license });
});

router.get('/content', async (req, res) => {
  const rawToken = req.header('x-fairfetch-token');
  if (!rawToken) return err(res, 401, 'INVALID_TOKEN');

  const tokenRow = await prisma.spendToken.findUnique({ where: { tokenHash: hash(rawToken) } });
  if (!tokenRow) return err(res, 401, 'INVALID_TOKEN');
  if (tokenRow.spentAt || tokenRow.expiresAt < new Date() || tokenRow.status !== 'ACTIVE') return err(res, 409, 'TOKEN_NOT_ACTIVE');

  const spentAt = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const consumed = await tx.spendToken.update({ where: { id: tokenRow.id }, data: { spentAt, status: 'SPENT' } });

    const request = await tx.requestLog.create({
      data: {
        domainId: consumed.domainId,
        aiClientId: consumed.aiClientId,
        path: consumed.canonicalPath,
        bytesSent: 0,
        statusCode: 200,
      },
    });

    const ledger = await tx.ledgerTransaction.create({
      data: {
        aiClientId: consumed.aiClientId,
        domainId: consumed.domainId,
        tokenId: consumed.id,
        idempotencyKey: `token:${consumed.id}`,
        source: 'TOKEN_SPEND',
        url: consumed.canonicalFullUrl,
        path: consumed.canonicalPath,
        licenseType: consumed.licenseType,
        format: consumed.format as ContentFormat,
        publisherAmountMicros: consumed.priceMicros,
        platformFeeMicros: consumed.platformFeeMicros,
        totalMicros: consumed.totalMicros,
      },
    });

    return { consumed, request, ledger };
  });

  return res.json({
    title: 'Demo content',
    excerpt: `Licensed demo response for ${result.consumed.canonicalPath}.`,
    sourceUrl: result.consumed.canonicalFullUrl,
    receipt: {
      requestId: result.request.id,
      txId: result.ledger.id,
      priceMicros: result.consumed.priceMicros,
      domain: result.consumed.canonicalHost,
      path: result.consumed.canonicalPath,
      license: result.consumed.licenseType,
      timestamp: spentAt,
    },
  });
});

export default router;

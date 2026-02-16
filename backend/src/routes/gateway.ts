import { Router } from 'express';
import crypto, { randomUUID } from 'crypto';
import { ContentFormat, LicenseType } from '@prisma/client';
import prisma from '../db';
import { extractContent } from '../services/content';
import { writeLedgerTransaction } from '../services/ledger';
import { resolvePrice } from '../services/pricing';
import { mintToken, verifyToken } from '../services/token';
import { canonicalizeUrl } from '../services/url';
import { ensureRequestId, FairFetchError, sendError } from '../utils/errors';

const router = Router();

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');
const hashValue = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

const parseLicenseType = (value: string | undefined): LicenseType => (value === 'summary' ? 'SUMMARY' : 'DISPLAY');
const parseFormat = (value: string | undefined): ContentFormat => (value === 'json' ? 'JSON' : 'MARKDOWN');

const platformFeeFor = (priceMicros: number) => Math.round(priceMicros * 0.1);

const authenticateApiKey = async (raw: string | undefined) => {
  if (!raw) throw new FairFetchError(401, 'INVALID_API_KEY', 'Missing API key', 'Send X-API-Key header');
  const keyHash = hashKey(raw);
  const key = await prisma.aPIKey.findFirst({ where: { keyHash, revokedAt: null } });
  if (!key) throw new FairFetchError(401, 'INVALID_API_KEY', 'Invalid API key', 'Create a valid key in the developer dashboard');
  return key;
};

const findDomainForHost = async (host: string) => {
  const normalizedHost = host.toLowerCase();
  return prisma.domain.findFirst({
    where: { OR: [{ name: normalizedHost }, { subdomainHost: normalizedHost }], verified: true },
    include: { pricingRules: true, contentFilters: true },
  });
};

const enforceFilters = (blockedRegexList: string[], path: string) => {
  for (const blockedRegex of blockedRegexList) {
    if (!blockedRegex) continue;
    try {
      if (new RegExp(blockedRegex).test(path)) {
        throw new FairFetchError(403, 'FILTERED', 'Path blocked by publisher filter', 'Contact publisher for this path policy');
      }
    } catch {
      if (path.startsWith(blockedRegex)) {
        throw new FairFetchError(403, 'FILTERED', 'Path blocked by publisher filter', 'Contact publisher for this path policy');
      }
    }
  }
};

router.post('/token', async (req, res) => {
  const requestId = ensureRequestId(req);
  try {
    const key = await authenticateApiKey(req.header('x-api-key'));
    const { url, license_type, user_agent, format, max_price_micros } = req.body || {};
    const canonical = canonicalizeUrl(url);
    const licenseType = parseLicenseType(license_type);
    const contentFormat = parseFormat(format);
    const domain = await findDomainForHost(canonical.host);
    if (!domain) throw new FairFetchError(403, 'UNPRICED', 'No verified property for this URL', 'Onboard publisher domain first');

    enforceFilters(
      domain.contentFilters.map((f) => f.blockedPathRegex || '').filter(Boolean),
      canonical.path
    );

    const resolution = resolvePrice({
      rules: domain.pricingRules,
      path: canonical.path,
      fullUrl: canonical.full,
      userAgent: user_agent || '',
      licenseType,
    });

    if (resolution.priceMicros < 0) {
      throw new FairFetchError(403, 'UNPRICED', 'No matching pricing rule', 'Create a pricing rule for this path or user-agent');
    }

    if (max_price_micros !== undefined && Number(max_price_micros) < resolution.priceMicros) {
      throw new FairFetchError(403, 'MAX_PRICE_EXCEEDED', 'Resolved price is above max_price_micros', 'Raise max_price_micros or request cheaper license type');
    }

    const platformFeeMicros = platformFeeFor(resolution.priceMicros);
    const tokenId = randomUUID();
    const minted = await mintToken({
      token_id: tokenId,
      developer_org_id: key.aiClientId,
      property_id: domain.id,
      host: canonical.host,
      path: canonical.path,
      full: canonical.full,
      license_type: licenseType,
      format: contentFormat,
      user_agent: user_agent || '',
      price_micros: resolution.priceMicros,
      platform_fee_micros: platformFeeMicros,
    });

    return res.json({
      token: minted.token,
      token_id: tokenId,
      price_micros: resolution.priceMicros,
      platform_fee_micros: platformFeeMicros,
      total_micros: resolution.priceMicros + platformFeeMicros,
      expires_at: new Date(minted.exp * 1000).toISOString(),
      request_id: requestId,
    });
  } catch (error) {
    if (error instanceof FairFetchError) return sendError(res, requestId, error);
    console.error(error);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Token mint failed', request_id: requestId });
  }
});

router.get('/gateway/fetch', async (req, res) => {
  const requestId = ensureRequestId(req);
  try {
    const key = await authenticateApiKey(req.header('x-api-key'));
    const url = req.query.url as string;
    const canonical = canonicalizeUrl(url);
    const licenseType = parseLicenseType(req.query.license_type as string | undefined);
    const contentFormat = parseFormat(req.query.format as string | undefined);
    const maxPrice = req.query.max_price_micros ? Number(req.query.max_price_micros) : undefined;

    const domain = await findDomainForHost(canonical.host);
    if (!domain) throw new FairFetchError(403, 'UNPRICED', 'No verified property for this URL', 'Onboard publisher domain first');

    enforceFilters(domain.contentFilters.map((f) => f.blockedPathRegex || '').filter(Boolean), canonical.path);

    const userAgent = req.header('user-agent') || 'gateway-client';
    const resolution = resolvePrice({ rules: domain.pricingRules, path: canonical.path, fullUrl: canonical.full, userAgent, licenseType });
    if (resolution.priceMicros < 0) throw new FairFetchError(403, 'UNPRICED', 'No matching pricing rule', 'Create a pricing rule');
    if (maxPrice !== undefined && resolution.priceMicros > maxPrice) {
      throw new FairFetchError(403, 'MAX_PRICE_EXCEEDED', 'Resolved price exceeds max_price_micros', 'Increase max_price_micros');
    }

    const origin = await fetch(canonical.full);
    const html = await origin.text();
    const extracted = extractContent(html, canonical.full);
    const platformFeeMicros = platformFeeFor(resolution.priceMicros);
    const idempotencyBase = `${key.aiClientId}:${canonical.full}:${licenseType}:${contentFormat}:${requestId}`;
    const transaction = await writeLedgerTransaction({
      aiClientId: key.aiClientId,
      domainId: domain.id,
      idempotencyKey: hashValue(idempotencyBase),
      source: 'GATEWAY',
      url: canonical.full,
      path: canonical.path,
      licenseType,
      format: contentFormat,
      publisherAmountMicros: resolution.priceMicros,
      platformFeeMicros,
      matchedRuleId: resolution.ruleId,
    });

    return res.json({
      transaction_id: transaction.id,
      request_id: requestId,
      price_micros: resolution.priceMicros,
      platform_fee_micros: platformFeeMicros,
      total_micros: resolution.priceMicros + platformFeeMicros,
      license_type: licenseType.toLowerCase(),
      format: contentFormat.toLowerCase(),
      content: contentFormat === 'JSON' ? extracted : extracted.content_markdown,
      metadata: extracted,
    });
  } catch (error) {
    if (error instanceof FairFetchError) return sendError(res, requestId, error);
    console.error(error);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Gateway fetch failed', request_id: requestId });
  }
});

router.get('/fairfetch/:wild(*)', async (req, res) => {
  const requestId = ensureRequestId(req);
  try {
    const token = req.header('fairfetch-token');
    const orgHeader = Number(req.header('fairfetch-org-id'));
    const ua = req.header('user-agent') || '';
    if (!token) throw new FairFetchError(401, 'INVALID_TOKEN', 'Missing Fairfetch-Token', 'Call POST /api/token first');

    const payload = verifyToken(token);
    if (payload.developer_org_id !== orgHeader) throw new FairFetchError(401, 'INVALID_TOKEN', 'Org mismatch', 'Use token and org from same mint response');
    if (payload.user_agent !== ua) throw new FairFetchError(401, 'INVALID_TOKEN', 'User-Agent mismatch', 'Reuse the same User-Agent used while minting token');

    const host = (req.header('host') || '').split(':')[0].toLowerCase();
    const path = `/${req.params.wild || ''}`.replace(/\/+/g, '/');
    if (payload.host !== host || payload.path !== path) {
      throw new FairFetchError(401, 'INVALID_TOKEN', 'Host/path mismatch', 'Use token for the exact minted URL');
    }

    const tokenRow = await prisma.spendToken.findUnique({ where: { id: payload.token_id } });
    if (!tokenRow || tokenRow.spentAt) {
      throw new FairFetchError(409, 'TOKEN_ALREADY_SPENT', 'Token already spent or missing', 'Mint a new token');
    }

    const domain = await prisma.domain.findUnique({ where: { id: payload.property_id } });
    if (!domain) throw new FairFetchError(403, 'UNPRICED', 'Property not found', 'Check property mapping');

    const origin = await fetch(payload.full);
    const html = await origin.text();
    const extracted = extractContent(html, payload.full);
    const txn = await writeLedgerTransaction({
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
      matchedRuleId: null,
    });

    return res.json({
      transaction_id: txn.id,
      request_id: requestId,
      content: payload.format === 'JSON' ? extracted : extracted.content_markdown,
      metadata: extracted,
    });
  } catch (error) {
    if (error instanceof FairFetchError) return sendError(res, requestId, error);
    console.error(error);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Token spend failed', request_id: requestId });
  }
});

export default router;

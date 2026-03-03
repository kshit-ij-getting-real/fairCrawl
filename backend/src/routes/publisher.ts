import { LicenseType, Prisma } from '@prisma/client';
import { Router } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { normalizeDomainInput } from '../utils/domain';

const router = Router();

const isBypassVerificationEnabled = () => process.env.MVP_BYPASS_VERIFICATION === 'true';

const parseDateFilter = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parsePageSize = (value: unknown, fallback = 25, max = 100) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
};

const errorJson = (res: any, status: number, error: string, details?: unknown) => res.status(status).json({ error, details });

const getPublisher = async (userId: number) => prisma.publisher.findUnique({ where: { userId } });

const mapRule = (rule: any) => ({
  id: rule.id,
  domainId: rule.domainId,
  licenseCode: rule.licenseType || rule.license?.code || 'SUMMARY',
  pathPrefix: rule.pathPattern || '/',
  priceMicros: rule.priceMicros,
  isActive: rule.enabled,
  createdAt: rule.createdAt,
  updatedAt: rule.updatedAt,
  // legacy aliases kept for existing consumers
  licenseType: rule.licenseType || rule.license?.code || 'SUMMARY',
  active: rule.enabled,
  scope: rule.scope,
});

const parseLicenseCode = (value: unknown) => {
  const normalized = String(value || 'SUMMARY').toUpperCase();
  if (normalized !== 'SUMMARY' && normalized !== 'DISPLAY') {
    return null;
  }
  return normalized as LicenseType;
};

const parseAndValidateRuleInput = (body: any) => {
  const licenseCode = parseLicenseCode(body?.licenseCode || body?.licenseType);
  if (!licenseCode) {
    return { error: { status: 400, error: 'VALIDATION_ERROR', message: 'licenseCode must be SUMMARY or DISPLAY.' } };
  }

  const pathPrefix = String(body?.pathPrefix || body?.matchValue || '/').trim() || '/';
  if (!pathPrefix.startsWith('/') || pathPrefix.length > 200) {
    return { error: { status: 400, error: 'VALIDATION_ERROR', message: 'pathPrefix must start with "/" and be at most 200 characters.' } };
  }

  const priceMicros = Number(body?.priceMicros);
  if (!Number.isInteger(priceMicros) || priceMicros < 1) {
    return { error: { status: 400, error: 'VALIDATION_ERROR', message: 'priceMicros must be an integer greater than or equal to 1.' } };
  }

  return {
    data: {
      licenseCode,
      pathPrefix,
      priceMicros,
      isActive: body?.isActive !== false && body?.active !== false,
    },
  };
};

const parseDomainId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
};

router.get('/domains', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id }, orderBy: { createdAt: 'desc' } });
  return res.json(domains);
});

router.post('/domains', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const sanitized = normalizeDomainInput(String(req.body?.domain || ''));
  if (!sanitized) return errorJson(res, 400, 'INVALID_DOMAIN');

  try {
    const created = await prisma.domain.create({
      data: {
        publisherId: publisher.id,
        name: sanitized,
        verified: isBypassVerificationEnabled(),
      },
    });

    if (created.verified) {
      return res.status(201).json(created);
    }

    return res.status(201).json({
      ...created,
      instructions: `Add TXT record _fairfetch-verify.${created.name} with token ${created.verifyToken}`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'DOMAIN_EXISTS' });
    }
    throw error;
  }
});

router.post('/domains/:id/verify-dns', async (req: AuthRequest, res) => {
  if (isBypassVerificationEnabled()) {
    const updated = await prisma.domain.update({ where: { id: Number(req.params.id) }, data: { verified: true } });
    return res.json(updated);
  }
  return errorJson(res, 400, 'VERIFICATION_NOT_IMPLEMENTED_FOR_MVP');
});

router.get('/domains/:domainId/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const domainId = parseDomainId(req.params.domainId);
  if (!domainId) return errorJson(res, 404, 'DOMAIN_NOT_FOUND');

  const domain = await prisma.domain.findFirst({ where: { id: domainId, publisherId: publisher.id } });
  if (!domain) return errorJson(res, 404, 'DOMAIN_NOT_FOUND');

  const rules = await prisma.pricingRule.findMany({
    where: { domainId: domain.id },
    include: { license: true },
    orderBy: [{ enabled: 'desc' }, { pathPattern: 'desc' }, { createdAt: 'desc' }],
  });

  return res.json({ pricingRules: rules.map(mapRule) });
});

router.post('/domains/:domainId/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const domainId = parseDomainId(req.params.domainId);
  if (!domainId) return errorJson(res, 404, 'DOMAIN_NOT_FOUND');

  const domain = await prisma.domain.findFirst({ where: { id: domainId, publisherId: publisher.id } });
  if (!domain) return errorJson(res, 404, 'DOMAIN_NOT_FOUND');

  const parsedInput = parseAndValidateRuleInput(req.body);
  if ('error' in parsedInput) {
    return res.status(parsedInput.error.status).json({ error: parsedInput.error.error, message: parsedInput.error.message });
  }
  const { licenseCode, pathPrefix, priceMicros, isActive } = parsedInput.data;

  const existing = await prisma.pricingRule.findFirst({
    where: { domainId: domain.id, pathPattern: pathPrefix, licenseType: licenseCode },
  });
  if (existing) {
    return res.status(409).json({ error: 'PRICING_RULE_EXISTS', message: 'A pricing rule already exists for this domain/pathPrefix/licenseCode.' });
  }

  const rule = await prisma.pricingRule.create({
    data: {
      domainId: domain.id,
      scope: 'DIRECTORY',
      pathPattern: pathPrefix,
      licenseType: licenseCode,
      priceMicros,
      enabled: isActive,
      priority: 100,
    },
    include: { license: true },
  });

  return res.status(201).json({ pricingRule: mapRule(rule) });
});

const createRuleFromBody = async (req: AuthRequest, res: any, domainId: number) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const domain = await prisma.domain.findFirst({ where: { id: domainId, publisherId: publisher.id } });
  if (!domain) return errorJson(res, 404, 'DOMAIN_NOT_FOUND');

  const parsedInput = parseAndValidateRuleInput(req.body);
  if ('error' in parsedInput) {
    return res.status(parsedInput.error.status).json({ error: parsedInput.error.error, message: parsedInput.error.message });
  }
  const { licenseCode, pathPrefix, priceMicros, isActive } = parsedInput.data;

  const existing = await prisma.pricingRule.findFirst({
    where: { domainId: domain.id, pathPattern: pathPrefix, licenseType: licenseCode },
  });
  if (existing) {
    return res.status(409).json({ error: 'PRICING_RULE_EXISTS', message: 'A pricing rule already exists for this domain/pathPrefix/licenseCode.' });
  }

  const rule = await prisma.pricingRule.create({
    data: {
      domainId: domain.id,
      scope: 'DIRECTORY',
      pathPattern: pathPrefix,
      licenseType: licenseCode,
      priceMicros,
      enabled: isActive,
      priority: 100,
    },
    include: { license: true },
  });

  return res.status(201).json({ pricingRule: mapRule(rule) });
};

router.get('/pricing-rules', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const rules = await prisma.pricingRule.findMany({ where: { domain: { publisherId: publisher.id } }, include: { license: true }, orderBy: { createdAt: 'desc' } });
  return res.json({ pricingRules: rules.map(mapRule) });
});

router.post('/pricing-rules', async (req: AuthRequest, res) => {
  return createRuleFromBody(req, res, Number(req.body?.domainId));
});

router.delete('/pricing-rules/:ruleId', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const deleted = await prisma.pricingRule.deleteMany({ where: { id: Number(req.params.ruleId || req.params.id), domain: { publisherId: publisher.id } } });
  if (!deleted.count) return errorJson(res, 404, 'RULE_NOT_FOUND');

  return res.status(204).send();
});

router.post('/pricing-rules/:id/activate', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');
  const updated = await prisma.pricingRule.updateMany({ where: { id: Number(req.params.id), domain: { publisherId: publisher.id } }, data: { enabled: true } });
  if (!updated.count) return errorJson(res, 404, 'RULE_NOT_FOUND');
  return res.json({ activated: true });
});

router.get('/transactions', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const from = parseDateFilter(String(req.query.from || ''));
  const to = parseDateFilter(String(req.query.to || ''));
  const domainId = Number(req.query.domainId || 0) || undefined;
  const domainName = String(req.query.domain || '').trim().toLowerCase();
  const licenseType = String(req.query.licenseType || '').trim().toUpperCase();
  const cursor = String(req.query.cursor || '');
  const pageSize = parsePageSize(req.query.pageSize, 25, 100);

  const domainIds = (
    await prisma.domain.findMany({
      where: {
        publisherId: publisher.id,
        ...(domainId ? { id: domainId } : {}),
        ...(domainName ? { name: { contains: domainName, mode: 'insensitive' } } : {}),
      },
      select: { id: true },
    })
  ).map((d) => d.id);

  if (!domainIds.length) {
    return res.json({
      rows: [],
      page: {
        pageSize,
        nextCursor: null,
        hasMore: false,
      },
    });
  }

  const rows = await prisma.ledgerTransaction.findMany({
    where: {
      domainId: { in: domainIds },
      createdAt: { gte: from, lte: to },
      ...(licenseType === 'SUMMARY' || licenseType === 'DISPLAY' ? { licenseType: licenseType as LicenseType } : {}),
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { domain: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: pageSize + 1,
  });

  const hasMore = rows.length > pageSize;
  const pageRows = hasMore ? rows.slice(0, pageSize) : rows;
  const nextCursor = hasMore ? pageRows[pageRows.length - 1]?.id || null : null;

  return res.json({
    rows: pageRows.map((row) => ({
      txId: row.id,
      timestamp: row.createdAt,
      domain: row.domain.name,
      path: row.path,
      license: row.licenseType,
      priceMicros: row.publisherAmountMicros,
    })),
    page: {
      pageSize,
      hasMore,
      nextCursor,
    },
  });
});

router.get('/overview', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const domains = await prisma.domain.findMany({ where: { publisherId: publisher.id } });
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const txs = await prisma.ledgerTransaction.findMany({ where: { domainId: { in: domains.map((d) => d.id) }, createdAt: { gte: since } } });
  return res.json({
    kpis: {
      revenueMicros: txs.reduce((sum, tx) => sum + tx.publisherAmountMicros, 0),
      requests30d: txs.length,
      activeDomains: domains.filter((d) => d.verified).length,
    },
    recentTransactions: txs.slice(0, 20),
  });
});

router.get('/traffic/user-agents', async (req: AuthRequest, res) => {
  const publisher = await getPublisher(req.user!.id);
  if (!publisher) return errorJson(res, 404, 'PUBLISHER_NOT_FOUND');

  const from = parseDateFilter(String(req.query.from || ''));
  const to = parseDateFilter(String(req.query.to || ''));
  const limit = parsePageSize(req.query.limit, 25, 200);
  const requestedDomainId = Number(req.query.domainId || 0) || undefined;

  const domains = await prisma.domain.findMany({
    where: {
      publisherId: publisher.id,
      ...(requestedDomainId ? { id: requestedDomainId } : {}),
    },
    select: { id: true, name: true },
  });

  if (!domains.length) {
    return res.json({
      rows: [],
      summary: {
        totalLogs: 0,
        uniqueUserAgents: 0,
      },
    });
  }

  const domainIds = domains.map((d) => d.id);
  const where = {
    domainId: { in: domainIds },
    ...(from || to
      ? {
          timestamp: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {}),
  };

  const [totalLogs, logs] = await Promise.all([
    prisma.domainApiLog.count({ where }),
    prisma.domainApiLog.findMany({
      where,
      select: {
        userAgent: true,
        timestamp: true,
      },
    }),
  ]);

  const byUserAgent = new Map<string, { requests: number; firstSeen: Date; lastSeen: Date }>();
  for (const log of logs) {
    const key = log.userAgent || 'UNKNOWN';
    const existing = byUserAgent.get(key);
    if (!existing) {
      byUserAgent.set(key, { requests: 1, firstSeen: log.timestamp, lastSeen: log.timestamp });
      continue;
    }
    existing.requests += 1;
    if (log.timestamp < existing.firstSeen) existing.firstSeen = log.timestamp;
    if (log.timestamp > existing.lastSeen) existing.lastSeen = log.timestamp;
    byUserAgent.set(key, existing);
  }

  const rows = [...byUserAgent.entries()]
    .map(([userAgent, stats]) => ({
      userAgent,
      requests: stats.requests,
      firstSeen: stats.firstSeen,
      lastSeen: stats.lastSeen,
    }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, limit);

  return res.json({
    rows,
    summary: {
      totalLogs,
      uniqueUserAgents: byUserAgent.size,
    },
  });
});

router.get('/license-settings', async (_req: AuthRequest, res) => {
  return res.json({ SUMMARY: { enabled: true, basePriceMicros: 0 }, DISPLAY: { enabled: true, basePriceMicros: 0 } });
});

router.post('/license-settings', async (_req: AuthRequest, res) => {
  return res.json({ success: true });
});

router.get('/transactions/export', async (_req: AuthRequest, res) => {
  return res.json({ csv: 'timestamp,ai_client,domain,path,license,price_micros,status,transaction_id' });
});

export default router;

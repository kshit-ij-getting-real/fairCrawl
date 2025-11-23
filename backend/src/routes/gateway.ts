import { Router } from 'express';
import crypto from 'crypto';
import { AccessType, AIPolicy, Domain } from '@prisma/client';
import prisma from '../db';
import { AuthRequest, authenticate, requireRole } from '../middleware/auth';

const router = Router();

const rateState = new Map<string, { count: number; windowStart: number }>();

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

const matchesPattern = (pattern: string, path: string) => {
  if (pattern.endsWith('*')) {
    return path.startsWith(pattern.replace('*', ''));
  }
  return path === pattern;
};

const resolveRule = (domain: Domain & { policies: AIPolicy[] }, path: string) => {
  const policy = domain.policies.find((p) => matchesPattern(p.pathPattern, path));
  if (!policy) {
    return { accessType: AccessType.BLOCKED, priceMicros: 0, maxRps: null, pathPattern: null };
  }
  const accessType = policy.accessType ?? (policy.allowAI ? (policy.pricePer1k > 0 ? AccessType.PAID : AccessType.OPEN) : AccessType.BLOCKED);
  const priceMicros = policy.priceMicros ?? (policy.pricePer1k || 0) * 10000;
  return {
    accessType,
    priceMicros: accessType === AccessType.PAID ? priceMicros : 0,
    maxRps: policy.maxRps ?? null,
    pathPattern: policy.pathPattern,
  };
};

const logReadEvent = async (params: {
  domain: Domain;
  aiClientId: number;
  targetUrl: URL;
  pathPattern: string | null;
  accessType: AccessType;
  priceMicros: number;
  bytes?: number;
}) => {
  const { domain, aiClientId, targetUrl, pathPattern, accessType, priceMicros, bytes } = params;
  await prisma.readEvent.create({
    data: {
      aiClientId,
      publisherId: domain.publisherId,
      domainId: domain.id,
      url: targetUrl.toString(),
      path: targetUrl.pathname,
      pathPattern: pathPattern ?? undefined,
      accessType,
      priceMicros,
      bytes,
    },
  });

  if (accessType === AccessType.PAID && priceMicros > 0) {
    await Promise.all([
      prisma.publisherBalance.upsert({
        where: { publisherId: domain.publisherId },
        update: { balanceMicros: { increment: priceMicros }, updatedAt: new Date() },
        create: { publisherId: domain.publisherId, balanceMicros: priceMicros },
      }),
      prisma.clientBalance.upsert({
        where: { clientId: aiClientId },
        update: { balanceMicros: { increment: priceMicros }, updatedAt: new Date() },
        create: { clientId: aiClientId, balanceMicros: priceMicros },
      }),
    ]);
  }
};

router.get('/gateway/fetch', async (req, res) => {
  try {
    const urlParam = req.query.url as string | undefined;
    if (!urlParam) return res.status(400).json({ error: 'url query required' });
    const apiKey = req.header('x-api-key');
    if (!apiKey) return res.status(401).json({ error: 'Missing API key' });

    const keyHash = hashKey(apiKey);
    const keyRecord = await prisma.aPIKey.findFirst({ where: { keyHash, revokedAt: null } });
    if (!keyRecord) return res.status(401).json({ error: 'Invalid API key' });

    const targetUrl = new URL(urlParam);
    const domain = await prisma.domain.findUnique({ where: { name: targetUrl.hostname }, include: { policies: true } });
    if (!domain || !domain.verified) {
      return res.status(403).json({ error: 'Domain not available via FairFetch' });
    }

    const rule = resolveRule(domain, targetUrl.pathname);
    if (rule.accessType === AccessType.BLOCKED) {
      await logReadEvent({
        domain,
        aiClientId: keyRecord.aiClientId,
        targetUrl,
        pathPattern: rule.pathPattern,
        accessType: rule.accessType,
        priceMicros: 0,
      });
      return res.status(403).json({ error: 'AI crawling not permitted for this path' });
    }

    if (rule.maxRps) {
      const key = `${domain.id}:${keyRecord.aiClientId}`;
      const now = Date.now();
      const state = rateState.get(key);
      if (!state || now - state.windowStart > 1000) {
        rateState.set(key, { count: 1, windowStart: now });
      } else {
        if (state.count >= rule.maxRps) {
          return res.status(429).json({ error: 'Rate limit exceeded' });
        }
        state.count += 1;
        rateState.set(key, state);
      }
    }

    const originRes = await fetch(targetUrl.toString());
    const buffer = Buffer.from(await originRes.arrayBuffer());

    await prisma.requestLog.create({
      data: {
        domainId: domain.id,
        aiClientId: keyRecord.aiClientId,
        apiKeyId: keyRecord.id,
        path: targetUrl.pathname,
        bytesSent: buffer.length,
        statusCode: originRes.status,
      },
    });

    await logReadEvent({
      domain,
      aiClientId: keyRecord.aiClientId,
      targetUrl,
      pathPattern: rule.pathPattern,
      accessType: rule.accessType,
      priceMicros: rule.priceMicros,
      bytes: buffer.length,
    });

    res.status(originRes.status);
    originRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') return;
      res.setHeader(key, value);
    });
    return res.send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Gateway fetch failed' });
  }
});

router.get('/client/check', authenticate, requireRole('AICLIENT'), async (req: AuthRequest, res) => {
  try {
    const urlParam = req.query.url as string | undefined;
    if (!urlParam) return res.status(400).json({ error: 'url query required' });
    let targetUrl: URL;
    try {
      targetUrl = new URL(urlParam);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const domain = await prisma.domain.findUnique({ where: { name: targetUrl.hostname }, include: { policies: true } });
    if (!domain || !domain.verified) {
      return res.status(404).json({ error: 'Domain not available via FairFetch' });
    }

    const rule = resolveRule(domain, targetUrl.pathname);
    return res.json({
      status: rule.accessType,
      priceMicros: rule.priceMicros,
      maxRps: rule.maxRps,
      pathPattern: rule.pathPattern,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to check access' });
  }
});

export default router;

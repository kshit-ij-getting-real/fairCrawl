import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../db';
import { logReadEvent } from '../services/readEvents';

const router = Router();

const rateState = new Map<string, { count: number; windowStart: number }>();

const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

const matchesPattern = (pattern: string, path: string) => {
  if (pattern.endsWith('*')) {
    return path.startsWith(pattern.replace('*', ''));
  }
  return path === pattern;
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
      return res.status(403).json({ error: 'Domain not available via Fair Crawl' });
    }

    const policy = domain.policies.find((p) => matchesPattern(p.pathPattern, targetUrl.pathname));
    if (!policy || !policy.allowAI) {
      return res.status(403).json({ error: 'AI crawling not permitted for this path' });
    }

    if (policy.maxRps) {
      const key = `${domain.id}:${keyRecord.aiClientId}`;
      const now = Date.now();
      const state = rateState.get(key);
      if (!state || now - state.windowStart > 1000) {
        rateState.set(key, { count: 1, windowStart: now });
      } else {
        if (state.count >= policy.maxRps) {
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

    if (originRes.ok) {
      await logReadEvent({
        clientId: keyRecord.aiClientId,
        domainId: domain.id,
        url: targetUrl.toString(),
        bytes: buffer.length,
      });
    }

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

export default router;

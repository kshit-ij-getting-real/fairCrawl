import { Prisma } from '@prisma/client';
import { Router } from 'express';
import prisma from '../db';

const router = Router();
const HARDCODED_PUBLISHER_LOG_INGEST_TOKEN = 'fairfetch-static-ingest-token';

const parseDomainId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

router.post('/domains/:domainId/logs', async (req, res) => {
  const domainId = parseDomainId(req.params.domainId);
  if (!domainId) return res.status(404).json({ error: 'DOMAIN_NOT_FOUND' });

  const staticToken = String(req.header('x-publisher-log-token') || '').trim();
  if (!staticToken) {
    return res.status(401).json({ error: 'TOKEN_REQUIRED', message: 'Missing x-publisher-log-token header.' });
  }

  if (staticToken !== HARDCODED_PUBLISHER_LOG_INGEST_TOKEN) {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }

  const domain = await prisma.domain.findUnique({ where: { id: domainId } });
  if (!domain) return res.status(404).json({ error: 'DOMAIN_NOT_FOUND' });

  const userAgent = String(req.body?.userAgent || '').trim();
  if (!userAgent) {
    return res.status(400).json({ error: 'USER_AGENT_REQUIRED', message: 'Expected userAgent in request body.' });
  }

  const created = await prisma.domainApiLog.create({
    data: {
      domainId: domain.id,
      path: '/',
      userAgent,
      source: 'publisher_api',
      raw: { userAgent } as Prisma.JsonObject,
    },
  });

  return res.status(201).json({
    domainId: domain.id,
    logId: created.id,
    userAgent: created.userAgent,
    timestamp: created.timestamp,
  });
});

export default router;

import { Router, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// ...rest of file above stays the same...

router.get('/domains/:domainId/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const publisher = await prisma.publisher.findUnique({
      where: { userId: req.user!.id },
    });
    if (!publisher) return res.status(404).json({ error: 'Publisher not found' });

    const domainId = Number(req.params.domainId);
    const domain = await domainOwnedBy(domainId, publisher.id);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    // Fetch all logs for this domain and aggregate in JS
    const logs = await prisma.requestLog.findMany({
      where: { domainId: domain.id },
    });

    const totalRequests = logs.length;
    const totalBytes = logs.reduce((sum, log) => sum + log.bytesSent, 0);

    // Count requests per AI client
    const countsByClient = new Map<number, number>();
    for (const log of logs) {
      const current = countsByClient.get(log.aiClientId) ?? 0;
      countsByClient.set(log.aiClientId, current + 1);
    }

    // Sort by request count desc and take top 5
    const sortedClients = [...countsByClient.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const clientIds = sortedClients.map(([aiClientId]) => aiClientId);
    const clients = clientIds.length
      ? await prisma.aIClient.findMany({ where: { id: { in: clientIds } } })
      : [];

    const topClients = sortedClients.map(([aiClientId, requests]) => ({
      aiClientId,
      requests,
      name: clients.find((c) => c.id === aiClientId)?.name || 'Unknown',
    }));

    const price = domain.policies[0]?.pricePer1k || 0;
    const estimatedRevenue = (totalRequests * price) / 1000;

    return res.json({
      totalRequests,
      totalBytes,
      topClients,
      estimatedRevenue,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load analytics' });
  }
});

export default router;

import prisma from '../db';

async function main() {
  const now = new Date();
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);

  const groups = await prisma.requestLog.groupBy({
    by: ['domainId', 'aiClientId', 'apiKeyId'],
    where: { timestamp: { gte: periodStart, lt: periodEnd } },
    _count: { _all: true },
    _sum: { bytesSent: true },
  });

  const domainIds = [...new Set(groups.map((g) => g.domainId))];
  const domains = await prisma.domain.findMany({ where: { id: { in: domainIds } }, include: { policies: true } });

  for (const group of groups) {
    const domain = domains.find((d) => d.id === group.domainId);
    const policy = domain?.policies[0];
    const priceMicros = policy ? policy.priceMicros ?? policy.pricePer1k * 10000 : 0;
    const chargeUsd = ((group._count._all || 0) / 1000) * (priceMicros / 1_000_000);
    const chargeCents = Math.round(chargeUsd * 100);

    await prisma.usageAggregate.create({
      data: {
        periodStart,
        periodEnd,
        domainId: group.domainId,
        aiClientId: group.aiClientId,
        apiKeyId: group.apiKeyId,
        requests: group._count._all || 0,
        bytes: group._sum.bytesSent || 0,
        chargeCents,
      },
    });
  }

  console.log(`Aggregated ${groups.length} usage rows for ${periodStart.toISOString()} - ${periodEnd.toISOString()}`);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

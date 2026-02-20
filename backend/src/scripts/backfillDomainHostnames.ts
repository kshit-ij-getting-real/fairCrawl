import prisma from '../db';
import { normalizeDomainInput } from '../utils/domain';

async function backfillDomainHostnames() {
  const domains = await prisma.domain.findMany({
    where: {
      OR: [
        { name: { startsWith: 'http://' } },
        { name: { startsWith: 'https://' } },
      ],
    },
    orderBy: { id: 'asc' },
  });

  let updated = 0;
  let skipped = 0;

  for (const domain of domains) {
    const normalized = normalizeDomainInput(domain.name);
    if (!normalized || normalized === domain.name) {
      skipped += 1;
      continue;
    }

    const existing = await prisma.domain.findFirst({ where: { name: normalized } });
    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.domain.update({ where: { id: domain.id }, data: { name: normalized } });
    updated += 1;
  }

  console.log(`Backfill complete. Updated ${updated} domains. Skipped ${skipped} domains.`);
}

backfillDomainHostnames()
  .catch((error) => {
    console.error('Failed to backfill domain hostnames.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import bcrypt from 'bcryptjs';
import { AccessType, ContentFormat, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const publisherPasswordHash = await bcrypt.hash('asd@123', 10);
  const aiClientPasswordHash = await bcrypt.hash('dra@123', 10);

  const publisherUser = await prisma.user.upsert({
    where: { email: 'publisher+demo@stack.com' },
    update: { passwordHash: publisherPasswordHash, role: 'PUBLISHER' },
    create: { email: 'publisher+demo@stack.com', passwordHash: publisherPasswordHash, role: 'PUBLISHER' },
  });

  const aiUser = await prisma.user.upsert({
    where: { email: 'fra@gmail.com' },
    update: { passwordHash: aiClientPasswordHash, role: 'AICLIENT' },
    create: { email: 'fra@gmail.com', passwordHash: aiClientPasswordHash, role: 'AICLIENT' },
  });

  const publisher = await prisma.publisher.upsert({
    where: { userId: publisherUser.id },
    update: { name: 'Stack Research Demo' },
    create: { userId: publisherUser.id, name: 'Stack Research Demo' },
  });

  const aiClient = await prisma.aIClient.upsert({
    where: { userId: aiUser.id },
    update: { name: 'FairFetch Agent Demo Client' },
    create: { userId: aiUser.id, name: 'FairFetch Agent Demo Client' },
  });

  const domain = await prisma.domain.upsert({
    where: { name: 'stack-research.demo' },
    update: { publisherId: publisher.id, verified: true, subdomainHost: 'research.stack-research.demo', subdomainCnameTarget: 'gateway.fairfetch.dev' },
    create: { publisherId: publisher.id, name: 'stack-research.demo', verified: true, subdomainHost: 'research.stack-research.demo', subdomainCnameTarget: 'gateway.fairfetch.dev' },
  });

  const summary = await prisma.license.upsert({
    where: { domainId_code: { domainId: domain.id, code: 'SUMMARY' } },
    update: { terms: 'Licensed summary retrieval for agent workflows.' },
    create: { domainId: domain.id, code: 'SUMMARY', terms: 'Licensed summary retrieval for agent workflows.' },
  });
  const display = await prisma.license.upsert({
    where: { domainId_code: { domainId: domain.id, code: 'DISPLAY' } },
    update: { terms: 'Licensed display retrieval for full analyst-note rendering.' },
    create: { domainId: domain.id, code: 'DISPLAY', terms: 'Licensed display retrieval for full analyst-note rendering.' },
  });

  const pricingRules = [
    { pathPattern: '/equity/iex', licenseId: summary.id, priceMicros: 150000, priority: 10 },
    { pathPattern: '/market-intelligence', licenseId: summary.id, priceMicros: 250000, priority: 20 },
    { pathPattern: '/pharma/glp-1', licenseId: display.id, priceMicros: 400000, priority: 30 },
  ];

  await prisma.pricingRule.deleteMany({ where: { domainId: domain.id, scope: 'DIRECTORY' } });
  await prisma.pricingRule.createMany({
    data: pricingRules.map((rule) => ({ domainId: domain.id, scope: 'DIRECTORY', ...rule, enabled: true })),
  });

  await prisma.requestLog.deleteMany({ where: { domainId: domain.id, aiClientId: aiClient.id } });
  await prisma.requestLog.createMany({
    data: [
      { domainId: domain.id, aiClientId: aiClient.id, path: '/equity/iex', statusCode: 200, bytesSent: 4821 },
      { domainId: domain.id, aiClientId: aiClient.id, path: '/market-intelligence', statusCode: 200, bytesSent: 6290 },
      { domainId: domain.id, aiClientId: aiClient.id, path: '/pharma/glp-1', statusCode: 200, bytesSent: 9102 },
    ],
  });

  await prisma.readEvent.deleteMany({ where: { domainId: domain.id, aiClientId: aiClient.id } });
  await prisma.readEvent.createMany({
    data: [
      { aiClientId: aiClient.id, publisherId: publisher.id, domainId: domain.id, url: 'https://stack-research.demo/equity/iex', path: '/equity/iex', accessType: AccessType.PAID, priceMicros: 150000, bytes: 4821 },
      { aiClientId: aiClient.id, publisherId: publisher.id, domainId: domain.id, url: 'https://stack-research.demo/market-intelligence', path: '/market-intelligence', accessType: AccessType.PAID, priceMicros: 250000, bytes: 6290 },
    ],
  });

  await prisma.ledgerTransaction.deleteMany({ where: { domainId: domain.id, aiClientId: aiClient.id, source: 'seed' } });
  await prisma.ledgerTransaction.createMany({
    data: [
      { aiClientId: aiClient.id, domainId: domain.id, idempotencyKey: 'seed-iex-summary', source: 'seed', url: 'https://stack-research.demo/equity/iex', path: '/equity/iex', licenseType: 'SUMMARY', format: ContentFormat.MARKDOWN, publisherAmountMicros: 150000, platformFeeMicros: 15000, totalMicros: 165000 },
      { aiClientId: aiClient.id, domainId: domain.id, idempotencyKey: 'seed-glp1-display', source: 'seed', url: 'https://stack-research.demo/pharma/glp-1', path: '/pharma/glp-1', licenseType: 'DISPLAY', format: ContentFormat.MARKDOWN, publisherAmountMicros: 400000, platformFeeMicros: 40000, totalMicros: 440000 },
    ],
  });

  console.log({ publisherUser: publisherUser.email, aiUser: aiUser.email, domain: domain.name, aiClient: aiClient.name });
}

main().finally(() => prisma.$disconnect());

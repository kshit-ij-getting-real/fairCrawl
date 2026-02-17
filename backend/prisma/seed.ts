import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const publisherUser = await prisma.user.upsert({
    where: { email: 'publisher@fairfetch.local' },
    update: {},
    create: { email: 'publisher@fairfetch.local', passwordHash, role: 'PUBLISHER' },
  });

  const aiUser = await prisma.user.upsert({
    where: { email: 'client@fairfetch.local' },
    update: {},
    create: { email: 'client@fairfetch.local', passwordHash, role: 'AICLIENT' },
  });

  const publisher = await prisma.publisher.upsert({ where: { userId: publisherUser.id }, update: {}, create: { userId: publisherUser.id, name: 'Demo Publisher' } });
  const aiClient = await prisma.aIClient.upsert({ where: { userId: aiUser.id }, update: {}, create: { userId: aiUser.id, name: 'Demo AI Client' } });

  const property = await prisma.domain.upsert({
    where: { name: 'news.local' },
    update: { verified: true },
    create: { publisherId: publisher.id, name: 'news.local', verified: true, subdomainHost: 'fairfetch.news.local', subdomainCnameTarget: 'edge.fairfetch.local' },
  });

  const summary = await prisma.license.upsert({ where: { domainId_code: { domainId: property.id, code: 'SUMMARY' } }, update: { terms: 'Summary use' }, create: { domainId: property.id, code: 'SUMMARY', terms: 'Summary use' } });
  const display = await prisma.license.upsert({ where: { domainId_code: { domainId: property.id, code: 'DISPLAY' } }, update: { terms: 'Display use' }, create: { domainId: property.id, code: 'DISPLAY', terms: 'Display use' } });

  await prisma.pricingRule.createMany({
    data: [
      { domainId: property.id, scope: 'DIRECTORY', pathPattern: '/premium', licenseId: summary.id, priceMicros: 100000, priority: 10 },
      { domainId: property.id, scope: 'DIRECTORY', pathPattern: '/premium', licenseId: display.id, priceMicros: 200000, priority: 20 },
    ],
    skipDuplicates: true,
  });

  console.log({ publisherUser: publisherUser.email, aiUser: aiUser.email, property: property.name, aiClient: aiClient.name });
}

main().finally(() => prisma.$disconnect());

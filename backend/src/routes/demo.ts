import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { LicenseType } from '@prisma/client';
import prisma from '../db';
import { requireDemo } from '../middleware/demo';

const router = Router();

const DEMO_PASSWORD = 'DemoPass123!';

const DEMO_USERS = {
  publishers: [
    { email: 'publisher+macro@fairfetch.demo', name: 'Macro Notes' },
    { email: 'publisher+essays@fairfetch.demo', name: 'AI Essays' },
  ],
  aiClients: [
    { email: 'aiclient+atlas@fairfetch.demo', name: 'Atlas AI', agentId: 'atlas' },
    { email: 'aiclient+ragworks@fairfetch.demo', name: 'RagWorks AI', agentId: 'ragworks' },
  ],
};

const normalize = (email: string) => email.trim().toLowerCase();
const hashKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex');

const ensureDemoUser = async (email: string, role: 'PUBLISHER' | 'AICLIENT', name: string) => {
  const normalizedEmail = normalize(email);
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { passwordHash: hash, role, demo: true },
    create: { email: normalizedEmail, passwordHash: hash, role, demo: true },
  });

  if (role === 'PUBLISHER') {
    const publisher = await prisma.publisher.upsert({
      where: { userId: user.id },
      update: { name, demo: true },
      create: { userId: user.id, name, demo: true },
    });
    return { user, publisher };
  }

  const aiClient = await prisma.aIClient.upsert({
    where: { userId: user.id },
    update: { name, demo: true },
    create: { userId: user.id, name, demo: true },
  });
  return { user, aiClient };
};

const getPriceFor = async (domainId: number, path: string, licenseType: LicenseType, aiClientId: number) => {
  const rules = await prisma.pricingRule.findMany({
    where: { domainId, active: true },
    orderBy: [{ priority: 'asc' }, { id: 'asc' }],
  });

  const aiRule = rules.find((r) => r.priorityType === 'AICLIENT' && r.matchValue === String(aiClientId));
  if (aiRule) {
    return {
      rule: aiRule,
      priceMicros: licenseType === 'DISPLAY' ? aiRule.displayPriceMicros || aiRule.priceMicros : aiRule.summarizePriceMicros || aiRule.priceMicros,
      source: 'AICLIENT',
    };
  }

  const pathRule = rules.find((r) => r.priorityType === 'PATH_PREFIX' && path.startsWith(r.matchValue || ''));
  if (pathRule) {
    return {
      rule: pathRule,
      priceMicros: licenseType === 'DISPLAY' ? pathRule.displayPriceMicros || pathRule.priceMicros : pathRule.summarizePriceMicros || pathRule.priceMicros,
      source: 'PATH_PREFIX',
    };
  }

  const globalRule = rules.find((r) => r.priorityType === 'GLOBAL');
  if (!globalRule) {
    return null;
  }

  return {
    rule: globalRule,
    priceMicros: licenseType === 'DISPLAY' ? globalRule.displayPriceMicros || globalRule.priceMicros : globalRule.summarizePriceMicros || globalRule.priceMicros,
    source: 'GLOBAL',
  };
};

const upsertAggs = async (domainId: number, aiClientId: number, priceMicros: number) => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);

  await prisma.usageAggDaily.upsert({
    where: { date_domainId_aiClientId: { date: day, domainId, aiClientId } },
    update: { requests: { increment: 1 }, spendMicros: { increment: priceMicros }, demo: true },
    create: { date: day, domainId, aiClientId, requests: 1, spendMicros: priceMicros, demo: true },
  });

  await prisma.usageAggDomain.upsert({
    where: { domainId_aiClientId: { domainId, aiClientId } },
    update: { requests: { increment: 1 }, spendMicros: { increment: priceMicros }, demo: true },
    create: { domainId, aiClientId, requests: 1, spendMicros: priceMicros, demo: true },
  });
};

router.get('/credentials', async (req, res) => {
  const demoCheck = requireDemo(req);
  if (!demoCheck.ok) return res.status(demoCheck.status).json({ error: demoCheck.error });

  return res.json({
    publisherLogins: DEMO_USERS.publishers.map((u) => u.email),
    aiTeamLogins: DEMO_USERS.aiClients.map((u) => u.email),
    instructions: ['POST /api/demo/seed with x-demo-secret header', 'Then POST /api/demo/simulate-transaction to create additional activity'],
  });
});

router.post('/seed', async (req, res) => {
  const demoCheck = requireDemo(req);
  if (!demoCheck.ok) return res.status(demoCheck.status).json({ error: demoCheck.error });

  const [macro, essays] = await Promise.all([
    ensureDemoUser(DEMO_USERS.publishers[0].email, 'PUBLISHER', DEMO_USERS.publishers[0].name),
    ensureDemoUser(DEMO_USERS.publishers[1].email, 'PUBLISHER', DEMO_USERS.publishers[1].name),
  ]);
  const [atlas, ragworks] = await Promise.all([
    ensureDemoUser(DEMO_USERS.aiClients[0].email, 'AICLIENT', DEMO_USERS.aiClients[0].name),
    ensureDemoUser(DEMO_USERS.aiClients[1].email, 'AICLIENT', DEMO_USERS.aiClients[1].name),
  ]);

  const macroDomain = await prisma.domain.upsert({
    where: { name: 'macro-notes-demo.vercel.app' },
    update: { publisherId: macro.publisher!.id, verified: true, demoVerified: true, demo: true },
    create: {
      publisherId: macro.publisher!.id,
      name: 'macro-notes-demo.vercel.app',
      verified: true,
      demoVerified: true,
      demo: true,
      subdomainHost: 'paid.macro-notes-demo.vercel.app',
      subdomainCnameTarget: 'fetch.macro-notes-demo.vercel.app',
    },
  });

  const essaysDomain = await prisma.domain.upsert({
    where: { name: 'ai-essays.vercel.app' },
    update: { publisherId: essays.publisher!.id, verified: true, demoVerified: true, demo: true },
    create: {
      publisherId: essays.publisher!.id,
      name: 'ai-essays.vercel.app',
      verified: true,
      demoVerified: true,
      demo: true,
      subdomainHost: 'paid.ai-essays.vercel.app',
      subdomainCnameTarget: 'fetch.ai-essays.vercel.app',
    },
  });

  const domains = [macroDomain, essaysDomain];
  for (const domain of domains) {
    await prisma.pricingRule.upsert({
      where: { id: domain.id * 1000 + 1 },
      update: {
        domainId: domain.id,
        scope: 'GLOBAL',
        priorityType: 'GLOBAL',
        matchValue: '*',
        summarizePriceMicros: 120000,
        displayPriceMicros: 450000,
        priceMicros: 120000,
        active: true,
        enabled: true,
        demo: true,
      },
      create: {
        id: domain.id * 1000 + 1,
        domainId: domain.id,
        scope: 'GLOBAL',
        priorityType: 'GLOBAL',
        matchValue: '*',
        summarizePriceMicros: 120000,
        displayPriceMicros: 450000,
        priceMicros: 120000,
        priority: 200,
        active: true,
        enabled: true,
        demo: true,
      },
    });
  }

  await prisma.pricingRule.upsert({
    where: { id: macroDomain.id * 1000 + 2 },
    update: {
      domainId: macroDomain.id,
      scope: 'PAGE',
      pathPattern: '/notes/*',
      priorityType: 'PATH_PREFIX',
      matchValue: '/notes/',
      summarizePriceMicros: 210000,
      displayPriceMicros: 550000,
      priceMicros: 210000,
      priority: 80,
      active: true,
      enabled: true,
      demo: true,
    },
    create: {
      id: macroDomain.id * 1000 + 2,
      domainId: macroDomain.id,
      scope: 'PAGE',
      pathPattern: '/notes/*',
      priorityType: 'PATH_PREFIX',
      matchValue: '/notes/',
      summarizePriceMicros: 210000,
      displayPriceMicros: 550000,
      priceMicros: 210000,
      priority: 80,
      active: true,
      enabled: true,
      demo: true,
    },
  });

  await prisma.pricingRule.upsert({
    where: { id: macroDomain.id * 1000 + 3 },
    update: {
      domainId: macroDomain.id,
      scope: 'BOT',
      userAgentRegex: '.*',
      priorityType: 'AICLIENT',
      matchValue: String(ragworks.aiClient!.id),
      summarizePriceMicros: 90000,
      displayPriceMicros: 420000,
      priceMicros: 90000,
      priority: 20,
      active: true,
      enabled: true,
      demo: true,
    },
    create: {
      id: macroDomain.id * 1000 + 3,
      domainId: macroDomain.id,
      scope: 'BOT',
      userAgentRegex: '.*',
      priorityType: 'AICLIENT',
      matchValue: String(ragworks.aiClient!.id),
      summarizePriceMicros: 90000,
      displayPriceMicros: 420000,
      priceMicros: 90000,
      priority: 20,
      active: true,
      enabled: true,
      demo: true,
    },
  });

  const contentSeeds = [
    { domainId: macroDomain.id, path: '/notes/how-liquidity-cycles-hit-job-markets.html', title: 'How liquidity cycles hit job markets' },
    { domainId: macroDomain.id, path: '/notes/why-interest-rates-obsess-macro-nerds.html', title: 'Why interest rates obsess macro nerds' },
    { domainId: macroDomain.id, path: '/policy.html', title: 'Policy' },
    { domainId: macroDomain.id, path: '/about.html', title: 'About' },
    { domainId: essaysDomain.id, path: '/essays/why-agents-need-markets', title: 'Why agents need markets' },
    { domainId: essaysDomain.id, path: '/essays/on-knowledge-and-compounding', title: 'On knowledge and compounding' },
  ];

  for (const item of contentSeeds) {
    await prisma.contentItem.upsert({
      where: { domainId_path: { domainId: item.domainId, path: item.path } },
      update: { title: item.title, demo: true },
      create: { ...item, demo: true },
    });
  }

  const apiKeyOutputs: Array<{ email: string; agentId: string; apiKey: string }> = [];

  for (const client of [atlas, ragworks]) {
    const plainKey = crypto.randomBytes(24).toString('hex');
    await prisma.aPIKey.create({ data: { aiClientId: client.aiClient!.id, keyHash: hashKey(plainKey), demo: true } });
    await prisma.agentIdentity.upsert({
      where: { aiClientId_agentId: { aiClientId: client.aiClient!.id, agentId: DEMO_USERS.aiClients.find((u) => normalize(u.email) === client.user.email)!.agentId } },
      update: { allowedUserAgentRe: '.*', demo: true },
      create: {
        aiClientId: client.aiClient!.id,
        agentId: DEMO_USERS.aiClients.find((u) => normalize(u.email) === client.user.email)!.agentId,
        allowedUserAgentRe: '.*',
        demo: true,
      },
    });
    apiKeyOutputs.push({
      email: client.user.email,
      agentId: DEMO_USERS.aiClients.find((u) => normalize(u.email) === client.user.email)!.agentId,
      apiKey: plainKey,
    });
  }

  const txSeeds = [
    { domainId: macroDomain.id, publisherId: macro.publisher!.id, aiClientId: atlas.aiClient!.id, path: '/notes/how-liquidity-cycles-hit-job-markets.html', licenseType: 'SUMMARY' as LicenseType },
    { domainId: macroDomain.id, publisherId: macro.publisher!.id, aiClientId: ragworks.aiClient!.id, path: '/notes/why-interest-rates-obsess-macro-nerds.html', licenseType: 'DISPLAY' as LicenseType },
    { domainId: macroDomain.id, publisherId: macro.publisher!.id, aiClientId: atlas.aiClient!.id, path: '/policy.html', licenseType: 'SUMMARY' as LicenseType },
    { domainId: essaysDomain.id, publisherId: essays.publisher!.id, aiClientId: ragworks.aiClient!.id, path: '/essays/why-agents-need-markets', licenseType: 'SUMMARY' as LicenseType },
    { domainId: essaysDomain.id, publisherId: essays.publisher!.id, aiClientId: atlas.aiClient!.id, path: '/essays/on-knowledge-and-compounding', licenseType: 'DISPLAY' as LicenseType },
    { domainId: essaysDomain.id, publisherId: essays.publisher!.id, aiClientId: ragworks.aiClient!.id, path: '/essays/on-knowledge-and-compounding', licenseType: 'SUMMARY' as LicenseType },
  ];

  const existingCount = await prisma.transaction.count({ where: { demo: true } });
  const seededTransactions = [];
  if (existingCount === 0) {
    for (const seed of txSeeds) {
      const pricing = await getPriceFor(seed.domainId, seed.path, seed.licenseType, seed.aiClientId);
      if (!pricing) continue;
      const tx = await prisma.transaction.create({ data: { ...seed, priceMicros: pricing.priceMicros, status: 'SETTLED', demo: true } });
      await prisma.ledgerTransaction.create({
        data: {
          aiClientId: seed.aiClientId,
          domainId: seed.domainId,
          idempotencyKey: `demo-seed:${tx.id}`,
          source: 'DEMO',
          url: `https://${domains.find((d) => d.id === seed.domainId)!.name}${seed.path}`,
          path: seed.path,
          licenseType: seed.licenseType,
          format: 'MARKDOWN',
          publisherAmountMicros: pricing.priceMicros,
          platformFeeMicros: Math.round(pricing.priceMicros * 0.1),
          totalMicros: pricing.priceMicros + Math.round(pricing.priceMicros * 0.1),
          matchedRuleId: pricing.rule.id,
          demo: true,
        },
      });
      await upsertAggs(seed.domainId, seed.aiClientId, pricing.priceMicros);
      seededTransactions.push(tx.id);
    }
  }

  return res.json({
    created: {
      publishers: 2,
      aiTeams: 2,
      domains: 2,
      contentItems: contentSeeds.length,
      pricingRules: 4,
      transactions: seededTransactions.length || existingCount,
    },
    logins: {
      publishers: DEMO_USERS.publishers.map((u) => u.email),
      aiTeams: DEMO_USERS.aiClients.map((u) => u.email),
    },
    apiKeys: apiKeyOutputs,
  });
});

router.post('/simulate-transaction', async (req, res) => {
  const demoCheck = requireDemo(req);
  if (!demoCheck.ok) return res.status(demoCheck.status).json({ error: demoCheck.error });

  const domainName = String(req.body?.domain || '').trim().toLowerCase();
  const path = String(req.body?.path || '/').trim();
  const licenseType = String(req.body?.licenseType || 'SUMMARY').toUpperCase() === 'DISPLAY' ? 'DISPLAY' : 'SUMMARY';
  const clientEmail = normalize(String(req.body?.aiclientEmail || DEMO_USERS.aiClients[0].email));

  const domain = await prisma.domain.findUnique({ where: { name: domainName }, include: { publisher: true } });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });

  const user = await prisma.user.findUnique({ where: { email: clientEmail }, include: { aiClient: true } });
  if (!user?.aiClient) return res.status(404).json({ error: 'AI client not found' });

  const pricing = await getPriceFor(domain.id, path, licenseType, user.aiClient.id);
  if (!pricing) return res.status(404).json({ error: 'No active pricing found for transaction' });

  const tx = await prisma.transaction.create({
    data: {
      domainId: domain.id,
      publisherId: domain.publisherId,
      aiClientId: user.aiClient.id,
      path,
      licenseType,
      priceMicros: pricing.priceMicros,
      status: 'SETTLED',
      demo: true,
    },
  });

  await prisma.ledgerTransaction.create({
    data: {
      aiClientId: user.aiClient.id,
      domainId: domain.id,
      idempotencyKey: `demo-sim:${tx.id}`,
      source: 'DEMO',
      url: `https://${domain.name}${path}`,
      path,
      licenseType,
      format: 'MARKDOWN',
      publisherAmountMicros: pricing.priceMicros,
      platformFeeMicros: Math.round(pricing.priceMicros * 0.1),
      totalMicros: pricing.priceMicros + Math.round(pricing.priceMicros * 0.1),
      matchedRuleId: pricing.rule.id,
      demo: true,
    },
  });

  await upsertAggs(domain.id, user.aiClient.id, pricing.priceMicros);

  const [byDay, byDomain] = await Promise.all([
    prisma.usageAggDaily.findMany({
      where: { aiClientId: user.aiClient.id },
      include: { domain: true },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.usageAggDomain.findMany({
      where: { aiClientId: user.aiClient.id },
      include: { domain: true },
      orderBy: { spendMicros: 'desc' },
    }),
  ]);

  return res.json({
    receipt: {
      transactionId: tx.id,
      domain: domain.name,
      path,
      licenseType,
      priceMicros: pricing.priceMicros,
      pricingSource: pricing.source,
      createdAt: tx.createdAt,
    },
    aggregates: {
      byDay: byDay.map((d) => ({ date: d.date, domain: d.domain.name, requests: d.requests, spendMicros: d.spendMicros })),
      byDomain: byDomain.map((d) => ({ domain: d.domain.name, requests: d.requests, spendMicros: d.spendMicros })),
    },
  });
});

export default router;

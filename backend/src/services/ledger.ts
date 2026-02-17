import { ContentFormat, LicenseType } from '@prisma/client';
import prisma from '../db';

type WriteTransactionInput = {
  aiClientId: number;
  domainId: number;
  tokenId?: string;
  idempotencyKey: string;
  source: 'GATEWAY' | 'TOKEN_SPEND';
  url: string;
  path: string;
  licenseType: LicenseType;
  format: ContentFormat;
  publisherAmountMicros: number;
  platformFeeMicros: number;
  matchedRuleId?: number | null;
};

export const writeLedgerTransaction = async (input: WriteTransactionInput) => {
  const totalMicros = input.publisherAmountMicros + input.platformFeeMicros;
  return prisma.$transaction(async (tx) => {
    const existing = await tx.ledgerTransaction.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return existing;

    const created = await tx.ledgerTransaction.create({
      data: {
        aiClientId: input.aiClientId,
        domainId: input.domainId,
        tokenId: input.tokenId,
        idempotencyKey: input.idempotencyKey,
        source: input.source,
        url: input.url,
        path: input.path,
        licenseType: input.licenseType,
        format: input.format,
        publisherAmountMicros: input.publisherAmountMicros,
        platformFeeMicros: input.platformFeeMicros,
        totalMicros,
        matchedRuleId: input.matchedRuleId ?? null,
      },
    });

    await tx.publisherBalance.upsert({
      where: { publisherId: (await tx.domain.findUniqueOrThrow({ where: { id: input.domainId } })).publisherId },
      update: { balanceMicros: { increment: input.publisherAmountMicros }, updatedAt: new Date() },
      create: {
        publisherId: (await tx.domain.findUniqueOrThrow({ where: { id: input.domainId } })).publisherId,
        balanceMicros: input.publisherAmountMicros,
      },
    });

    await tx.clientBalance.upsert({
      where: { clientId: input.aiClientId },
      update: { balanceMicros: { increment: totalMicros }, updatedAt: new Date() },
      create: { clientId: input.aiClientId, balanceMicros: totalMicros },
    });

    if (input.tokenId) {
      await tx.spendToken.update({ where: { id: input.tokenId }, data: { spentAt: new Date(), status: 'SPENT' } });
    }

    return created;
  });
};

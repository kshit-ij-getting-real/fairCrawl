import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ContentFormat, LicenseType } from '@prisma/client';
import prisma from '../db';
import { FairFetchError } from '../utils/errors';

const secret = process.env.FAIRFETCH_TOKEN_SECRET || 'dev-secret';

export type TokenPayload = {
  token_id: string;
  developer_org_id: number;
  property_id: number;
  host: string;
  path: string;
  full: string;
  license_type: LicenseType;
  format: ContentFormat;
  user_agent: string;
  price_micros: number;
  platform_fee_micros: number;
};

export const mintToken = async (payload: TokenPayload) => {
  const exp = Math.floor(Date.now() / 1000) + 120;
  const token = jwt.sign({ ...payload, exp }, secret, { algorithm: 'HS256' });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await prisma.spendToken.create({
    data: {
      id: payload.token_id,
      aiClientId: payload.developer_org_id,
      domainId: payload.property_id,
      canonicalHost: payload.host,
      canonicalPath: payload.path,
      canonicalFullUrl: payload.full,
      licenseType: payload.license_type,
      format: payload.format,
      userAgent: payload.user_agent,
      priceMicros: payload.price_micros,
      platformFeeMicros: payload.platform_fee_micros,
      totalMicros: payload.price_micros + payload.platform_fee_micros,
      tokenHash,
      expiresAt: new Date(exp * 1000),
    },
  });
  return { token, exp };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenPayload & { exp: number };
  } catch {
    throw new FairFetchError(401, 'INVALID_TOKEN', 'Token signature is invalid', 'Mint a fresh token from POST /api/token');
  }
};

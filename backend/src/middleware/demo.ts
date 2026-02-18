import { Request } from 'express';

export const requireDemo = (req: Request) => {
  if (process.env.DEMO_MODE !== 'true') {
    return { ok: false as const, status: 403, error: 'Demo mode disabled' };
  }

  const secret = process.env.DEMO_SECRET;
  if (!secret) {
    return { ok: false as const, status: 500, error: 'DEMO_SECRET must be set when DEMO_MODE=true' };
  }

  if (req.header('x-demo-secret') !== secret) {
    return { ok: false as const, status: 401, error: 'Invalid demo secret' };
  }

  return { ok: true as const };
};

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Prisma } from '@prisma/client';
import authRouter from './routes/auth';
import publisherRouter from './routes/publisher';
import aiClientRouter from './routes/aiclient';
import policyRouter from './routes/policy';
import gatewayRouter from './routes/gateway';
import { authenticate, requireRole } from './middleware/auth';
import { isDatabaseHealthy } from './db';

const createRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const isDatabaseUnavailableError = (err: unknown): boolean => {
  if (!(err instanceof Error)) {
    return false;
  }

  const normalized = `${err.name} ${err.message}`.toLowerCase();
  const dbUnavailableSignals = [
    'prismaclientinitializationerror',
    "can't reach database server",
    'database server',
    'database_url',
    'connection refused',
    'econnrefused',
    'econnreset',
    'etimedout',
    'timeout',
  ];

  return dbUnavailableSignals.some((signal) => normalized.includes(signal));
};

export const createApp = () => {
  const app = express();
  const allowedOrigins = (process.env.CORS_ORIGINS || 'https://fair-fetch.vercel.app,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  }));
  app.use(express.json());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || createRequestId();
    res.setHeader('x-request-id', requestId);
    (req as Request & { requestId?: string }).requestId = requestId;
    next();
  });
  app.use(morgan(':method :url :status :response-time ms req_id=:req[x-request-id]'));

  app.get('/api/health', async (_req, res, next) => {
    try {
      await isDatabaseHealthy();
      return res.json({ ok: true, db: 'up' });
    } catch (error) {
      return next(error);
    }
  });

  app.use((req, _res, next) => {
    const host = (req.headers.host || '').split(':')[0].toLowerCase();
    if (host.startsWith('fairfetch.') && !req.path.startsWith('/api/')) {
      const query = req.url.includes('?') ? `?${req.url.split('?')[1]}` : '';
      req.url = `/api/fairfetch${req.path}${query}`;
    }
    next();
  });

  app.use('/api/auth', authRouter);
  app.use('/api', policyRouter);
  app.use('/api', gatewayRouter);
  app.use('/api/publisher', authenticate, requireRole('PUBLISHER'), publisherRouter);
  app.use('/api/aiclient', authenticate, requireRole('AICLIENT'), aiClientRouter);
  app.use('/api/client', authenticate, requireRole('AICLIENT'), aiClientRouter);


  app.use('/api', (_req, res) => {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'API route not found.' });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const requestId = (req as Request & { requestId?: string }).requestId || 'unknown';
    const normalizedError = err instanceof Error ? err : new Error('Unknown error');

    console.error(
      JSON.stringify({
        level: 'error',
        requestId,
        path: req.path,
        method: req.method,
        message: normalizedError.message,
        stack: normalizedError.stack,
      })
    );

    if (req.path === '/api/health') {
      return res.status(500).json({ ok: false, db: 'down' });
    }

    if (normalizedError instanceof Prisma.PrismaClientKnownRequestError) {
      if (normalizedError.code === 'P2002') return res.status(409).json({ error: 'CONFLICT' });
      if (normalizedError.code === 'P2003') return res.status(400).json({ error: 'INVALID_REFERENCE' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};

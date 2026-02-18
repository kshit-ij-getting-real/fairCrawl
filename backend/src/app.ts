import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import publisherRouter from './routes/publisher';
import aiClientRouter from './routes/aiclient';
import policyRouter from './routes/policy';
import gatewayRouter from './routes/gateway';
import demoRouter from './routes/demo';
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

  app.use(cors());
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
  app.use('/api/demo', authenticate, requireRole('PUBLISHER'), demoRouter);

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

    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};

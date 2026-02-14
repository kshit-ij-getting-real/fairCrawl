import express from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import publisherRouter from './routes/publisher';
import aiClientRouter from './routes/aiclient';
import policyRouter from './routes/policy';
import gatewayRouter from './routes/gateway';
import { authenticate, requireRole } from './middleware/auth';

dotenv.config();

const app = express();

const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length
  ? configuredOrigins
  : ['https://fair-fetch.vercel.app', 'http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api', policyRouter);
app.use('/api', gatewayRouter);
app.use('/api/publisher', authenticate, requireRole('PUBLISHER'), publisherRouter);
app.use('/api/aiclient', authenticate, requireRole('AICLIENT'), aiClientRouter);
app.use('/api/client', authenticate, requireRole('AICLIENT'), aiClientRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FairFetch backend listening on port ${port}`);
});

import express from 'express';
import cors from 'cors';
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
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api', policyRouter);
app.use('/api', gatewayRouter);
app.use('/api/publisher', authenticate, requireRole('PUBLISHER'), publisherRouter);
app.use('/api/aiclient', authenticate, requireRole('AICLIENT'), aiClientRouter);
app.use('/api/client', authenticate, requireRole('AICLIENT'), aiClientRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FairMarket backend listening on port ${port}`);
});

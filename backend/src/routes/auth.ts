import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { getJwtSecret } from '../config';

type AuthDbClient = {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<any>;
    create: (args: { data: { email: string; passwordHash: string; role: 'PUBLISHER' | 'AICLIENT' } }) => Promise<any>;
  };
  publisher: { create: (args: { data: { userId: number; name: string } }) => Promise<any> };
  aIClient: { create: (args: { data: { userId: number; name: string } }) => Promise<any> };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

type UserRole = 'PUBLISHER' | 'AICLIENT';

const isUserRole = (value: string): value is UserRole => ['PUBLISHER', 'AICLIENT'].includes(value);

const createToken = (userId: number, role: UserRole) => {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: '7d' });
};

export const createAuthRouter = (dbClient: AuthDbClient = prisma as unknown as AuthDbClient) => {
  const router = Router();

  router.post('/signup', async (req, res, next) => {
    try {
      const { email, password, role, name } = req.body || {};

      if (!isNonEmptyString(email) || !isNonEmptyString(password) || !isNonEmptyString(name) || !isNonEmptyString(role)) {
        return res.status(400).json({ error: 'Missing or invalid fields' });
      }

      const normalizedEmail = normalizeEmail(email);
      if (!EMAIL_RE.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (!isUserRole(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const existing = await dbClient.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await dbClient.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role,
        },
      });

      if (role === 'PUBLISHER') {
        await dbClient.publisher.create({ data: { userId: user.id, name: name.trim() } });
      } else {
        await dbClient.aIClient.create({ data: { userId: user.id, name: name.trim() } });
      }

      const token = createToken(user.id, role);
      return res.status(201).json({ token, role });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body || {};

      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        return res.status(400).json({ error: 'Missing or invalid fields' });
      }

      const normalizedEmail = normalizeEmail(email);
      if (!EMAIL_RE.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await dbClient.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = createToken(user.id, user.role);
      return res.json({ token, role: user.role });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

export default createAuthRouter();

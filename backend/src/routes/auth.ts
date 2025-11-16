import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = Router();

const createToken = (userId: number, role: 'PUBLISHER' | 'AICLIENT') => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!['PUBLISHER', 'AICLIENT'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    if (role === 'PUBLISHER') {
      await prisma.publisher.create({ data: { userId: user.id, name } });
    } else {
      await prisma.aIClient.create({ data: { userId: user.id, name } });
    }

    const token = createToken(user.id, role);
    return res.json({ token, role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user.id, user.role);
    return res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

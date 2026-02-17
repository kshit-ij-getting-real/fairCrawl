import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { AddressInfo } from 'node:net';
import { createAuthRouter } from '../routes/auth';
import express from 'express';

type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  role: 'PUBLISHER' | 'AICLIENT';
};

const createFakeDb = () => {
  const users: UserRecord[] = [];

  return {
    users,
    client: {
      user: {
        findUnique: async ({ where: { email } }: { where: { email: string } }) => users.find((user) => user.email === email) || null,
        create: async ({ data }: { data: Omit<UserRecord, 'id'> }) => {
          const created = { ...data, id: users.length + 1 };
          users.push(created);
          return created;
        },
      },
      publisher: { create: async () => ({ id: 1 }) },
      aIClient: { create: async () => ({ id: 1 }) },
    },
  };
};

const withTestServer = async (handler: (baseUrl: string, fakeDb: ReturnType<typeof createFakeDb>) => Promise<void>) => {
  process.env.JWT_SECRET = 'test-secret';
  const fakeDb = createFakeDb();
  const app = express();
  app.use(express.json());
  app.use('/api/auth', createAuthRouter(fakeDb.client as any));
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'error';
    res.status(500).json({ error: message });
  });

  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await handler(baseUrl, fakeDb);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
};

test('POST /api/auth/signup creates user with hashed password', async () => {
  await withTestServer(async (baseUrl, fakeDb) => {
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '  Test@Example.com ',
        password: 'Pass123!',
        role: 'PUBLISHER',
        name: 'Demo Publisher',
      }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.ok(body.token);
    assert.equal(fakeDb.users.length, 1);
    assert.equal(fakeDb.users[0].email, 'test@example.com');
    assert.notEqual(fakeDb.users[0].passwordHash, 'Pass123!');
    assert.equal(await bcrypt.compare('Pass123!', fakeDb.users[0].passwordHash), true);
  });
});

test('POST /api/auth/login returns token for valid credentials', async () => {
  await withTestServer(async (baseUrl, fakeDb) => {
    const passwordHash = await bcrypt.hash('Pass123!', 10);
    fakeDb.users.push({ id: 5, email: 'user@example.com', passwordHash, role: 'AICLIENT' });

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'User@Example.com', password: 'Pass123!' }),
    });

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.ok(body.token);
    assert.equal(body.role, 'AICLIENT');
  });
});


test('POST /api/auth/login returns 401 for missing user', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'missing@example.com', password: 'Pass123!' }),
    });

    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error, 'Invalid credentials');
  });
});

test('POST /api/auth/login returns 401 for wrong password', async () => {
  await withTestServer(async (baseUrl, fakeDb) => {
    const passwordHash = await bcrypt.hash('Pass123!', 10);
    fakeDb.users.push({ id: 6, email: 'user@example.com', passwordHash, role: 'AICLIENT' });

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'wrong-password' }),
    });

    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error, 'Invalid credentials');
  });
});

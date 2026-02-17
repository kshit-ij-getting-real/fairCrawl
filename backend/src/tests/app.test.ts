import test from 'node:test';
import assert from 'node:assert/strict';
import { isDatabaseUnavailableError } from '../app';

test('isDatabaseUnavailableError returns true for Prisma initialization errors', () => {
  const error = new Error('Environment variable not found: DATABASE_URL.');
  error.name = 'PrismaClientInitializationError';
  assert.equal(isDatabaseUnavailableError(error), true);
});

test('isDatabaseUnavailableError returns true for DB reachability errors', () => {
  const error = new Error("Can't reach database server at localhost:5432");
  assert.equal(isDatabaseUnavailableError(error), true);
});

test('isDatabaseUnavailableError returns false for non-DB errors', () => {
  const error = new Error('Validation failed');
  assert.equal(isDatabaseUnavailableError(error), false);
});

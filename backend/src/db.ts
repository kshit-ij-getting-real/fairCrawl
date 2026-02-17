import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectToDatabase = async () => {
  const maxAttempts = Number(process.env.DB_CONNECT_MAX_ATTEMPTS || 5);
  const baseDelayMs = Number(process.env.DB_CONNECT_BASE_DELAY_MS || 400);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();
      return;
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        break;
      }
      const delay = baseDelayMs * attempt;
      console.error(`Database connection attempt ${attempt} failed. Retrying in ${delay}ms.`);
      await sleep(delay);
    }
  }

  throw lastError;
};

export const disconnectFromDatabase = async () => {
  await prisma.$disconnect();
};

export const isDatabaseHealthy = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

export default prisma;

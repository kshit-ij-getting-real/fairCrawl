import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  await prisma.$connect();
};

export const disconnectFromDatabase = async () => {
  await prisma.$disconnect();
};

export const isDatabaseHealthy = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

export default prisma;

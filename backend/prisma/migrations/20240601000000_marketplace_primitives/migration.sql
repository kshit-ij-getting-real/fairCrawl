-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('OPEN', 'PAID', 'BLOCKED');

-- AlterTable
ALTER TABLE "AIPolicy" ADD COLUMN     "accessType" "AccessType" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "priceMicros" INTEGER NOT NULL DEFAULT 0;

UPDATE "AIPolicy"
SET "accessType" = CASE
    WHEN "allowAI" = false THEN 'BLOCKED'
    WHEN "pricePer1k" > 0 THEN 'PAID'
    ELSE 'OPEN'
  END,
  "priceMicros" = COALESCE("pricePer1k", 0) * 10000;

-- CreateTable
CREATE TABLE "ReadEvent" (
    "id" TEXT NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pathPattern" TEXT,
    "accessType" "AccessType" NOT NULL,
    "bytes" INTEGER,
    "priceMicros" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublisherBalance" (
    "publisherId" INTEGER NOT NULL,
    "balanceMicros" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublisherBalance_pkey" PRIMARY KEY ("publisherId")
);

-- CreateTable
CREATE TABLE "ClientBalance" (
    "clientId" INTEGER NOT NULL,
    "balanceMicros" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientBalance_pkey" PRIMARY KEY ("clientId")
);

-- AddForeignKey
ALTER TABLE "ReadEvent" ADD CONSTRAINT "ReadEvent_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadEvent" ADD CONSTRAINT "ReadEvent_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadEvent" ADD CONSTRAINT "ReadEvent_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublisherBalance" ADD CONSTRAINT "PublisherBalance_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientBalance" ADD CONSTRAINT "ClientBalance_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


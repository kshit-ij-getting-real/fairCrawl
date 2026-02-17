-- CreateEnum
CREATE TYPE "SpendTokenStatus" AS ENUM ('ACTIVE', 'SPENT', 'EXPIRED');

-- AlterTable
ALTER TABLE "PricingRule" ADD COLUMN "licenseId" INTEGER;
ALTER TABLE "SpendToken" ADD COLUMN "agentIdentity" TEXT;
ALTER TABLE "SpendToken" ADD COLUMN "maxPriceMicros" INTEGER;
ALTER TABLE "SpendToken" ADD COLUMN "status" "SpendTokenStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublisherWebhook" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "secret" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublisherWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "License_domainId_code_key" ON "License"("domainId", "code");

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "License" ADD CONSTRAINT "License_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PublisherWebhook" ADD CONSTRAINT "PublisherWebhook_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

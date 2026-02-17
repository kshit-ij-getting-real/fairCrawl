-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLISHER', 'AICLIENT');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('OPEN', 'PAID', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('SUMMARY', 'DISPLAY');

-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('MARKDOWN', 'JSON');

-- CreateEnum
CREATE TYPE "PriceRuleScope" AS ENUM ('BOT', 'PAGE', 'KEYWORD', 'FRESHNESS', 'DIRECTORY', 'GLOBAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIClient" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "publisherId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT NOT NULL,
    "subdomainCnameTarget" TEXT,
    "subdomainHost" TEXT,
    "verificationMethod" TEXT NOT NULL DEFAULT 'DNS_TXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentIdentity" (
    "id" SERIAL NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "agentId" TEXT NOT NULL,
    "allowedUserAgentRe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "scope" "PriceRuleScope" NOT NULL,
    "pathPattern" TEXT,
    "exactUrl" TEXT,
    "userAgentRegex" TEXT,
    "keywordExpression" TEXT,
    "freshnessWindowMins" INTEGER,
    "licenseType" "LicenseType",
    "priceMicros" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentFilter" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "blockedPathRegex" TEXT,
    "cssStripSelectors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpendToken" (
    "id" TEXT NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,
    "canonicalHost" TEXT NOT NULL,
    "canonicalPath" TEXT NOT NULL,
    "canonicalFullUrl" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "format" "ContentFormat" NOT NULL,
    "userAgent" TEXT NOT NULL,
    "priceMicros" INTEGER NOT NULL,
    "platformFeeMicros" INTEGER NOT NULL,
    "totalMicros" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "spentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpendToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "domainId" INTEGER NOT NULL,
    "tokenId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "format" "ContentFormat" NOT NULL,
    "publisherAmountMicros" INTEGER NOT NULL,
    "platformFeeMicros" INTEGER NOT NULL,
    "totalMicros" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "matchedRuleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPolicy" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "pathPattern" TEXT NOT NULL,
    "allowAI" BOOLEAN NOT NULL,
    "pricePer1k" INTEGER NOT NULL,
    "maxRps" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessType" "AccessType" NOT NULL DEFAULT 'OPEN',
    "priceMicros" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AIPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIKey" (
    "id" SERIAL NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "keyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domainId" INTEGER NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "apiKeyId" INTEGER,
    "path" TEXT NOT NULL,
    "bytesSent" INTEGER NOT NULL,
    "statusCode" INTEGER NOT NULL,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageAggregate" (
    "id" SERIAL NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "domainId" INTEGER NOT NULL,
    "aiClientId" INTEGER NOT NULL,
    "apiKeyId" INTEGER,
    "requests" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "chargeCents" INTEGER NOT NULL,

    CONSTRAINT "UsageAggregate_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_userId_key" ON "Publisher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AIClient_userId_key" ON "AIClient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AgentIdentity_aiClientId_agentId_key" ON "AgentIdentity"("aiClientId", "agentId");

-- CreateIndex
CREATE UNIQUE INDEX "SpendToken_tokenHash_key" ON "SpendToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_tokenId_key" ON "LedgerTransaction"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_idempotencyKey_key" ON "LedgerTransaction"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "APIKey_keyHash_key" ON "APIKey"("keyHash");

-- AddForeignKey
ALTER TABLE "Publisher" ADD CONSTRAINT "Publisher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIClient" ADD CONSTRAINT "AIClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentIdentity" ADD CONSTRAINT "AgentIdentity_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFilter" ADD CONSTRAINT "ContentFilter_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendToken" ADD CONSTRAINT "SpendToken_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendToken" ADD CONSTRAINT "SpendToken_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "SpendToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPolicy" ADD CONSTRAINT "AIPolicy_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "APIKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageAggregate" ADD CONSTRAINT "UsageAggregate_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageAggregate" ADD CONSTRAINT "UsageAggregate_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageAggregate" ADD CONSTRAINT "UsageAggregate_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "APIKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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


-- Create enums
CREATE TYPE "LicenseType" AS ENUM ('SUMMARY', 'DISPLAY');
CREATE TYPE "ContentFormat" AS ENUM ('MARKDOWN', 'JSON');
CREATE TYPE "PriceRuleScope" AS ENUM ('BOT', 'PAGE', 'KEYWORD', 'FRESHNESS', 'DIRECTORY', 'GLOBAL');

-- Alter tables
ALTER TABLE "Domain" ADD COLUMN "subdomainCnameTarget" TEXT,
ADD COLUMN "subdomainHost" TEXT,
ADD COLUMN "verificationMethod" TEXT NOT NULL DEFAULT 'DNS_TXT';

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

CREATE TABLE "ContentFilter" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "blockedPathRegex" TEXT,
    "cssStripSelectors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentFilter_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "AgentIdentity_aiClientId_agentId_key" ON "AgentIdentity"("aiClientId", "agentId");
CREATE UNIQUE INDEX "SpendToken_tokenHash_key" ON "SpendToken"("tokenHash");
CREATE UNIQUE INDEX "LedgerTransaction_tokenId_key" ON "LedgerTransaction"("tokenId");
CREATE UNIQUE INDEX "LedgerTransaction_idempotencyKey_key" ON "LedgerTransaction"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "AgentIdentity" ADD CONSTRAINT "AgentIdentity_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContentFilter" ADD CONSTRAINT "ContentFilter_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SpendToken" ADD CONSTRAINT "SpendToken_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SpendToken" ADD CONSTRAINT "SpendToken_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_aiClientId_fkey" FOREIGN KEY ("aiClientId") REFERENCES "AIClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "SpendToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

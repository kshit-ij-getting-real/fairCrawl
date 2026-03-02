-- CreateTable
CREATE TABLE "DomainApiLog" (
    "id" SERIAL NOT NULL,
    "domainId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "path" TEXT NOT NULL,
    "url" TEXT,
    "statusCode" INTEGER,
    "bytesSent" INTEGER,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "source" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DomainApiLog_domainId_timestamp_idx" ON "DomainApiLog"("domainId", "timestamp");

-- AddForeignKey
ALTER TABLE "DomainApiLog" ADD CONSTRAINT "DomainApiLog_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

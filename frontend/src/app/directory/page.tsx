import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { fetchPublicDomains } from '../../lib/directory';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
  const domains = await fetchPublicDomains();
  const verifiedDomains = domains.filter((domain) => {
    const status =
      domain.verified === true ||
      domain.isVerified === true ||
      domain.verificationStatus?.toString().toLowerCase() === 'verified' ||
      !!domain.verifiedAt;

    return status || (!('verified' in domain) && !('isVerified' in domain) && !domain.verificationStatus && domain.verifiedAt === undefined);
  });

  const displayDomains = verifiedDomains.length > 0 ? verifiedDomains : domains;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div className="space-y-4 rounded-3xl bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo p-8 shadow-lg">
        <header className="mx-auto max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Directory</p>
          <h1 className="text-3xl font-semibold text-white">Verified AI-ready sites</h1>
          <p className="text-base text-faircrawl-textMuted">
            These domains have verified ownership and published AI access rules through FairCrawl. They are safe defaults when you want high-quality, permissioned data.
          </p>
        </header>
      </div>

      <div className="space-y-4">
        {displayDomains.map((domain) => {
          const domainName = domain.domain || domain.host || domain.name;
          const publisherName =
            domain.ownerName ||
            (typeof domain.publisher === 'object'
              ? domain.publisher?.user?.email || domain.publisher?.name
              : domain.publisher || undefined);

          return (
            <MarketingCard
              key={domain.id ?? domainName}
              className="flex flex-col gap-3 text-white md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-white">{domain.displayName ?? domainName}</h3>
                <p className="text-xs text-white/60">
                  {domainName} · Verified{publisherName ? ` by ${publisherName}` : ''}
                </p>
                <p className="text-xs text-white/50">AI rules published through FairCrawl.</p>
              </div>
              <div className="flex justify-end">
                <a
                  href={`https://${domainName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                >
                  Visit site
                </a>
              </div>
            </MarketingCard>
          );
        })}

        <MarketingCard className="text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your site here</h3>
              <p className="text-sm text-white/70">
                Verify your own site and it will show up in the directory once we go live.
              </p>
            </div>
            <div className="flex justify-end">
              <Link
                href="/signup?role=publisher"
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                Become a launch publisher
              </Link>
            </div>
          </div>
        </MarketingCard>
      </div>
    </main>
  );
}

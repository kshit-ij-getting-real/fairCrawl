import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { fetchPublicDomains } from '../../lib/directory';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
  const domains = await fetchPublicDomains();
  const verifiedDomains = domains.filter(
    (domain) =>
      domain.verified === true ||
      domain.isVerified === true ||
      domain.verificationStatus === 'verified' ||
      domain.verificationStatus === 'VERIFIED' ||
      !!domain.verifiedAt
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Directory</p>
        <h1 className="text-3xl font-semibold text-white">Verified AI-ready sites</h1>
        <p className="max-w-3xl text-base text-faircrawl-textMuted">
          These domains have verified ownership and published AI access rules through FairCrawl. They are safe defaults when you want high-quality, permissioned data.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {verifiedDomains.map((domain) => {
          const publisherName =
            domain.ownerName ||
            (typeof domain.publisher === 'object'
              ? domain.publisher?.user?.email || domain.publisher?.name
              : domain.publisher || undefined);

          return (
            <MarketingCard key={domain.name} className="flex flex-col justify-between gap-3 text-white md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{domain.displayName ?? domain.name}</h3>
                <p className="text-xs text-white/60">
                  {domain.name} · Verified{publisherName ? ` by ${publisherName}` : ''}
                </p>
                <p className="mt-1 text-xs text-white/50">AI rules published through FairCrawl.</p>
              </div>
              <div className="flex justify-end">
                <a
                  href={`https://${domain.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
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

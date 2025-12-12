import { MarketingSection } from '../../components/marketing/MarketingSection';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { SecondaryButton } from '../../components/ui/Buttons';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
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
    <MarketingSection>
      <MarketingCard className="flex flex-col gap-4 bg-gradient-to-br from-faircrawl-heroFrom to-faircrawl-heroTo text-white">
        <SectionEyebrow className="text-white/70">Directory</SectionEyebrow>
        <h1 className="text-3xl font-semibold text-white">Verified AI-ready sites</h1>
        <p className="text-base text-faircrawl-textMuted">
          These domains have verified ownership and published AI access rules through FairFetch. They’re good defaults when you want high-quality, permissioned training data with clear licensing terms.
        </p>
      </MarketingCard>

      {displayDomains.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {displayDomains.map((domain) => {
            const domainName = domain.domain || domain.host || domain.name;
            const publisherName =
              domain.ownerName ||
              (typeof domain.publisher === 'object'
                ? domain.publisher?.user?.email || domain.publisher?.name
                : domain.publisher || undefined);

            return (
              <MarketingCard key={domain.id ?? domain.domain ?? domainName} className="text-white">
                <h3 className="text-lg font-semibold">{domain.displayName ?? domainName}</h3>
                <p className="mt-1 text-sm text-white/70">
                  Verified by {publisherName ?? 'site owner'}. AI rules published through FairFetch.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-white/50">{domainName}</span>
                  {domain.publicUrl && (
                    <SecondaryButton href={domain.publicUrl}>Visit site</SecondaryButton>
                  )}
                </div>
              </MarketingCard>
            );
          })}
        </div>
      ) : (
        <MarketingCard className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-base font-semibold">Your site here</h3>
            <p className="mt-1 text-sm text-white/70">
              Verify your own site and it will show up in the directory once we go live.
            </p>
          </div>
          <SecondaryButton href="/signup?role=publisher">Become a launch publisher</SecondaryButton>
        </MarketingCard>
      )}
    </MarketingSection>
  );
}

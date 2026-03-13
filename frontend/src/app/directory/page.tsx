import { SubpageHero } from '../../components/marketing/SubpageHero';
import { MarketingCard } from '../../components/ui/MarketingCard';
import { SecondaryButton } from '../../components/ui/Buttons';
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


  return (
    <main className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="space-y-8 lg:space-y-12">
        <SubpageHero
          eyebrow="Directory"
          title="Verified AI-ready sites"
          description="These domains have verified ownership and published AI access rules through FairFetch. They are good defaults when you want permissioned data with clear licensing terms."
        />

        <div className="space-y-4">
          {verifiedDomains.map((domain) => {
            const domainName = domain.domain || domain.host || domain.name;
            const visitUrl = domain.publicUrl || (domainName ? `https://${domainName}` : '#');
            const publisherName =
              domain.ownerName ||
              (typeof domain.publisher === 'object'
                ? domain.publisher?.user?.email || domain.publisher?.name
                : domain.publisher || undefined);

            return (
              <MarketingCard
                key={domain.id ?? domainName}
                className="flex flex-col gap-3 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,242,255,0.84))] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[#25306d]">{domain.displayName ?? domainName}</h3>
                  <p className="text-xs text-[#7b82a8]">
                    Verified by {publisherName ?? 'site owner'}. AI rules published through FairFetch.
                  </p>
                  {domain.pricingFromMicros !== undefined && (
                    <p className="text-xs text-[#7b82a8]">Pricing from {domain.pricingFromMicros} micros</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <SecondaryButton href={visitUrl} target="_blank" rel="noreferrer">
                    Visit site
                  </SecondaryButton>
                </div>
              </MarketingCard>
            );
          })}

          <MarketingCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,244,255,0.84))]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#25306d]">Your site here</h3>
                <p className="text-sm leading-7 text-[#6e759b]">
                  Verified domains appear in the directory after ownership checks are complete.
                </p>
              </div>
              <div className="flex justify-end">
                <SecondaryButton href="/signup?role=publisher">Become a launch publisher</SecondaryButton>
              </div>
            </div>
          </MarketingCard>
        </div>
      </div>
    </main>
  );
}

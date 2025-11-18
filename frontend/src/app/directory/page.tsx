import Link from 'next/link';

import { MarketingCard } from '../../components/ui/MarketingCard';
import { SectionActions } from '../../components/ui/SectionActions';
import { buildDirectoryEntries, DirectoryEntry, fetchPublicDomains } from '../../lib/directory';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
  const domains = await fetchPublicDomains();
  const directoryEntries: DirectoryEntry[] = buildDirectoryEntries(domains);
  const verifiedEntries = directoryEntries.filter((entry) => entry.verified);
  const ctaEntry = directoryEntries.find((entry) => !entry.verified);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-faircrawl-accent">Directory</p>
        <h1 className="text-3xl font-semibold text-white">Verified AI-ready sites</h1>
        <p className="max-w-3xl text-base text-faircrawl-textMuted">
          These domains have verified ownership and published AI access rules through FairCrawl. They are safe defaults when you want high-quality, permissioned data.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {verifiedEntries.map((entry, idx) => (
          <MarketingCard key={`${entry.title || entry.domain}-${idx}`} className="space-y-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{entry.title || entry.domain}</h2>
                <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs font-semibold text-faircrawl-accent">Verified</span>
              </div>
              <p className="text-sm text-white/70">{entry.subtitle}</p>
              <p className="text-sm text-white/60">AI rules published through FairCrawl.</p>
            </div>
            <SectionActions>
              <a
                href={entry.link || (entry.domain ? `https://${entry.domain}` : '#')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
              >
                Visit site
              </a>
            </SectionActions>
          </MarketingCard>
        ))}
      </div>

      {ctaEntry && (
        <MarketingCard className="space-y-3 text-white">
          <h2 className="text-2xl font-semibold">{ctaEntry.title}</h2>
          <p className="text-sm text-white/70">{ctaEntry.description}</p>
          <SectionActions>
            <Link
              href={(ctaEntry.link as string) || '/signup?role=publisher'}
              className="inline-flex items-center justify-center rounded-full bg-faircrawl-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-faircrawl-accentSoft"
            >
              {ctaEntry.cta || 'Become a launch publisher'}
            </Link>
          </SectionActions>
        </MarketingCard>
      )}
    </div>
  );
}

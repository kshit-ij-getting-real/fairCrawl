import { buildDirectoryEntries, DirectoryEntry, fetchPublicDomains } from '../../lib/directory';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
  const domains = await fetchPublicDomains();
  const directoryEntries: DirectoryEntry[] = buildDirectoryEntries(domains);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-faircrawl-accent">Directory</p>
        <h1 className="text-3xl font-semibold text-white">Verified AI-ready sites</h1>
        <p className="text-base text-faircrawl-textMuted max-w-3xl">
          Browse launch publishers who have verified ownership and published AI access rules through FairCrawl. Use this list as a safe starting point for permissioned data.
        </p>
      </header>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {directoryEntries.map((entry, idx) => (
          <div key={`${entry.title || entry.domain}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white">{entry.title || entry.domain}</h2>
                {entry.verified && (
                  <span className="rounded-full bg-faircrawl-accent/20 px-3 py-1 text-xs font-semibold text-faircrawl-accent">Verified</span>
                )}
              </div>
              {entry.domain && <p className="text-sm text-faircrawl-textMuted">{entry.domain}</p>}
              {entry.publisher && <p className="text-xs text-slate-200">Publisher: {entry.publisher}</p>}
              {entry.description && <p className="text-sm text-slate-200 leading-relaxed">{entry.description}</p>}
            </div>
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {entry.link ? (
                <a
                  href={entry.link}
                  className="inline-flex w-fit items-center rounded-full bg-faircrawl-accent px-4 py-2 text-sm font-semibold text-white hover:bg-faircrawl-accentSoft transition"
                >
                  {entry.cta || 'Visit site'}
                </a>
              ) : (
                <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  {entry.cta || 'Verified'}
                </span>
              )}
              {entry.policyLink && (
                <a
                  href={entry.policyLink}
                  className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  View policy
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

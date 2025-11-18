import { API_BASE } from './config';

type PublicDomain = {
  name: string;
  verified?: boolean;
  publisher?:
    | string
    | {
        name?: string;
        user?: { email?: string };
      };
  policies?: { pathPattern?: string; pricePer1k?: number; allowAI?: boolean }[];
};

export type DirectoryEntry = {
  title?: string;
  domain?: string;
  description?: string;
  subtitle?: string;
  tags?: string[];
  verified?: boolean;
  policyLink?: string;
  link?: string;
  cta?: string;
  publisher?: string;
};

const ctaDirectoryEntry: DirectoryEntry = {
  title: 'Your site here',
  description: 'Verify your own site and it will show up in the directory once we go live.',
  link: '/signup?role=publisher',
  cta: 'Become a launch publisher',
};

export async function fetchPublicDomains(): Promise<PublicDomain[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/domains`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function buildDirectoryEntries(domains: PublicDomain[]): DirectoryEntry[] {
  const verifiedDomains = domains.filter((domain) => domain.verified);

  const directoryEntries = verifiedDomains.map((domain) => {
    const publisherEmail = typeof domain.publisher === 'object' ? domain.publisher?.user?.email : undefined;
    const publisherName =
      typeof domain.publisher === 'string'
        ? domain.publisher
        : domain.publisher?.user?.email || domain.publisher?.name;

    const subtitle = publisherEmail ? `Verified by ${publisherEmail}` : publisherName ? `Verified by ${publisherName}` : 'Verified.';

    return {
      title: domain.name,
      domain: domain.name,
      subtitle,
      link: domain.name ? `https://${domain.name}` : undefined,
      cta: 'Visit site',
      verified: true,
    } satisfies DirectoryEntry;
  });

  return [...directoryEntries, ctaDirectoryEntry];
}

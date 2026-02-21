import { API_BASE_URL } from './apiBase';

type PublicDomain = {
  id?: string | number;
  name: string;
  domain?: string;
  host?: string;
  publicUrl?: string;
  verified?: boolean;
  isVerified?: boolean;
  verifiedAt?: string | null;
  verificationStatus?: string;
  displayName?: string;
  ownerName?: string;
  pricingFromMicros?: number;
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
  description: 'Verified domains appear in the directory after ownership checks are complete.',
  link: '/signup?role=publisher',
  cta: 'Become a launch publisher',
};

export async function fetchPublicDomains(): Promise<PublicDomain[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/domains`, { cache: 'no-store' });
    if (!res.ok) return [];
    const payload = await res.json();
    const data = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.domains)
      ? payload.domains
      : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

    return data.map((domain: PublicDomain) => ({
      ...domain,
      domain: domain.domain ?? domain.host ?? domain.name,
      verified:
        domain.verified === true ||
        domain.isVerified === true ||
        domain.verificationStatus?.toString().toLowerCase() === 'verified' ||
        !!domain.verifiedAt ||
        domain.verified,
    }));
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

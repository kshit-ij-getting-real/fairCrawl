import { API_BASE } from './config';

type PublicDomain = {
  name: string;
  publisher?: string;
  policies?: { pathPattern?: string; pricePer1k?: number; allowAI?: boolean }[];
};

export type DirectoryEntry = {
  title?: string;
  domain?: string;
  description?: string;
  tags?: string[];
  verified?: boolean;
  policyLink?: string;
  link?: string;
  cta?: string;
  publisher?: string;
};

const staticDirectoryEntries: DirectoryEntry[] = [
  {
    title: 'AI Essays Library',
    domain: 'ai-essays-5yft.vercel.app',
    description: 'Short essays drafted with AI, edited by humans. A testbed for transparent AI usage policies.',
    tags: ['Demo', 'Policy: coming soon'],
    link: 'https://ai-essays-5yft.vercel.app/',
    policyLink: 'https://ai-essays-5yft.vercel.app/.well-known/faircrawl.json',
    cta: 'Visit site',
    verified: true,
  },
  {
    title: 'Macro Notes',
    domain: 'macro-notes-demo.vercel.app',
    description: 'Plain-English notes on how macro cycles hit real life. Used to test path-level policies.',
    tags: ['Demo', 'Policy: coming soon'],
    link: 'https://macro-notes-demo.vercel.app/',
    policyLink: 'https://macro-notes-demo.vercel.app/.well-known/faircrawl.json',
    cta: 'Visit site',
    verified: true,
  },
  {
    title: 'Your site here',
    description: 'Verify your own site and it will show up in the directory once we go live.',
    tags: ['Coming soon'],
    link: '/signup?role=publisher',
    cta: 'Become a launch publisher',
  },
];

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
  return [
    ...staticDirectoryEntries,
    ...domains.map((domain) => ({
      title: domain.name,
      domain: domain.name,
      description: domain.publisher ? `Verified by ${domain.publisher}.` : 'Live on FairCrawl.',
      tags:
        domain.policies && domain.policies.length > 0
          ? domain.policies.slice(0, 3).map((policy) => policy.pathPattern || 'Policy: coming soon')
          : ['Policy: coming soon'],
      policyLink: domain.name ? `https://${domain.name}/.well-known/faircrawl.json` : undefined,
      cta: 'View site',
      link: domain.name ? `https://${domain.name}` : undefined,
      verified: true,
      publisher: domain.publisher,
    })),
  ];
}

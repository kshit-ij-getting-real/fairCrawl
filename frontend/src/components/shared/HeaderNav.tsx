import Link from 'next/link';

const links = [
  ['How it works', '/how-it-works'],
  ['Creators', '/creators'],
  ['AI teams', '/ai-teams'],
  ['Directory', '/directory'],
] as const;

export function HeaderNav() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6d739b]">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="transition hover:text-[#33408f]">
          {label}
        </Link>
      ))}
    </div>
  );
}

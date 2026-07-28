import Link from 'next/link';

const links = [
  ['Product', '/#transaction-room'],
  ['How it works', '/how-it-works'],
  ['For providers', '/creators'],
  ['For AI teams', '/ai-teams'],
] as const;

export function HeaderNav() {
  return (
    <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm text-[#6c6662] md:flex">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="font-medium transition hover:text-[#171717]">
          {label}
        </Link>
      ))}
    </nav>
  );
}

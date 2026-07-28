import Link from 'next/link';

const links = [
  ['Product', '/#workspace'],
  ['How it works', '/how-it-works'],
  ['For providers', '/creators'],
  ['For AI teams', '/ai-teams'],
] as const;

export function HeaderNav() {
  return (
    <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm text-[#64748b] md:flex">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className="font-medium transition hover:text-[#0f172a]">
          {label}
        </Link>
      ))}
    </nav>
  );
}

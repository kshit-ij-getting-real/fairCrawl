import Link from 'next/link';
import { ReactNode } from 'react';

export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">
      {children}
    </Link>
  );
}

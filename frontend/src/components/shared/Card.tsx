import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">{children}</div>;
}

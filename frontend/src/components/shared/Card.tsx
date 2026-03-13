import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.74)] p-4 shadow-[0_18px_48px_rgba(126,120,210,0.12)] backdrop-blur-xl">{children}</div>;
}

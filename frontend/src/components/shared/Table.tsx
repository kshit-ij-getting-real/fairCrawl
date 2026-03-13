import { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full border-collapse text-sm text-[#3c457f]">{children}</table>;
}

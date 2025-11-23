import * as React from 'react';

import { cn } from '../../lib/cn';

export function MarketingCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-6 shadow-xl shadow-black/40 md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

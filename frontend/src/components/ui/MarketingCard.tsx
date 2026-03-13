import * as React from 'react';

import { cn } from '../../lib/cn';

export function MarketingCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'w-full rounded-[28px] border border-[rgba(126,135,212,0.18)] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_24px_60px_rgba(125,120,210,0.15)] backdrop-blur-xl md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

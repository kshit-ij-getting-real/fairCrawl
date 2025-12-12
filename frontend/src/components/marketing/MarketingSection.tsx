import * as React from 'react';

import { cn } from '../../lib/cn';

export function MarketingSection({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main className={cn('px-6 py-16 md:py-20', className)}>
      <div className="mx-auto max-w-6xl space-y-12 md:space-y-16">{children}</div>
    </main>
  );
}

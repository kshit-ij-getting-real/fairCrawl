import * as React from 'react';

import { cn } from '../../lib/cn';

interface SectionEyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SectionEyebrow({ className, children, ...props }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        'mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

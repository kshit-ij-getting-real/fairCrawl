import * as React from 'react';

import { cn } from '../../lib/cn';

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  valueClassName?: string;
}

export function MetricCard({
  label,
  value,
  caption,
  className,
  valueClassName,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn('rounded-2xl border border-white/10 bg-white/[0.03] p-4', className)}
      {...props}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</p>
      <div className={cn('mt-2 text-2xl font-semibold text-white', valueClassName)}>{value}</div>
      {caption && <p className="mt-1 text-xs text-white/60">{caption}</p>}
    </div>
  );
}

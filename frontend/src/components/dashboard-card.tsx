import React from 'react';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardCard({ className = '', children, ...props }: DashboardCardProps) {
  return (
    <div
      className={`w-full rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 shadow-lg shadow-black/40 p-6 md:p-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

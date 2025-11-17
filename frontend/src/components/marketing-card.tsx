import React from 'react';

interface MarketingCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MarketingCard({ className = '', children, ...props }: MarketingCardProps) {
  return (
    <div
      className={`w-full rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 shadow-xl shadow-black/40 p-6 md:p-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

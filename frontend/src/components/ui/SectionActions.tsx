import * as React from 'react';

interface SectionActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SectionActions({ className, children, ...props }: SectionActionsProps) {
  const classes = ['mt-6 flex flex-wrap items-center justify-end gap-3', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

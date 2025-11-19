import Link from 'next/link';
import * as React from 'react';

import { cn } from '../../lib/cn';

type LinkButtonProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'children'> & {
  children?: React.ReactNode;
};

type NativeButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: React.ReactNode;
};

type ButtonLikeProps = { className?: string; children: React.ReactNode } & (LinkButtonProps | NativeButtonProps);

function createButtonComponent(baseClasses: string) {
  return function ButtonComponent({ className, children, ...props }: ButtonLikeProps) {
    const classes = cn(baseClasses, className);

    if ('href' in props && props.href) {
      return (
        <Link {...(props as LinkButtonProps)} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button {...(props as NativeButtonProps)} className={classes}>
        {children}
      </button>
    );
  };
}

export const PrimaryButton = createButtonComponent(
  'inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:opacity-60',
);

export const SecondaryButton = createButtonComponent(
  'inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 disabled:cursor-not-allowed disabled:opacity-60',
);

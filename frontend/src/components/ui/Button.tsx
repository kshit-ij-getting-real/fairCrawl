import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

type LinkButtonProps = BaseButtonProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'children'>;
type NativeButtonProps = BaseButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'inline-flex items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)] transition duration-200 hover:translate-y-[-1px] hover:bg-[#1e293b] hover:shadow-[0_16px_28px_rgba(15,23,42,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#334155] disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center rounded-full border border-[#cbd5e1] bg-white text-sm font-semibold text-[#334155] transition duration-200 hover:border-[#94a3b8] hover:bg-[#f8fafc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64748b] disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'inline-flex items-center justify-center rounded-full text-sm font-semibold text-[#475569] transition duration-200 hover:bg-[#f1f5f9] hover:text-[#0f172a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#94a3b8] disabled:cursor-not-allowed disabled:opacity-60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2 text-sm',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(variantClasses[variant], sizeClasses[size], className);

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
}

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
    'inline-flex items-center justify-center rounded-full bg-[#ff4f1f] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(200,59,22,0.16)] transition duration-200 hover:translate-y-[-1px] hover:bg-[#e63f14] hover:shadow-[0_16px_28px_rgba(200,59,22,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f1f] disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center rounded-full border border-[#8f8781] bg-white text-sm font-semibold text-[#292624] transition duration-200 hover:border-[#625d59] hover:bg-[#f7f3f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f8781] disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'inline-flex items-center justify-center rounded-full text-sm font-semibold text-[#625d59] transition duration-200 hover:bg-[#eee9e5] hover:text-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8f8781] disabled:cursor-not-allowed disabled:opacity-60',
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

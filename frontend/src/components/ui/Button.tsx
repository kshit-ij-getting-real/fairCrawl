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
    'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4f58da] via-[#676df0] to-[#a95ff2] text-sm font-semibold text-white transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_30px_rgba(103,109,240,0.28)] shadow-[0_14px_24px_rgba(86,92,220,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777df1] disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center rounded-full border border-[rgba(104,116,214,0.32)] bg-[rgba(255,255,255,0.82)] text-sm font-semibold text-[#4c56cf] transition duration-200 hover:border-[rgba(104,116,214,0.52)] hover:bg-white hover:shadow-[0_12px_24px_rgba(145,139,239,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b36af4] disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'inline-flex items-center justify-center rounded-full text-sm font-semibold text-[#5a63d8] transition duration-200 hover:bg-[rgba(112,124,232,0.1)] hover:text-[#323b9f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b8befd] disabled:cursor-not-allowed disabled:opacity-60',
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

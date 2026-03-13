import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Button as SharedButton } from '@/components/ui/Button';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-[rgba(126,135,212,0.2)] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_22px_54px_rgba(125,121,214,0.14)] backdrop-blur-xl', className)} {...props} />;
}

export function Button({ className, variant = 'primary', size = 'sm', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' }) {
  return <SharedButton className={className} variant={variant} size={size} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-xl border border-[rgba(125,133,211,0.24)] bg-[rgba(255,255,255,0.82)] px-3 py-2 text-sm text-[#2a3274] placeholder:text-[#8e93b1] focus:border-[#6a74e6] focus:outline-none focus:ring-2 focus:ring-[rgba(133,139,242,0.18)]', className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('w-full rounded-xl border border-[rgba(125,133,211,0.24)] bg-[rgba(255,255,255,0.82)] px-3 py-2 text-sm text-[#2a3274] focus:border-[#6a74e6] focus:outline-none focus:ring-2 focus:ring-[rgba(133,139,242,0.18)]', className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: 'muted' | 'success' | 'warning' }) {
  const tone = (props as any).tone || 'muted';
  const { tone: _tone, ...rest } = props as any;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'muted' && 'border border-[rgba(112,124,232,0.16)] bg-[rgba(112,124,232,0.12)] text-[#515cd8]',
        tone === 'success' && 'border border-[rgba(88,211,176,0.16)] bg-[rgba(88,211,176,0.12)] text-[#0f8a69]',
        tone === 'warning' && 'border border-[rgba(237,167,95,0.18)] bg-[rgba(237,167,95,0.14)] text-[#a3641a]',
        className
      )}
      {...rest}
    />
  );
}

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full text-sm text-[#3d467f]', className)} {...props} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[rgba(126,135,212,0.24)] bg-[rgba(255,255,255,0.56)] p-8 text-center">
      <p className="text-base font-semibold text-[#2f397e]">{title}</p>
      <p className="mt-2 text-sm text-[#7d84a8]">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[rgba(135,143,223,0.18)]', className)} />;
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(70,78,142,0.18)] p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-[28px] border border-[rgba(126,135,212,0.22)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_28px_70px_rgba(123,116,210,0.24)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2a3274]">{title}</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Drawer = Modal;

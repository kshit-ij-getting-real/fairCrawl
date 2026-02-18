import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TableHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-white/10 bg-faircrawl-surface p-5 shadow-sm', className)} {...props} />;
}

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  const variant = (props as any).variant || 'primary';
  const { variant: _variant, ...rest } = props as any;
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition',
        variant === 'primary' && 'bg-faircrawl-accent text-white hover:bg-faircrawl-accentSoft',
        variant === 'secondary' && 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
        variant === 'ghost' && 'text-faircrawl-textMuted hover:text-white',
        className
      )}
      {...rest}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-lg border border-white/15 bg-[#050815] px-3 py-2 text-sm text-white placeholder:text-faircrawl-textMuted focus:border-faircrawl-accent focus:outline-none', className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('w-full rounded-lg border border-white/15 bg-[#050815] px-3 py-2 text-sm text-white focus:border-faircrawl-accent focus:outline-none', className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: 'muted' | 'success' | 'warning' }) {
  const tone = (props as any).tone || 'muted';
  const { tone: _tone, ...rest } = props as any;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'muted' && 'bg-white/10 text-faircrawl-textMuted',
        tone === 'success' && 'bg-emerald-500/20 text-emerald-300',
        tone === 'warning' && 'bg-amber-500/20 text-amber-300',
        className
      )}
      {...rest}
    />
  );
}

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full text-sm text-faircrawl-textMain', className)} {...props} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-faircrawl-textMuted">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/10', className)} />;
}

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-xl border border-white/20 bg-faircrawl-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Drawer = Modal;

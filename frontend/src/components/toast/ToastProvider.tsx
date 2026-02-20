'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/dashboard/primitives';

type ToastTone = 'success' | 'error';

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const fallback = {
  success: (_message: string) => undefined,
  error: (_message: string) => undefined,
};

let toastRef: ToastContextValue = fallback;

export const toast = {
  success: (message: string) => toastRef.success(message),
  error: (message: string) => toastRef.error(message),
};

export function useToast() {
  return useContext(ToastContext) || fallback;
}

const TOAST_DURATION_MS = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
  }, []);

  const push = useCallback((tone: ToastTone, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, tone, message }]);
    window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(() => ({
    success: (message) => push('success', message),
    error: (message) => push('error', message),
  }), [push]);

  useEffect(() => {
    toastRef = value;
    return () => {
      toastRef = fallback;
    };
  }, [value]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto rounded-lg border px-3 py-3 shadow-lg ${item.tone === 'success' ? 'border-emerald-300/30 bg-emerald-500/20 text-emerald-100' : 'border-red-300/30 bg-red-500/20 text-red-100'}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">{item.message}</p>
              <Button size="sm" variant="ghost" className="px-2 py-1" onClick={() => dismiss(item.id)}>Close</Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

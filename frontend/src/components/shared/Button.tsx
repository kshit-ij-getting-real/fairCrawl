import { Button as DashboardButton, type ButtonProps } from '@/components/ui/Button';

/** @deprecated Use `@/components/ui/Button` directly. */
export function Button(props: ButtonProps) {
  return <DashboardButton {...props} />;
}

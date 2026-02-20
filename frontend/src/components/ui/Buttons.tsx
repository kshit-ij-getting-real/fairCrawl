import { Button, type ButtonProps } from './Button';

type SharedButtonProps = ButtonProps;

export function PrimaryButton(props: SharedButtonProps) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: SharedButtonProps) {
  return <Button {...props} variant="secondary" />;
}

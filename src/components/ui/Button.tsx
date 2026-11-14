import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-dark';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--near-black)] text-[var(--off-white)] border border-[var(--near-black)] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)]',
  secondary:
    'bg-transparent text-[var(--near-black)] border border-[var(--border-light-strong)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]',
  ghost:
    'bg-transparent text-current border border-transparent hover:text-[var(--electric-blue)]',
  'on-dark':
    'bg-[var(--off-white)] text-[var(--near-black)] border border-[var(--off-white)] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)]',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2.5 min-h-[44px] px-6 py-2.5 text-sm font-semibold tracking-tight whitespace-nowrap shrink-0 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  variant = 'primary',
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

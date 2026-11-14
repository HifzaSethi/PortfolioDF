import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'on-dark';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--btn-primary-bg,var(--near-black))] text-[var(--btn-primary-text,var(--off-white))] border border-[var(--btn-primary-bg,var(--near-black))] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)]',
  gradient:
    'df-gradient-accent text-[var(--near-black)] border border-transparent hover:brightness-105',
  secondary:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--link-accent)] hover:text-[var(--link-accent)]',
  ghost:
    'bg-transparent text-current border border-transparent hover:text-[var(--link-accent)]',
  'on-dark':
    'bg-[var(--off-white)] text-[var(--near-black)] border border-[var(--off-white)] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)]',
};

const BASE_CLASSES =
  'group/btn inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  skewed?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  skewed = true,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${skewed ? 'df-slant-block' : ''} ${className}`}
      {...props}
    >
      <span className={`inline-flex items-center justify-center gap-2.5 ${skewed ? 'df-unslant' : ''}`}>
        {children}
      </span>
    </button>
  );
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  skewed?: boolean;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  variant = 'primary',
  skewed = true,
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${skewed ? 'df-slant-block' : ''} ${className}`}
      {...props}
    >
      <span className={`inline-flex items-center justify-center gap-2.5 ${skewed ? 'df-unslant' : ''}`}>
        {children}
      </span>
    </Link>
  );
}

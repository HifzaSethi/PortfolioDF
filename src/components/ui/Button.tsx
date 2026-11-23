import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useMagnetic } from '../../hooks/useMagnetic';

export type ButtonVariant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'on-dark';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'df-btn-primary bg-[var(--btn-primary-bg,var(--near-black))] text-[var(--btn-primary-text,var(--off-white))] border border-[var(--btn-primary-bg,var(--near-black))] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)]',
  gradient:
    'df-btn-primary df-gradient-accent text-[var(--near-black)] border border-transparent hover:brightness-105',
  secondary:
    'df-btn-secondary bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--link-accent)] hover:text-[var(--link-accent)]',
  ghost:
    'bg-transparent text-current border border-transparent hover:text-[var(--link-accent)]',
  'on-dark':
    'df-btn-primary bg-[var(--off-white)] text-[var(--near-black)] border border-[var(--off-white)] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)]',
};

const BASE_CLASSES =
  'group/btn df-interactive items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-3 disabled:opacity-50 disabled:cursor-not-allowed';

const DISPLAY_OVERRIDE_RE = /(?:^|\s)(?:[a-z]+:)*(hidden|flex|inline-flex|block|inline-block|grid|inline-grid)(?=\s|$)/;

function resolveDisplayClass(className: string): string {
  return DISPLAY_OVERRIDE_RE.test(className) ? '' : 'inline-flex';
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  skewed?: boolean;
  magnetic?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  skewed = true,
  magnetic = false,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>(magnetic);
  const displayClass = resolveDisplayClass(className);

  const buttonEl = (
    <button
      type={type}
      className={`${BASE_CLASSES} ${displayClass} ${VARIANT_CLASSES[variant]} ${skewed ? 'df-slant-block' : ''} ${className}`}
      {...props}
    >
      <span
        className={`relative z-10 inline-flex items-center justify-center gap-2.5 ${skewed ? 'df-unslant' : ''}`}
      >
        {children}
      </span>
    </button>
  );

  if (!magnetic) return buttonEl;

  return (
    <span
      ref={magneticRef}
      className="inline-flex transition-[translate] duration-[220ms] ease-[var(--ease-out)]"
    >
      {buttonEl}
    </span>
  );
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  skewed?: boolean;
  magnetic?: boolean;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  variant = 'primary',
  skewed = true,
  magnetic = false,
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>(magnetic);
  const displayClass = resolveDisplayClass(className);

  const linkEl = (
    <Link
      className={`${BASE_CLASSES} ${displayClass} ${VARIANT_CLASSES[variant]} ${skewed ? 'df-slant-block' : ''} ${className}`}
      {...props}
    >
      <span
        className={`relative z-10 inline-flex items-center justify-center gap-2.5 ${skewed ? 'df-unslant' : ''}`}
      >
        {children}
      </span>
    </Link>
  );

  if (!magnetic) return linkEl;

  return (
    <span
      ref={magneticRef}
      className="inline-flex transition-[translate] duration-[220ms] ease-[var(--ease-out)]"
    >
      {linkEl}
    </span>
  );
}

import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  accent?: 'violet' | 'magenta' | 'blue';
  tone?: 'light' | 'dark';
  className?: string;
}

const ACCENT_FILL: Record<NonNullable<TagProps['accent']>, string> = {
  violet: 'bg-[var(--violet)] text-[var(--near-black)]',
  magenta: 'bg-[var(--magenta)] text-[var(--near-black)]',
  blue: 'bg-[var(--electric-blue)] text-[var(--off-white)]',
};

/**
 * Skewed parallelogram label chip matching brand --slant (-12deg) geometry.
 * Uses approved Violet, Magenta, or Electric Blue fill with WCAG AA verified ink contrast.
 */
export function Tag({ children, accent = 'violet', className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] df-slant-block select-none ${ACCENT_FILL[accent]} ${className}`}
    >
      <span className="df-unslant inline-block">{children}</span>
    </span>
  );
}

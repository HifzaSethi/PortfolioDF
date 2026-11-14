import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Clean architectural text tag — avoids rounded-full candy pills per Zero-Pill discipline.
 */
export function Tag({ children, tone = 'light', className = '' }: TagProps) {
  const isDark = tone === 'dark';
  return (
    <span
      className={`inline-flex items-center gap-2 border-b pb-1 text-xs font-semibold tracking-[0.06em] ${
        isDark
          ? 'border-[var(--border-dark-strong)] text-[var(--off-white)]/85'
          : 'border-[var(--border-light-strong)] text-[var(--near-black)]/85'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 bg-[var(--electric-blue)] shrink-0"
      />
      <span>{children}</span>
    </span>
  );
}

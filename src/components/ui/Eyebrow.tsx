import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  number?: string;
  tone?: 'light' | 'dark' | 'auto';
  accent?: 'magenta' | 'blue' | 'violet';
  className?: string;
}

export function Eyebrow({
  children,
  number,
  tone = 'auto',
  accent = 'magenta',
  className = '',
}: EyebrowProps) {
  const accentColor =
    accent === 'blue'
      ? 'bg-[var(--electric-blue)]'
      : accent === 'violet'
        ? 'bg-[var(--violet)]'
        : 'bg-[var(--magenta)]';

  const textColor =
    tone === 'dark'
      ? 'text-[var(--off-white)]/85'
      : tone === 'light'
        ? 'text-[var(--near-black)]/75'
        : 'text-[var(--text-muted)]';

  return (
    <p
      className={`inline-flex max-w-full items-center gap-2 sm:gap-2.5 text-xs font-bold tracking-[0.12em] sm:tracking-[0.18em] uppercase ${textColor} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 shrink-0 df-slant-block ${accentColor}`}
      />
      {number && (
        <span className="shrink-0 tabular-nums font-extrabold text-[var(--eyebrow-magenta)]">
          {number}
        </span>
      )}
      <span className="min-w-0">{children}</span>
    </p>
  );
}

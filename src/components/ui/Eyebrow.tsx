import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'light' | 'dark';
  accent?: 'magenta' | 'blue';
  className?: string;
}

export function Eyebrow({
  children,
  tone = 'light',
  accent = 'magenta',
  className = '',
}: EyebrowProps) {
  const accentColor = accent === 'blue' ? 'bg-[var(--electric-blue)]' : 'bg-[var(--magenta)]';
  const textColor =
    tone === 'dark' ? 'text-[var(--off-white)]/80' : 'text-[var(--ink-muted)]';

  return (
    <p
      className={`inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase ${textColor} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 shrink-0 ${accentColor}`}
        style={{ transform: 'skewX(var(--slant))' }}
      />
      <span>{children}</span>
    </p>
  );
}

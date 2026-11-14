import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface InlineStatusProps {
  variant: 'info' | 'success' | 'error';
  title: string;
  children?: ReactNode;
  className?: string;
}

export function InlineStatus({
  variant,
  title,
  children,
  className = '',
}: InlineStatusProps) {
  const Icon =
    variant === 'success' ? CheckCircle2 : variant === 'error' ? AlertCircle : Info;

  const borderClass =
    variant === 'error'
      ? 'border-[var(--magenta)] bg-[var(--magenta-soft)]'
      : variant === 'success'
        ? 'border-[var(--electric-blue)] bg-[var(--blue-soft)]'
        : 'border-[var(--border-strong)] bg-[var(--bg-elevated)]';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`border p-5 text-[var(--text-primary)] ${borderClass} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-primary)]" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-bold">{title}</p>
          {children && <div className="text-sm leading-relaxed">{children}</div>}
        </div>
      </div>
    </div>
  );
}

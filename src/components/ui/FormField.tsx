import type { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  counter?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  counter,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[var(--near-black)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--magenta)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {counter && (
          <span className="text-xs tabular-nums text-[var(--ink-muted)]">{counter}</span>
        )}
      </div>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-[var(--ink-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-semibold text-[var(--magenta)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

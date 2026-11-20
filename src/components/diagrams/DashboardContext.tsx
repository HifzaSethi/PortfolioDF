import { useState } from 'react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';
import { DASHBOARD_CONTEXT_DATA } from '../../data/intelligence';

interface DashboardContextProps {
  tone?: 'dark' | 'light';
}

export function DashboardContext({ tone = 'dark' }: DashboardContextProps) {
  const [revealed, setRevealed] = useState(false);
  const isDark = tone === 'dark';

  return (
    <div
      className={`border p-6 sm:p-10 ${
        isDark
          ? 'df-glass-dark df-panel-hairline border-[var(--border-dark)] text-[var(--off-white)]'
          : 'df-card-surface df-ambient df-panel-hairline text-[var(--text-primary)]'
      }`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left: Illustrative Stat Tile */}
        <div className="lg:col-span-5 space-y-4">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.16em] ${
              isDark ? 'text-[var(--magenta)]' : 'text-[var(--eyebrow-magenta)]'
            }`}
          >
            {DASHBOARD_CONTEXT_DATA.title}
          </p>

          <button
            type="button"
            data-spotlight=""
            onClick={() => setRevealed((r) => !r)}
            aria-expanded={revealed}
            className={`w-full text-left border p-6 transition-all duration-200 cursor-pointer df-interactive ${
              isDark
                ? 'border-[var(--border-dark-strong)] bg-[var(--near-black)]/80 hover:border-[var(--violet)]'
                : 'border-[var(--border-strong)] bg-[var(--bg-page)] hover:border-[var(--link-accent)]'
            }`}
          >
            <span
              className={`block text-[11px] font-semibold uppercase tracking-[0.14em] ${
                isDark ? 'text-[var(--on-dark-subtle)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {DASHBOARD_CONTEXT_DATA.illustrativeLabel}
            </span>

            <span className="mt-4 flex items-baseline gap-3 tabular-nums">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {DASHBOARD_CONTEXT_DATA.metricLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-3xl sm:text-4xl font-extrabold ${
                  isDark ? 'text-[var(--magenta)]' : 'text-[var(--eyebrow-magenta)]'
                }`}
              >
                <ArrowUpRight aria-hidden="true" className="h-7 w-7" />
                <span>12%</span>
              </span>
            </span>

            <span className="mt-3 block text-sm font-semibold">
              {DASHBOARD_CONTEXT_DATA.caption}
            </span>

            <span
              className={`mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] ${
                isDark ? 'text-[var(--violet)]' : 'text-[var(--link-accent)]'
              }`}
            >
              <HelpCircle aria-hidden="true" className="h-4 w-4" />
              <span>{revealed ? 'Hide context questions' : 'Inspect surrounding context'}</span>
            </span>
          </button>
        </div>

        {/* Right: Context Questions Reveal */}
        <div className="lg:col-span-7 space-y-5" aria-live="polite">
          <p
            className={`text-base leading-relaxed ${
              isDark ? 'text-[var(--on-dark-muted)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {DASHBOARD_CONTEXT_DATA.supportingText}
          </p>

          <div
            className={`grid gap-2.5 sm:grid-cols-2 transition-opacity duration-200 ${
              revealed ? 'opacity-100' : 'opacity-65'
            }`}
          >
            {DASHBOARD_CONTEXT_DATA.questions.map((question, idx) => (
              <div
                key={question}
                className={`border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  revealed
                    ? isDark
                      ? 'border-[var(--violet)] bg-[color-mix(in_srgb,var(--violet)_16%,transparent)] text-[var(--off-white)]'
                      : 'border-[var(--link-accent)] bg-[var(--blue-soft)] text-[var(--text-primary)]'
                    : isDark
                      ? 'border-[var(--border-dark)] text-[var(--on-dark-subtle)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                <span
                  className={`mr-2 tabular-nums ${
                    isDark ? 'text-[var(--magenta)]' : 'text-[var(--eyebrow-magenta)]'
                  }`}
                >
                  0{idx + 1}.
                </span>
                <span>{question}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

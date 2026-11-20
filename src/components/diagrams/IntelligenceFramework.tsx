import { useState, type KeyboardEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { INTELLIGENCE_STAGES } from '../../data/intelligence';

export function IntelligenceFramework() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = INTELLIGENCE_STAGES[activeIndex];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (idx + 1) % INTELLIGENCE_STAGES.length;
      setActiveIndex(next);
      document.getElementById(`intel-stage-${INTELLIGENCE_STAGES[next].id}`)?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (idx - 1 + INTELLIGENCE_STAGES.length) % INTELLIGENCE_STAGES.length;
      setActiveIndex(prev);
      document.getElementById(`intel-stage-${INTELLIGENCE_STAGES[prev].id}`)?.focus();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
            THE DF. INTELLIGENCE FRAMEWORK™
          </p>
          <p className="mt-2 max-w-2xl text-lg font-semibold text-[var(--off-white)]">
            Most agencies provide reporting. DF. provides intelligence.
          </p>
        </div>
        <p className="text-xs max-w-sm text-[var(--on-dark-muted)]">
          The operating idea behind every strategy, campaign, report, and recommendation we produce.
        </p>
      </div>

      {/* 4-Stage Interactive Sequence */}
      <div
        role="tablist"
        aria-label="DF. Intelligence Framework stages"
        className="grid gap-3 md:grid-cols-4"
      >
        {INTELLIGENCE_STAGES.map((stage, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={stage.id}
              id={`intel-stage-${stage.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              data-spotlight=""
              className={`group relative text-left p-6 df-interactive ${
                isActive
                  ? 'df-glass-dark border-[var(--electric-blue)] bg-[color-mix(in_srgb,var(--electric-blue)_14%,var(--near-black))]'
                  : 'df-glass-dark opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold tabular-nums">
                <span className={isActive ? 'text-[var(--magenta)]' : 'text-[var(--on-dark-subtle)]'}>
                  0{idx + 1}
                </span>
                {idx < INTELLIGENCE_STAGES.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className={`h-4 w-4 ${isActive ? 'text-[var(--off-white)]' : 'text-[var(--on-dark-subtle)]'}`}
                  />
                )}
              </div>

              <p className="mt-4 text-xl font-extrabold tracking-tight text-[var(--off-white)]">
                {stage.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--violet)]">
                {stage.question}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail */}
      <div
        role="tabpanel"
        aria-live="polite"
        className="df-glass-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
            Stage 0{activeIndex + 1} · {current.label}
          </p>
          <h3 className="text-2xl font-bold text-[var(--off-white)]">{current.question}</h3>
          <p className="text-base leading-relaxed text-[var(--on-dark-muted)]">
            {current.explanation}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev - 1 + INTELLIGENCE_STAGES.length) % INTELLIGENCE_STAGES.length)
            }
            className="min-h-[44px] px-4 py-2 border border-[var(--border-dark-strong)] text-xs font-semibold text-[var(--off-white)] hover:border-[var(--electric-blue)] df-interactive"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % INTELLIGENCE_STAGES.length)}
            className="min-h-[44px] px-4 py-2 bg-[var(--electric-blue)] text-xs font-semibold text-[var(--off-white)] hover:opacity-90 df-interactive"
          >
            Next Stage
          </button>
        </div>
      </div>
    </div>
  );
}

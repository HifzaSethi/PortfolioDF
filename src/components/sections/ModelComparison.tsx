import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MODEL_COMPARISON } from '../../data/intelligence';

export function ModelComparison() {
  const [selectedModel, setSelectedModel] = useState<'both' | 'traditional' | 'df'>('both');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Traditional Agency Model vs. DF. Intelligence Model
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter model view">
          {(['both', 'traditional', 'df'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={selectedModel === mode}
              onClick={() => setSelectedModel(mode)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold border df-slant-block df-interactive df-chip-wipe ${
                selectedModel === mode
                  ? 'bg-[var(--electric-blue)] text-[var(--off-white)] border-[var(--electric-blue)]'
                  : 'border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
              }`}
            >
              <span className="relative z-10 df-unslant block">
                {mode === 'both'
                  ? 'Compare Both'
                  : mode === 'traditional'
                    ? 'Traditional Model'
                    : 'DF. Intelligence Model'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {selectedModel !== 'df' && (
          <div className="df-card-surface df-ambient df-frame-t p-4 sm:p-6">
            <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)] mb-4">
              {MODEL_COMPARISON.traditional.label}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {MODEL_COMPARISON.traditional.steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="border border-[var(--border-strong)] bg-[var(--bg-page)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
                    {step}
                  </span>
                  {idx < MODEL_COMPARISON.traditional.steps.length - 1 && (
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--text-subtle)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedModel !== 'traditional' && (
          <div className="df-card-surface df-ambient df-panel-hairline df-accent-top-rim p-4 sm:p-6">
            <p className="df-ambient-eyebrow relative z-10 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)] mb-4">
              {MODEL_COMPARISON.dfModel.label}
            </p>
            <div className="relative z-10 flex flex-wrap items-center gap-2.5">
              {MODEL_COMPARISON.dfModel.steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span
                    className={`border px-3.5 py-2 text-sm font-bold ${
                      idx === 0
                        ? 'border-[var(--magenta)] bg-[var(--magenta-soft)] text-[var(--text-primary)]'
                        : idx === MODEL_COMPARISON.dfModel.steps.length - 1
                          ? 'border-[var(--electric-blue)] bg-[var(--electric-blue)] text-[var(--off-white)]'
                          : 'border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)]'
                    }`}
                  >
                    {step}
                  </span>
                  {idx < MODEL_COMPARISON.dfModel.steps.length - 1 && (
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--eyebrow-magenta)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

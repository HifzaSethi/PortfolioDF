import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MODEL_COMPARISON } from '../../data/intelligence';

export function ModelComparison() {
  const [selectedModel, setSelectedModel] = useState<'both' | 'traditional' | 'df'>('both');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold tracking-tight text-[var(--near-black)]">
          Traditional Agency Model vs. DF. Intelligence Model
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter model view">
          {(['both', 'traditional', 'df'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedModel(mode)}
              className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                selectedModel === mode
                  ? 'bg-[var(--electric-blue)] text-[var(--off-white)] border-[var(--electric-blue)]'
                  : 'border-[var(--border-light-strong)] text-[var(--near-black)] hover:border-[var(--electric-blue)]'
              }`}
            >
              {mode === 'both'
                ? 'Compare Both'
                : mode === 'traditional'
                  ? 'Traditional Model'
                  : 'DF. Intelligence Model'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {selectedModel !== 'df' && (
          <div className="border border-[var(--border-light-strong)] bg-[var(--paper-tint)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] mb-4">
              {MODEL_COMPARISON.traditional.label}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {MODEL_COMPARISON.traditional.steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="border border-[var(--border-light-strong)] bg-[var(--off-white)] px-4 py-2 text-sm font-semibold text-[var(--ink-muted)]">
                    {step}
                  </span>
                  {idx < MODEL_COMPARISON.traditional.steps.length - 1 && (
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--ink-subtle)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedModel !== 'traditional' && (
          <div className="df-mesh-dark border border-[var(--border-dark)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)] mb-4">
              {MODEL_COMPARISON.dfModel.label}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {MODEL_COMPARISON.dfModel.steps.map((step, idx) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span
                    className={`border px-3.5 py-2 text-sm font-bold ${
                      idx === 0
                        ? 'border-[var(--magenta)] bg-[color-mix(in_srgb,var(--magenta)_18%,transparent)] text-[var(--off-white)]'
                        : idx === MODEL_COMPARISON.dfModel.steps.length - 1
                          ? 'border-[var(--electric-blue)] bg-[var(--electric-blue)] text-[var(--off-white)]'
                          : 'border-[var(--border-dark-strong)] bg-[var(--near-black)]/70 text-[var(--off-white)]'
                    }`}
                  >
                    {step}
                  </span>
                  {idx < MODEL_COMPARISON.dfModel.steps.length - 1 && (
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--violet)]" />
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

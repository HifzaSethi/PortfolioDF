import { useState } from 'react';
import {
  HOSPITALITY_DIMENSIONS,
  HOSPITALITY_TOUCHPOINTS,
} from '../../data/hospitality';
import type { HospitalityDimensionId, HospitalityTouchpoint } from '../../types/content';
import { Accordion } from '../ui/Accordion';

export function HospitalityEcosystem() {
  const [selectedDimension, setSelectedDimension] = useState<HospitalityDimensionId | 'all'>('all');
  const [selectedTouchpoint, setSelectedTouchpoint] = useState<HospitalityTouchpoint>(
    HOSPITALITY_TOUCHPOINTS[0]
  );

  const dimensionTitleMap: Record<HospitalityDimensionId, string> = {
    demand: 'Demand',
    distribution: 'Distribution',
    commercial: 'Commercial',
    experience: 'Customer Experience',
  };

  return (
    <div className="space-y-8">
      {/* Skewed Parallelogram Dimension Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter hospitality dimensions">
        <button
          type="button"
          aria-pressed={selectedDimension === 'all'}
          onClick={() => setSelectedDimension('all')}
          className={`min-h-[42px] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] border df-slant-block df-interactive df-chip-wipe ${
            selectedDimension === 'all'
              ? 'bg-[var(--electric-blue)] text-[var(--off-white)] border-[var(--electric-blue)]'
              : 'border-[var(--border-dark-strong)] text-[var(--off-white)]/85 hover:border-[var(--off-white)]'
          }`}
        >
          <span className="relative z-10 df-unslant block">All 14 Touchpoints</span>
        </button>
        {HOSPITALITY_DIMENSIONS.map((dim) => (
          <button
            key={dim.id}
            type="button"
            aria-pressed={selectedDimension === dim.id}
            onClick={() => {
              setSelectedDimension(dim.id);
              const firstMatch = HOSPITALITY_TOUCHPOINTS.find((tp) => tp.dimension === dim.id);
              if (firstMatch) setSelectedTouchpoint(firstMatch);
            }}
            className={`min-h-[42px] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] border df-slant-block df-interactive df-chip-wipe ${
              selectedDimension === dim.id
                ? 'bg-[var(--magenta)] text-[var(--near-black)] border-[var(--magenta)]'
                : 'border-[var(--border-dark-strong)] text-[var(--off-white)]/85 hover:border-[var(--off-white)]'
            }`}
          >
            <span className="relative z-10 df-unslant block">{dim.title}</span>
          </button>
        ))}
      </div>

      {/* Desktop Map */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        <div className="lg:col-span-8 df-glass-dark p-6 space-y-5">
          {/* Core Banner */}
          <div className="flex items-center justify-between border-b border-[var(--border-dark)] pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                Central Core
              </p>
              <p className="text-lg font-extrabold text-[var(--off-white)]">
                Commercial Performance
              </p>
            </div>
            <p className="text-xs text-[var(--on-dark-muted)]">
              Occupancy · ADR · RevPAR · Direct Bookings · Profitability
            </p>
          </div>

          {/* 14 Touchpoints */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {HOSPITALITY_TOUCHPOINTS.map((tp) => {
              const isSelected = tp.id === selectedTouchpoint.id;
              const matchesDimension =
                selectedDimension === 'all' || tp.dimension === selectedDimension;
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => setSelectedTouchpoint(tp)}
                  onMouseEnter={() => setSelectedTouchpoint(tp)}
                  onFocus={() => setSelectedTouchpoint(tp)}
                  data-spotlight=""
                  className={`p-3.5 text-left border min-h-[76px] flex flex-col justify-between df-interactive ${
                    isSelected
                      ? 'border-[var(--magenta)] bg-[color-mix(in_srgb,var(--violet)_22%,var(--near-black))] text-[var(--off-white)]'
                      : matchesDimension
                        ? 'border-[var(--border-dark-strong)] bg-[var(--near-black)]/65 text-[var(--off-white)] hover:border-[var(--violet)]'
                        : 'border-[var(--border-dark)] bg-[var(--near-black)]/35 text-[var(--off-white)]/40'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--violet)]">
                    {dimensionTitleMap[tp.dimension]}
                  </span>
                  <span className="mt-1.5 text-xs font-bold leading-snug">{tp.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Touchpoint Contribution Panel */}
        <div
          aria-live="polite"
          className="lg:col-span-4 df-glass-dark df-frame-l p-6 sm:p-7 space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
            {dimensionTitleMap[selectedTouchpoint.dimension]} Dimension
          </p>
          <h3 className="text-2xl font-extrabold text-[var(--off-white)]">
            {selectedTouchpoint.name}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--on-dark-muted)]">
            {selectedTouchpoint.contribution}
          </p>
          <div className="border-t border-[var(--border-dark)] pt-4">
            <p className="text-xs font-semibold text-[var(--off-white)]">
              Feeds directly into Commercial Performance
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Grouped Accordion */}
      <div className="lg:hidden">
        <Accordion
          tone="dark"
          defaultOpenIds={['demand']}
          items={HOSPITALITY_DIMENSIONS.map((dim) => ({
            id: dim.id,
            title: dim.title,
            subtitle: dim.summary,
            content: (
              <ul className="space-y-3">
                {HOSPITALITY_TOUCHPOINTS.filter((tp) => tp.dimension === dim.id).map((tp) => (
                  <li
                    key={tp.id}
                    className="border border-[var(--border-dark)] bg-[var(--near-black)]/60 p-3.5"
                  >
                    <p className="text-sm font-bold text-[var(--off-white)]">{tp.name}</p>
                    <p className="mt-1 text-xs text-[var(--on-dark-muted)]">{tp.contribution}</p>
                  </li>
                ))}
              </ul>
            ),
          }))}
        />
      </div>
    </div>
  );
}

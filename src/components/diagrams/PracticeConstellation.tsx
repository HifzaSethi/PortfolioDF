import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRACTICES, STUDIO_PRACTICE_SUMMARY } from '../../data/practices';
import { useTilt } from '../../hooks/useTilt';
import type { PracticeSummary } from '../../types/content';
import { LinkButton } from '../ui/Button';

interface OrbitPracticeTileProps {
  practice: PracticeSummary;
  isSelected: boolean;
  onSelect: () => void;
}

function OrbitPracticeTile({ practice, isSelected, onSelect }: OrbitPracticeTileProps) {
  const tiltRef = useTilt<HTMLButtonElement>(true);

  return (
    <div className="df-tilt-scene">
      <button
        ref={tiltRef}
        type="button"
        data-spotlight=""
        onClick={onSelect}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        className={`w-full text-left p-4 border df-interactive df-tilt df-tilt-border ${
          isSelected
            ? 'border-[var(--link-accent)] bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] shadow-sm'
            : 'border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
        }`}
      >
        <div className="df-tilt-clip" aria-hidden="true">
          <div className="df-tilt-glare" />
        </div>
        <span
          className={`relative z-10 df-tilt-z-md block text-[10px] font-semibold uppercase tracking-[0.14em] ${
            isSelected ? 'text-[var(--violet)]' : 'text-[var(--text-muted)]'
          }`}
        >
          {practice.roleLabel}
        </span>
        <span className="relative z-10 df-tilt-z-lg mt-1 block text-base font-bold">
          {practice.name}
        </span>
      </button>
    </div>
  );
}

export function PracticeConstellation() {
  const core = PRACTICES.find((p) => p.isCore) ?? PRACTICES[0];
  const orbiting = PRACTICES.filter((p) => !p.isCore);
  const [activeId, setActiveId] = useState<string>(core.id);

  const activeItem =
    [...PRACTICES, STUDIO_PRACTICE_SUMMARY].find((p) => p.id === activeId) ?? core;

  return (
    <div className="space-y-8">
      {/* Desktop Constellation along slanted axes */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
        <div className="lg:col-span-7 relative df-card-surface df-ambient p-8">
          {/* Outer DF. Studio Ring Label */}
          <div className="flex items-center justify-between border-b border-dashed border-[var(--border-strong)] pb-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Outer Creative Arm · Brought to life by DF. Studio
            </span>
            <button
              type="button"
              onClick={() => setActiveId(STUDIO_PRACTICE_SUMMARY.id)}
              onMouseEnter={() => setActiveId(STUDIO_PRACTICE_SUMMARY.id)}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-bold df-slant-block df-interactive df-chip-wipe ${
                activeId === STUDIO_PRACTICE_SUMMARY.id
                  ? 'df-gradient-accent text-[var(--near-black)]'
                  : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
              }`}
            >
              <span className="relative z-10 df-unslant block">DF. Studio</span>
            </button>
          </div>

          {/* Constellation SVG & Slanted Hub */}
          <div className="relative py-6">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 600 320"
              preserveAspectRatio="none"
            >
              <line x1="300" y1="160" x2="115" y2="60" stroke="var(--text-primary)" strokeOpacity="0.22" strokeWidth="1.5" />
              <line x1="300" y1="160" x2="485" y2="60" stroke="var(--text-primary)" strokeOpacity="0.22" strokeWidth="1.5" />
              <line x1="300" y1="160" x2="115" y2="260" stroke="var(--text-primary)" strokeOpacity="0.22" strokeWidth="1.5" />
              <line x1="300" y1="160" x2="485" y2="260" stroke="var(--text-primary)" strokeOpacity="0.22" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 grid grid-cols-2 gap-x-24 gap-y-20">
              {orbiting.map((practice) => (
                <OrbitPracticeTile
                  key={practice.id}
                  practice={practice}
                  isSelected={activeId === practice.id}
                  onSelect={() => setActiveId(practice.id)}
                />
              ))}
            </div>

            {/* Central Intelligence Hub (slanted — no tilt) */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setActiveId(core.id)}
                onMouseEnter={() => setActiveId(core.id)}
                onFocus={() => setActiveId(core.id)}
                className={`df-slant-block df-interactive px-7 py-5 border text-center ${
                  activeId === core.id
                    ? 'bg-[var(--near-black)] text-[var(--off-white)] border-[var(--magenta)] shadow-lg'
                    : 'bg-[var(--near-black)] text-[var(--off-white)] border-[var(--border-dark-strong)] hover:border-[var(--violet)]'
                }`}
              >
                <span className="df-unslant block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                  The Core
                </span>
                <span className="df-unslant mt-1 block text-lg font-extrabold tracking-tight">
                  {core.name}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Practice Detail with L-frame */}
        <div
          aria-live="polite"
          className="lg:col-span-5 df-card-surface df-ambient df-panel-hairline df-frame-l p-8 space-y-5"
        >
          <p className="df-ambient-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)]">
            {activeItem.roleLabel}
          </p>
          <h3 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {activeItem.name}
          </h3>
          <p className="text-base leading-relaxed text-[var(--text-primary)]">
            {activeItem.summary}
          </p>
          <ul className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
            {activeItem.keyServices.map((service) => (
              <li key={service} className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--magenta)] shrink-0" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <LinkButton to={activeItem.path} variant="primary">
              <span>Explore {activeItem.name}</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 df-btn-arrow" />
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Stacked Hierarchy (F5 Unified Material Surfaces) */}
      <div className="lg:hidden space-y-4">
        <Link
          to={core.path}
          data-spotlight=""
          className="block df-card-surface df-panel-hairline df-accent-top-rim df-interactive p-4 sm:p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
            {core.roleLabel}
          </p>
          <h3 className="mt-1 flex items-center justify-between text-2xl font-extrabold text-[var(--text-primary)]">
            <span>{core.name}</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--link-accent)]" />
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{core.summary}</p>
        </Link>

        <div className="space-y-3 df-frame-l pl-3 sm:pl-4 pb-3">
          {orbiting.map((practice) => (
            <Link
              key={practice.id}
              to={practice.path}
              data-spotlight=""
              className="block df-card-surface df-interactive p-4 sm:p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--eyebrow-blue)]">
                {practice.roleLabel}
              </p>
              <p className="mt-1 flex items-center justify-between text-lg font-bold text-[var(--text-primary)]">
                <span>{practice.name}</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--link-accent)]" />
              </p>
              <p className="mt-1.5 text-sm text-[var(--text-muted)]">{practice.tagline}</p>
            </Link>
          ))}
        </div>

        <Link
          to={STUDIO_PRACTICE_SUMMARY.path}
          data-spotlight=""
          className="block df-card-surface df-frame-t df-interactive p-4 sm:p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
            Brought to life by DF. Studio
          </p>
          <p className="mt-1 flex items-center justify-between text-lg font-bold text-[var(--text-primary)]">
            <span>{STUDIO_PRACTICE_SUMMARY.name} — {STUDIO_PRACTICE_SUMMARY.tagline}</span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--link-accent)]" />
          </p>
        </Link>
      </div>
    </div>
  );
}

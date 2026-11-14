import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRACTICES, STUDIO_PRACTICE_SUMMARY } from '../../data/practices';
import { LinkButton } from '../ui/Button';

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
        <div className="lg:col-span-7 relative df-card-surface p-8">
          {/* Outer DF. Studio Ring Label */}
          <div className="flex items-center justify-between border-b border-dashed border-[var(--border-strong)] pb-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Outer Creative Arm · Brought to life by DF. Studio
            </span>
            <button
              type="button"
              onClick={() => setActiveId(STUDIO_PRACTICE_SUMMARY.id)}
              onMouseEnter={() => setActiveId(STUDIO_PRACTICE_SUMMARY.id)}
              className={`min-h-[36px] px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer df-slant-block ${
                activeId === STUDIO_PRACTICE_SUMMARY.id
                  ? 'df-gradient-accent text-[var(--near-black)]'
                  : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
              }`}
            >
              <span className="df-unslant block">DF. Studio</span>
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
              {orbiting.map((practice) => {
                const isSelected = activeId === practice.id;
                return (
                  <button
                    key={practice.id}
                    type="button"
                    onClick={() => setActiveId(practice.id)}
                    onMouseEnter={() => setActiveId(practice.id)}
                    onFocus={() => setActiveId(practice.id)}
                    className={`text-left p-4 border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--link-accent)] bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        isSelected ? 'text-[var(--violet)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {practice.roleLabel}
                    </span>
                    <span className="mt-1 block text-base font-bold">
                      {practice.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Central Intelligence Hub */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setActiveId(core.id)}
                onMouseEnter={() => setActiveId(core.id)}
                onFocus={() => setActiveId(core.id)}
                className={`df-slant-block px-7 py-5 border text-center transition-all duration-150 cursor-pointer ${
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
          className="lg:col-span-5 df-card-surface df-frame-l p-8 space-y-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--link-accent)]">
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
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Stacked Hierarchy */}
      <div className="lg:hidden space-y-4">
        <Link
          to={core.path}
          className="block df-mesh-dark p-6 border border-[var(--border-dark)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
            {core.roleLabel}
          </p>
          <h3 className="mt-1 text-2xl font-extrabold text-[var(--off-white)]">{core.name}</h3>
          <p className="mt-2 text-sm text-[var(--on-dark-muted)]">{core.summary}</p>
        </Link>

        <div className="space-y-3 df-frame-l pl-4 pb-3">
          {orbiting.map((practice) => (
            <Link
              key={practice.id}
              to={practice.path}
              className="block df-card-surface p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
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
          className="block border border-dashed border-[var(--border-strong)] bg-[var(--bg-tint)] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
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

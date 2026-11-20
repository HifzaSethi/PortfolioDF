import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRACTICES, STUDIO_PRACTICE_SUMMARY } from '../../data/practices';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  const core = PRACTICES.find((p) => p.isCore);
  const actions = PRACTICES.filter((p) => !p.isCore);

  return (
    <div
      id="services-megamenu"
      role="region"
      aria-label="Services submenu"
      className="absolute left-0 right-0 top-full z-[var(--z-megamenu)] border-b border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] shadow-2xl"
    >
      <div className="mx-auto grid max-w-[var(--container-max)] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:px-10">
        {/* Core Practice */}
        {core && (
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] pb-6 lg:pb-0 lg:pr-8 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                {core.roleLabel}
              </p>
              <Link
                to={core.path}
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:text-[var(--link-accent)] transition-colors"
              >
                <span>{core.name}</span>
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                {core.summary}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <Link
                to="/services"
                onClick={onClose}
                className="df-link-sweep text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] hover:text-[var(--link-accent)]"
              >
                View All Practices Overview
              </Link>
            </div>
          </div>
        )}

        {/* Four Action Practices */}
        <div className="lg:col-span-5 grid gap-4 sm:grid-cols-2">
          {actions.map((practice) => (
            <Link
              key={practice.id}
              to={practice.path}
              onClick={onClose}
              data-spotlight=""
              className="group block df-card-surface df-interactive p-4 hover:border-[var(--link-accent)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {practice.roleLabel}
              </p>
              <p className="mt-1 flex items-center justify-between text-base font-bold group-hover:text-[var(--link-accent)]">
                <span>{practice.name}</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 opacity-60 group-hover:opacity-100" />
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                {practice.tagline}
              </p>
            </Link>
          ))}
        </div>

        {/* DF. Studio Creative Arm */}
        <div className="lg:col-span-3 df-mesh-dark border border-[var(--border-dark)] p-5 flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--off-white)]/75">
              {STUDIO_PRACTICE_SUMMARY.roleLabel}
            </p>
            <Link
              to={STUDIO_PRACTICE_SUMMARY.path}
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-2 text-xl font-extrabold text-[var(--off-white)] hover:text-[var(--violet)] transition-colors"
            >
              <span>{STUDIO_PRACTICE_SUMMARY.name}</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-[var(--on-dark-muted)]">
              {STUDIO_PRACTICE_SUMMARY.summary}
            </p>
          </div>
          <p className="relative z-10 mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--magenta)]">
            {STUDIO_PRACTICE_SUMMARY.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

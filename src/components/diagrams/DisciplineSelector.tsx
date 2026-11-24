import { useRef, type KeyboardEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import { SEARCH_DISCIPLINES } from '../../data/searchIntelligence';
import type { SearchDiscipline } from '../../types/content';
import { scrollToSection } from '../../lib/scroll';

interface DisciplineSelectorProps {
  disciplines?: SearchDiscipline[];
  activeId: SearchDiscipline['id'] | null;
  onSelect: (id: SearchDiscipline['id']) => void;
}

export function DisciplineSelector({
  disciplines = SEARCH_DISCIPLINES,
  activeId,
  onSelect,
}: DisciplineSelectorProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = activeId
    ? disciplines.find((d) => d.id === activeId) ?? null
    : null;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disciplines.length === 0) return;
    let targetIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      targetIndex = (index + 1) % disciplines.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      targetIndex = (index - 1 + disciplines.length) % disciplines.length;
    } else if (event.key === 'Home') {
      targetIndex = 0;
    } else if (event.key === 'End') {
      targetIndex = disciplines.length - 1;
    }

    if (targetIndex !== null) {
      event.preventDefault();
      const target = disciplines[targetIndex];
      if (!target) return;
      onSelect(target.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {disciplines.length === 6 ? 'Six Disciplines' : `${disciplines.length} Disciplines`} · From
          ranking to recommendation to reservation
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Select a discipline or use Left/Right arrow keys
        </p>
      </div>

      {/* Acronym Controls */}
      <div
        role="tablist"
        aria-label="Search Intelligence Disciplines"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
      >
        {disciplines.map((discipline, index) => {
          const selected = active !== null && discipline.id === active.id;
          const isFocusable = active ? selected : index === 0;
          return (
            <button
              key={discipline.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="discipline-selector-panel"
              tabIndex={isFocusable ? 0 : -1}
              onClick={() => onSelect(discipline.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`p-4 text-left border min-h-[82px] flex flex-col justify-between df-interactive df-tab-hover ${
                selected
                  ? 'bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] border-[var(--magenta)]'
                  : 'df-card-surface text-[var(--text-primary)]'
              }`}
            >
              <span className="text-2xl font-extrabold tracking-tight">
                {discipline.acronym}
              </span>
              <span
                className={`mt-1 block text-[11px] font-medium leading-tight ${
                  selected ? 'text-[var(--on-dark-muted)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {discipline.fullName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Discipline Preview Panel (height-matched neutral state when active is null) */}
      <div
        id="discipline-selector-panel"
        role="tabpanel"
        aria-live="polite"
        className="df-card-surface df-ambient df-panel-hairline df-frame-l p-4 sm:p-8 lg:min-h-[340px] grid gap-6 lg:grid-cols-12 items-start"
      >
        {active ? (
          <>
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                {active.acronym} · {active.fullName}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {active.tagline}
              </h3>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                {active.explanation}
              </p>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Where it shows up:{' '}
                <span className="font-normal text-[var(--text-muted)]">{active.whereItShowsUp}</span>
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(`discipline-${active.id}`)}
                  className="inline-flex min-h-[40px] items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--link-accent)] df-link-sweep cursor-pointer"
                >
                  <span>Jump to full {active.acronym} section</span>
                  <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] pt-5 lg:pt-0 lg:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3">
                {active.acronym} Deliverables ({active.deliverables.length})
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {active.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 bg-[var(--electric-blue)] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                Search Surface Explorer
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Choose a discipline above.
              </h3>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                Select {disciplines.map((d) => d.acronym).join(', ')} to preview where each discipline appears across search and AI surfaces and inspect its deliverables.
              </p>
              {disciplines[0] && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection(`discipline-${disciplines[0].id}`)}
                    className="inline-flex min-h-[40px] items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--link-accent)] df-link-sweep cursor-pointer"
                  >
                    <span>Jump to full disciplines below</span>
                    <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] pt-5 lg:pt-0 lg:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3">
                Connected Search Surfaces ({disciplines.length})
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {disciplines.map((discipline) => (
                  <li key={discipline.id} className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 bg-[var(--electric-blue)] shrink-0" />
                    <span>
                      <span className="font-bold">{discipline.acronym}</span>
                      {' · '}
                      <span className="text-[var(--text-muted)]">{discipline.tagline}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

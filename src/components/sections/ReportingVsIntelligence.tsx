import { REPORTING_VS_INTELLIGENCE } from '../../data/intelligence';

export function ReportingVsIntelligence() {
  const { lead, metricsNote, reporting, intelligence } = REPORTING_VS_INTELLIGENCE;

  return (
    <div className="space-y-8">
      <div className="max-w-[66ch] space-y-3">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {lead}
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-muted)]">{metricsNote}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Reporting Column */}
        <div className="df-card-surface df-ambient df-frame-t p-4 sm:p-8 space-y-5">
          <div>
            <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)]">
              {reporting.subtitle}
            </p>
            <h4 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{reporting.title}</h4>
          </div>
          <ul className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
            {reporting.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 bg-[var(--eyebrow-blue)] shrink-0"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Intelligence Column */}
        <div className="df-card-surface df-ambient df-panel-hairline df-accent-top-rim p-4 sm:p-8 space-y-5">
          <div className="relative z-10">
            <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
              {intelligence.subtitle}
            </p>
            <h4 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
              {intelligence.title}
            </h4>
          </div>
          <ul className="relative z-10 space-y-3 border-t border-[var(--border-subtle)] pt-5">
            {intelligence.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm font-medium text-[var(--text-primary)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 bg-[var(--eyebrow-magenta)] shrink-0"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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
        <div className="border border-[var(--border-strong)] bg-[var(--bg-tint)] p-7 sm:p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {reporting.subtitle}
            </p>
            <h4 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{reporting.title}</h4>
          </div>
          <ul className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
            {reporting.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 bg-[var(--text-subtle)] shrink-0"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Intelligence Column */}
        <div className="df-mesh-dark p-7 sm:p-8 space-y-5 border border-[var(--border-dark)]">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
              {intelligence.subtitle}
            </p>
            <h4 className="mt-1 text-2xl font-bold text-[var(--off-white)]">
              {intelligence.title}
            </h4>
          </div>
          <ul className="relative z-10 space-y-3 border-t border-[var(--border-dark)] pt-5">
            {intelligence.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm font-medium text-[var(--off-white)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 bg-[var(--electric-blue)] shrink-0"
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

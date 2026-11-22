import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { GROWTH_MARKETING_COPY, GROWTH_STAGES } from '../data/growthMarketing';
import { usePageMeta } from '../hooks/usePageMeta';

export default function GrowthMarketingPage() {
  usePageMeta('/services/growth-marketing');
  const [selectedStageId, setSelectedStageId] = useState<string>('all');

  const visibleStages =
    selectedStageId === 'all'
      ? GROWTH_STAGES
      : GROWTH_STAGES.filter((s) => s.id === selectedStageId);

  return (
    <>
      <PracticeHero
        routePath="/services/growth-marketing"
        number="01"
        eyebrow="Practice 04 · How DF. Acts"
        title="Growth Marketing."
        lead={GROWTH_MARKETING_COPY.lead}
        principle={GROWTH_MARKETING_COPY.cxConnection}
      />

      <Section surface="tint" compact>
        <Container className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow number="02">Full-Lifecycle Growth Journey</Eyebrow>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter growth stages">
              <button
                type="button"
                aria-pressed={selectedStageId === 'all'}
                onClick={() => setSelectedStageId('all')}
                className={`min-h-[40px] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] border df-slant-block df-interactive df-chip-wipe ${
                  selectedStageId === 'all'
                    ? 'df-gradient-accent text-[var(--near-black)] border-transparent'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
                }`}
              >
                <span className="relative z-10 df-unslant inline-block">All 5 Stages (21 Services)</span>
              </button>
              {GROWTH_STAGES.map((stage) => {
                const isSelected = selectedStageId === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`min-h-[40px] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] border df-slant-block df-interactive df-chip-wipe ${
                      isSelected
                        ? 'bg-[var(--electric-blue)] text-[var(--off-white)] border-[var(--electric-blue)]'
                        : 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
                    }`}
                  >
                    <span className="relative z-10 df-unslant inline-block">{stage.stage}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-8 pt-2">
            {visibleStages.map((stage, idx) => (
              <section
                key={stage.id}
                className="df-card-surface df-ambient df-panel-hairline df-frame-l p-6 sm:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-4 space-y-2">
                    <p className="text-xs font-bold tabular-nums uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                      Stage 0{idx + 1}
                    </p>
                    <SectionHeading as="h2" size="h2">
                      {stage.stage}
                    </SectionHeading>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    {stage.groups.map((group) => (
                      <div key={group.title} className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                          {group.title}
                        </h3>
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {group.services.map((service) => (
                            <li
                              key={service}
                              className="border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                            >
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section surface="off-white" compact>
        <Container>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-3xl">
            {GROWTH_MARKETING_COPY.cxConnection}
          </p>
        </Container>
      </Section>

      <CtaBand serviceParam="Growth Marketing" />
    </>
  );
}

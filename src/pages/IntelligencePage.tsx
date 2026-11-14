import { DashboardContext } from '../components/diagrams/DashboardContext';
import { IntelligenceFramework } from '../components/diagrams/IntelligenceFramework';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { ReportingVsIntelligence } from '../components/sections/ReportingVsIntelligence';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  DATA_SOURCES_SINGLE_TRUTH,
  INTELLIGENCE_SERVICES,
} from '../data/intelligence';
import { usePageMeta } from '../hooks/usePageMeta';

export default function IntelligencePage() {
  usePageMeta('/services/intelligence');

  return (
    <>
      <PracticeHero
        routePath="/services/intelligence"
        number="01"
        eyebrow="Practice 01 · The Core"
        surface="dark-mesh"
        title="Intelligence."
        lead="The core of everything DF. does. Performance Marketing, Search Intelligence, Growth Marketing, and Digital Transformation each produce activity and data. Intelligence is what turns that activity into one connected decision-making system."
        principle="It is the DF. Intelligence Framework™ applied as an ongoing service, not just a concept."
      />

      {/* Interactive 4-Stage Framework */}
      <Section surface="dark-mesh" withPattern>
        <Container className="space-y-12">
          <IntelligenceFramework />
          <DashboardContext tone="dark" />
        </Container>
      </Section>

      {/* Reporting vs Intelligence */}
      <Section surface="off-white" reveal>
        <Container>
          <ReportingVsIntelligence />
        </Container>
      </Section>

      {/* Nine Intelligence Services */}
      <Section surface="tint" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <Eyebrow number="02">Nine Intelligence Capabilities</Eyebrow>
            <SectionHeading as="h2" size="h1">
              From disconnected data to commercial clarity.
            </SectionHeading>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_SERVICES.map((service, idx) => (
              <article
                key={service.id}
                className="df-card-surface df-frame-t p-6 space-y-3"
              >
                <p className="text-xs font-bold tabular-nums text-[var(--link-accent)]">
                  0{idx + 1}
                </p>
                <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {service.outcome}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Single Source of Truth + Closing Line */}
      <Section surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="df-card-surface df-frame-l grid gap-8 lg:grid-cols-12 lg:items-center p-8">
            <div className="lg:col-span-5 space-y-3">
              <Eyebrow number="03" accent="blue">
                Data &amp; Analytics Goal
              </Eyebrow>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
                A single source of truth for decision-making.
              </h2>
            </div>
            <ul className="lg:col-span-7 grid gap-3 sm:grid-cols-3">
              {DATA_SOURCES_SINGLE_TRUTH.map((source) => (
                <li
                  key={source}
                  className="border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                >
                  {source}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-4xl">
            Every other practice produces activity. Intelligence is what turns that activity into
            decisions.
          </p>
        </Container>
      </Section>

      <CtaBand serviceParam="Intelligence" />
    </>
  );
}

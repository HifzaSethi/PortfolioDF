import { ImageSlot } from '../components/brand/ImageSlot';
import { EcosystemDiagram } from '../components/diagrams/EcosystemDiagram';
import { IntelligenceFramework } from '../components/diagrams/IntelligenceFramework';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { ModelComparison } from '../components/sections/ModelComparison';
import { PracticeHero } from '../components/sections/PracticeHero';
import { ReportingVsIntelligence } from '../components/sections/ReportingVsIntelligence';
import { ValueList } from '../components/sections/ValueList';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CORE_VALUES, FIELD_MEANINGS, THE_DOT_COPY } from '../data/values';
import { usePageMeta } from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta('/about');

  return (
    <>
      <PracticeHero
        routePath="/about"
        number="01"
        eyebrow="About / Our Approach"
        title="Because business performance is never influenced by a single channel."
        lead="Digital Field. (DF.) is a Digital Performance & Intelligence Consultancy — not a traditional digital marketing agency. We connect business objectives, customer behavior, search intelligence, media performance, technology, and data into one integrated growth framework."
        principle="What is the business trying to achieve?"
      />

      {/* 01 & 02. Why We Exist & Positioning */}
      <Section surface="tint" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-4">
              <Eyebrow number="01">Why We Exist</Eyebrow>
              <SectionHeading as="h2" size="h2">
                Digital performance is never just paid advertising.
              </SectionHeading>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                Every result is shaped by a wider business ecosystem. When agencies work in
                specialized silos, businesses receive disconnected reports and conflicting advice
                that miss the real drivers of revenue.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4 df-frame-l pl-6 pt-4 lg:pt-0 lg:pl-10">
              <Eyebrow number="02" accent="blue">
                Our Positioning
              </Eyebrow>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                Digital marketing is our expertise. The entire digital field is our perspective.
              </p>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                Our mission is to bridge the gap between digital marketing activity and real
                business performance. Business outcomes always take priority over vanity metrics.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03. Founder and Company Facts */}
      <Section surface="off-white" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-5">
              <Eyebrow number="03">Origin</Eyebrow>
              <SectionHeading as="h2" size="h2">
                Founded in 2021 by Islam Helal in Dubai, United Arab Emirates.
              </SectionHeading>
              <p className="max-w-[58ch] text-base leading-relaxed text-[var(--text-muted)]">
                Established to replace fragmented channel execution with intelligence-led digital
                performance anchored to commercial objectives.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ImageSlot
                aspectRatio="3/4"
                shotDescription="FOUNDER PORTRAIT PLACEHOLDER (pending client approval)"
                alt="Founder portrait placeholder for Islam Helal, pending client approval"
                className="max-w-sm mx-auto"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 04. The Name & The Dot */}
      <Section surface="dark-mesh" withPattern reveal>
        <Container className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <Eyebrow number="04" tone="dark">
              The Name &ldquo;Digital Field.&rdquo;
            </Eyebrow>
            <SectionHeading as="h2" size="h1" tone="dark">
              {THE_DOT_COPY.closingLine}
            </SectionHeading>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FIELD_MEANINGS.map((meaning) => (
              <div key={meaning.aspect} className="df-glass-dark p-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                  {meaning.aspect}
                </p>
                <h3 className="text-xl font-bold text-[var(--off-white)]">{meaning.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--on-dark-muted)]">
                  {meaning.description}
                </p>
              </div>
            ))}
          </div>

          <div className="df-glass-dark p-8 grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-2 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-block h-10 w-10 bg-[var(--magenta)] df-slant-block"
              />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--off-white)]">
                {THE_DOT_COPY.eyebrow}
              </span>
            </div>
            <div className="lg:col-span-10 space-y-2">
              <h3 className="text-2xl font-extrabold text-[var(--off-white)]">
                {THE_DOT_COPY.headline}
              </h3>
              <p className="text-base leading-relaxed text-[var(--on-dark-muted)]">
                {THE_DOT_COPY.body}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 05. Five Core Values */}
      <Section surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <Eyebrow number="05">Five Core Values</Eyebrow>
            <SectionHeading as="h2" size="h1">
              How DF. thinks and operates.
            </SectionHeading>
          </div>

          <ol className="divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]">
            {CORE_VALUES.map((val) => (
              <li key={val.id} className="py-8 grid gap-6 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-4 flex items-baseline gap-4">
                  <span className="text-2xl font-extrabold tabular-nums text-[var(--eyebrow-magenta)]">
                    {val.number}
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    {val.title}
                  </h3>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-lg font-bold text-[var(--text-primary)]">{val.summary}</p>
                  <p className="text-base leading-relaxed text-[var(--text-muted)]">{val.detail}</p>

                  {val.timeline && (
                    <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
                      {val.timeline.map((item) => (
                        <div
                          key={item.stage}
                          className="df-card-surface p-3.5"
                        >
                          <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--link-accent)]">
                            {item.stage}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                            {item.action}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 06. Digital Ecosystem Framework (Compact) */}
      <Section surface="tint" reveal>
        <Container className="space-y-8">
          <div className="space-y-2">
            <Eyebrow number="06">Digital Ecosystem Framework</Eyebrow>
            <SectionHeading as="h2" size="h2">
              Ten connected nodes from Business Objectives to Commercial Performance.
            </SectionHeading>
          </div>
          <EcosystemDiagram compact />
        </Container>
      </Section>

      {/* 07. DF. Intelligence Framework™ */}
      <Section surface="dark-mesh" withPattern reveal>
        <Container>
          <IntelligenceFramework />
        </Container>
      </Section>

      {/* 08. Reporting vs Intelligence + Model Comparison + Commercial Philosophy + Value List */}
      <Section surface="off-white" reveal>
        <Container className="space-y-16">
          <ReportingVsIntelligence />

          <ModelComparison />

          <div className="df-card-surface df-frame-l p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
              Commercial Philosophy
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Business outcomes always take priority over vanity metrics.
            </p>
          </div>

          <ValueList />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

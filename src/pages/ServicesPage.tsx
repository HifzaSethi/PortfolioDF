import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TiltFrame } from '../components/ui/TiltFrame';
import { PRACTICES, STUDIO_PRACTICE_SUMMARY } from '../data/practices';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildPracticesItemListJsonLd } from '../lib/seo';

export default function ServicesPage() {
  const extraJsonLd = useMemo(() => buildPracticesItemListJsonLd(), []);
  usePageMeta('/services', extraJsonLd);

  const core = PRACTICES.find((p) => p.isCore);
  const actionPractices = PRACTICES.filter((p) => !p.isCore);

  return (
    <>
      <PracticeHero
        routePath="/services"
        number="01"
        eyebrow="Consultancy Practices"
        title="Five connected practices. One creative arm."
        lead="As a Digital Performance & Intelligence Consultancy, we help clients build, optimize, and scale their digital ecosystems. We combine strategy, performance, technology, data, creativity, and innovation to drive brand visibility, customer acquisition, revenue growth, and long-term business impact."
        principle="Every other practice produces activity. Intelligence turns it into decisions."
      />

      {/* Architecture Overview — Unified sibling cards with subtle 3D tilt depth */}
      <Section surface="tint" compact reveal>
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            <TiltFrame
              withSheen
              sceneClassName="h-full"
              className="df-card-surface df-ambient df-panel-hairline df-accent-top-rim h-full p-6"
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 bg-[var(--violet)] df-slant-block shrink-0"
                  />
                  <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                    The Core
                  </p>
                </div>
                <h2 className="df-tilt-z-lg text-2xl font-extrabold text-[var(--text-primary)]">
                  Intelligence
                </h2>
                <p className="df-tilt-z-md text-sm text-[var(--text-muted)]">
                  Turns activity and cross-channel signals into connected commercial decisions.
                </p>
              </div>
            </TiltFrame>

            <TiltFrame
              withSheen
              sceneClassName="h-full"
              className="df-card-surface df-ambient df-frame-t h-full p-6"
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 bg-[var(--electric-blue)] df-slant-block shrink-0"
                  />
                  <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)]">
                    How DF. Acts
                  </p>
                </div>
                <h2 className="df-tilt-z-lg text-2xl font-extrabold text-[var(--text-primary)]">
                  Four Practices
                </h2>
                <p className="df-tilt-z-md text-sm text-[var(--text-muted)]">
                  Performance Marketing, Search Intelligence, Growth Marketing, and Digital
                  Transformation.
                </p>
              </div>
            </TiltFrame>

            <TiltFrame
              withSheen
              sceneClassName="h-full"
              className="df-card-surface df-ambient df-frame-t h-full p-6"
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 bg-[var(--magenta)] df-slant-block shrink-0"
                  />
                  <p className="df-ambient-eyebrow text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                    How DF. Shows Up
                  </p>
                </div>
                <h2 className="df-tilt-z-lg text-2xl font-extrabold text-[var(--text-primary)]">
                  DF. Studio
                </h2>
                <p className="df-tilt-z-md text-sm text-[var(--text-muted)]">
                  Creative, copywriting, photography, video, design, motion, and AI content in
                  context.
                </p>
              </div>
            </TiltFrame>
          </div>
        </Container>
      </Section>

      {/* Editorial Rows for Each Practice + Studio (single stretched link per row) */}
      <Section surface="off-white" reveal>
        <Container className="space-y-8">
          <div className="space-y-2">
            <Eyebrow number="02">Practice Directory</Eyebrow>
            <SectionHeading as="h2" size="h2">
              Explore each practice in detail.
            </SectionHeading>
          </div>

          <div className="divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]">
            {[...(core ? [core] : []), ...actionPractices, STUDIO_PRACTICE_SUMMARY].map(
              (practice, idx) => (
                <article
                  key={practice.id}
                  className="df-row group/row py-10 px-4 -mx-4 grid gap-8 lg:grid-cols-12 lg:items-start"
                >
                  <div className="relative z-10 lg:col-span-5 space-y-2">
                    <p className="df-row-num text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                      0{idx + 1} · {practice.roleLabel}
                    </p>
                    <h3 className="df-row-title text-3xl font-extrabold tracking-tight text-[var(--text-primary)] group-hover/row:text-[var(--link-accent)]">
                      {practice.name}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--eyebrow-blue)]">
                      {practice.tagline}
                    </p>
                  </div>

                  <div className="relative z-10 lg:col-span-4 space-y-3">
                    <p className="text-base leading-relaxed text-[var(--text-muted)]">
                      {practice.summary}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {practice.keyServices.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--eyebrow-blue)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-3 lg:flex lg:justify-end">
                    <Link
                      to={practice.path}
                      className="df-stretched-link inline-flex items-center focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-3"
                    >
                      <span className="relative z-10 df-interactive df-btn-secondary df-slant-block inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-sm font-bold tracking-tight whitespace-nowrap shrink-0 bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] group-hover/row:border-[var(--link-accent)] group-hover/row:text-[var(--link-accent)]">
                        <span className="relative z-10 df-unslant inline-flex items-center justify-center gap-2.5">
                          <span>Explore {practice.name}</span>
                          <ArrowRight aria-hidden="true" className="h-4 w-4 df-btn-arrow df-row-arrow" />
                        </span>
                      </span>
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

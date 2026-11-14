import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
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
        eyebrow="Consultancy Practices"
        title="Five connected practices. One creative arm."
        lead="As a Digital Performance & Intelligence Consultancy, we help clients build, optimize, and scale their digital ecosystems. We combine strategy, performance, technology, data, creativity, and innovation to drive brand visibility, customer acquisition, revenue growth, and long-term business impact."
        principle="Every other practice produces activity. Intelligence turns it into decisions."
      />

      {/* Architecture Overview */}
      <Section surface="tint" compact reveal>
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="df-mesh-dark p-6 border border-[var(--border-dark)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                The Core
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[var(--off-white)]">Intelligence</h2>
              <p className="mt-2 text-sm text-[var(--on-dark-muted)]">
                Turns activity and cross-channel signals into connected commercial decisions.
              </p>
            </div>
            <div className="border border-[var(--border-light-strong)] bg-[var(--off-white)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--electric-blue)]">
                How DF. Acts
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[var(--near-black)]">
                Four Practices
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Performance Marketing, Search Intelligence, Growth Marketing, and Digital
                Transformation.
              </p>
            </div>
            <div className="border border-[var(--border-light-strong)] bg-[var(--off-white)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                How DF. Shows Up
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[var(--near-black)]">DF. Studio</h2>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Creative, copywriting, photography, video, design, motion, and AI content in
                context.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Editorial Rows for Each Practice + Studio */}
      <Section surface="off-white" reveal>
        <Container className="space-y-8">
          <div className="space-y-2">
            <Eyebrow>Practice Directory</Eyebrow>
            <SectionHeading as="h2" size="h2">
              Explore each practice in detail.
            </SectionHeading>
          </div>

          <div className="divide-y divide-[var(--border-light-strong)] border-y border-[var(--border-light-strong)]">
            {[...(core ? [core] : []), ...actionPractices, STUDIO_PRACTICE_SUMMARY].map(
              (practice, idx) => (
                <article
                  key={practice.id}
                  className="py-10 grid gap-8 lg:grid-cols-12 lg:items-start"
                >
                  <div className="lg:col-span-5 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                      0{idx + 1} · {practice.roleLabel}
                    </p>
                    <h3 className="text-3xl font-extrabold tracking-tight text-[var(--near-black)]">
                      {practice.name}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--electric-blue)]">
                      {practice.tagline}
                    </p>
                  </div>

                  <div className="lg:col-span-4 space-y-3">
                    <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                      {practice.summary}
                    </p>
                    <ul className="space-y-1.5 pt-1">
                      {practice.keyServices.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm font-medium text-[var(--near-black)]"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--electric-blue)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-3 lg:flex lg:justify-end">
                    <Link
                      to={practice.path}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--near-black)] px-5 py-2.5 text-sm font-semibold text-[var(--near-black)] hover:bg-[var(--electric-blue)] hover:border-[var(--electric-blue)] hover:text-[var(--off-white)] transition-colors"
                    >
                      <span>Explore {practice.name}</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
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

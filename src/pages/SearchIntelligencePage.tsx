import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { DisciplineSelector } from '../components/diagrams/DisciplineSelector';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  SEARCH_DISCIPLINES,
  SEARCH_INTELLIGENCE_COPY,
  SEARCH_MEASUREMENT_VOCABULARY,
} from '../data/searchIntelligence';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildSearchDisciplinesJsonLd } from '../lib/seo';
import type { SearchDiscipline } from '../types/content';

export default function SearchIntelligencePage() {
  const extraJsonLd = useMemo(() => buildSearchDisciplinesJsonLd(), []);
  usePageMeta('/services/search-intelligence', extraJsonLd);

  const [searchParams, setSearchParams] = useSearchParams();
  const paramVal = searchParams.get('discipline') as SearchDiscipline['id'] | null;
  const isValidParam = SEARCH_DISCIPLINES.some((d) => d.id === paramVal);
  const [activeDiscipline, setActiveDiscipline] = useState<SearchDiscipline['id']>(
    isValidParam && paramVal ? paramVal : 'seo'
  );

  useEffect(() => {
    if (isValidParam && paramVal) {
      setActiveDiscipline(paramVal);
    }
  }, [isValidParam, paramVal]);

  const handleSelectDiscipline = (id: SearchDiscipline['id']) => {
    setActiveDiscipline(id);
    setSearchParams({ discipline: id }, { replace: true });
  };

  return (
    <>
      <PracticeHero
        routePath="/services/search-intelligence"
        number="01"
        eyebrow="Practice 03 · How DF. Acts"
        title="Search Intelligence."
        lead={SEARCH_INTELLIGENCE_COPY.lead}
        principle={SEARCH_INTELLIGENCE_COPY.impact}
      />

      {/* Context + Interactive DisciplineSelector */}
      <Section surface="tint" compact>
        <Container className="space-y-8">
          <p className="max-w-[66ch] text-lg font-semibold text-[var(--text-primary)]">
            {SEARCH_INTELLIGENCE_COPY.context}
          </p>
          <DisciplineSelector
            activeId={activeDiscipline}
            onSelect={handleSelectDiscipline}
          />
        </Container>
      </Section>

      {/* Indexed Long-Scroll Sections for All Six Separate Disciplines */}
      <Section surface="off-white">
        <Container className="space-y-14">
          {SEARCH_DISCIPLINES.map((discipline, idx) => (
            <section
              key={discipline.id}
              id={`discipline-${discipline.id}`}
              className="df-frame-t pt-10 grid gap-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                  Discipline 0{idx + 1} · {discipline.fullName}
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  {discipline.acronym}
                </h2>
                <p className="text-xl font-bold text-[var(--link-accent)]">
                  {discipline.tagline}
                </p>
                <p className="text-base leading-relaxed text-[var(--text-muted)]">
                  {discipline.explanation}
                </p>
                <div className="border-t border-[var(--border-subtle)] pt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                    Where it shows up
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {discipline.whereItShowsUp}
                  </p>
                </div>

                {discipline.relatedLink && (
                  <div className="pt-2">
                    <Link
                      to={discipline.relatedLink.path}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--link-accent)] df-link-sweep"
                    >
                      <span>{discipline.relatedLink.label}</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4">
                  Deliverables
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {discipline.deliverables.map((item) => (
                    <li
                      key={item}
                      className="df-card-surface px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </Container>
      </Section>

      {/* Measurement Vocabulary & Closing Statement */}
      <Section surface="tint" reveal>
        <Container className="space-y-10">
          <div className="space-y-4">
            <Eyebrow number="02" accent="blue">
              Search Ecosystem Signals
            </Eyebrow>
            <SectionHeading as="h2" size="h2">
              Measurement vocabulary across search, AI answers, and booking agents.
            </SectionHeading>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {SEARCH_MEASUREMENT_VOCABULARY.map((item) => (
                <li
                  key={item}
                  className="df-card-surface px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--border-strong)] pt-8 space-y-4">
            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-4xl">
              {SEARCH_INTELLIGENCE_COPY.closingLine}
            </p>
            <p className="text-xs leading-relaxed text-[var(--text-muted)] max-w-3xl">
              {SEARCH_INTELLIGENCE_COPY.note}
            </p>
            <div>
              <Link
                to="/hospitality"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--link-accent)] df-link-sweep"
              >
                <span>Hospitality: Be Found and Booked Through AI</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="Search Intelligence" />
    </>
  );
}

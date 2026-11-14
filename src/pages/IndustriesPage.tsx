import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { INDUSTRIES, INDUSTRIES_COPY } from '../data/industries';
import { usePageMeta } from '../hooks/usePageMeta';

export default function IndustriesPage() {
  usePageMeta('/industries');
  const [hoveredId, setHoveredId] = useState<string>(INDUSTRIES[0].id);

  const activeIndustry = INDUSTRIES.find((i) => i.id === hoveredId) ?? INDUSTRIES[0];

  return (
    <>
      <PracticeHero
        routePath="/industries"
        number="01"
        eyebrow={INDUSTRIES_COPY.eyebrow}
        title={INDUSTRIES_COPY.headline}
        lead={INDUSTRIES_COPY.lead}
        principle={INDUSTRIES_COPY.philosophyNote}
      />

      {/* Typographic Index with Hover/Focus Reveal */}
      <Section surface="off-white">
        <Container className="space-y-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <ul className="lg:col-span-7 divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]">
              {INDUSTRIES.map((industry, idx) => {
                const isSelected = industry.id === activeIndustry.id;
                return (
                  <li key={industry.id}>
                    <Link
                      to={industry.path}
                      onMouseEnter={() => setHoveredId(industry.id)}
                      onFocus={() => setHoveredId(industry.id)}
                      className={`group flex min-h-[64px] items-center justify-between gap-4 py-4 px-2 transition-colors ${
                        isSelected
                          ? 'text-[var(--link-accent)]'
                          : 'text-[var(--text-primary)] hover:text-[var(--link-accent)]'
                      }`}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                          0{idx + 1}
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                          {industry.name}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
                        <span>{industry.isDedicatedPage ? 'Explore Sector' : 'Inquire'}</span>
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Context Reveal Panel */}
            <aside
              aria-live="polite"
              className="lg:col-span-5 lg:sticky lg:top-28 df-card-surface df-frame-l p-7 sm:p-8 space-y-4"
            >
              <Eyebrow number="02" accent="blue">
                Objective &rarr; Ecosystem &rarr; Intelligence &rarr; Action
              </Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {activeIndustry.name}
              </h2>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                {activeIndustry.approachNote}
              </p>
              <div className="pt-2">
                <LinkButton to={activeIndustry.path} variant="primary">
                  <span>
                    {activeIndustry.isDedicatedPage
                      ? 'Go to Hospitality Expertise'
                      : `Start a conversation for ${activeIndustry.name}`}
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </LinkButton>
              </div>
            </aside>
          </div>

          {/* Labeled Case Studies Placeholder Band */}
          <div className="border border-dashed border-[var(--border-strong)] bg-[var(--bg-elevated)] p-8 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
              {INDUSTRIES_COPY.caseStudiesPlaceholderTitle}
            </p>
            <p className="max-w-2xl text-sm text-[var(--text-muted)]">
              {INDUSTRIES_COPY.caseStudiesPlaceholderBody}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

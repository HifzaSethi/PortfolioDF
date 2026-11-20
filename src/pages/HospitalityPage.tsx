import { useState } from 'react';
import { ArrowRight, Plus, Equal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageSlot } from '../components/brand/ImageSlot';
import { HospitalityEcosystem } from '../components/diagrams/HospitalityEcosystem';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  HOSPITALITY_COPY,
  HOSPITALITY_DIMENSIONS,
  HOSPITALITY_OUTCOMES,
} from '../data/hospitality';
import { usePageMeta } from '../hooks/usePageMeta';

export default function HospitalityPage() {
  usePageMeta('/hospitality');
  const [activeDimensionId, setActiveDimensionId] = useState(HOSPITALITY_DIMENSIONS[0].id);

  const activeDim =
    HOSPITALITY_DIMENSIONS.find((d) => d.id === activeDimensionId) ?? HOSPITALITY_DIMENSIONS[0];

  return (
    <>
      {/* Hospitality Hero — Distinct Deeper Gradient Treatment */}
      <PracticeHero
        routePath="/hospitality"
        number="01"
        eyebrow="Core Sector Expertise · Hospitality"
        surface="hospitality-mesh"
        title={HOSPITALITY_COPY.tagline}
        lead={HOSPITALITY_COPY.lead}
        principle={`Serving: ${HOSPITALITY_COPY.whoWeServe.join(' · ')}`}
      />

      {/* 01. Interactive 14-Touchpoint Hospitality Ecosystem */}
      <Section surface="hospitality-mesh" withPattern>
        <Container className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <Eyebrow number="01" tone="dark">
              The Hospitality Ecosystem (14 Touchpoints)
            </Eyebrow>
            <SectionHeading as="h2" size="h2" tone="dark">
              {HOSPITALITY_COPY.ecosystemMessage}
            </SectionHeading>
          </div>
          <HospitalityEcosystem />
        </Container>
      </Section>

      {/* 02. Four Interactive Hospitality Dimensions */}
      <Section surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <Eyebrow number="02">Hospitality Performance in Context</Eyebrow>
            <SectionHeading as="h2" size="h1">
              {HOSPITALITY_COPY.dimensionsCaption}
            </SectionHeading>
          </div>

          <div
            role="tablist"
            aria-label="Hospitality performance dimensions"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HOSPITALITY_DIMENSIONS.map((dim) => {
              const selected = dim.id === activeDim.id;
              return (
                <button
                  key={dim.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  data-spotlight=""
                  onClick={() => setActiveDimensionId(dim.id)}
                  className={`p-5 text-left border min-h-[76px] df-interactive ${
                    selected
                      ? 'bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] border-[var(--link-accent)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--link-accent)]'
                  }`}
                >
                  <span className="text-xs font-extrabold tracking-[0.14em] uppercase">
                    {dim.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            aria-live="polite"
            className="df-card-surface df-ambient df-panel-hairline df-frame-l p-6 sm:p-8 grid gap-6 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                {activeDim.title}
              </p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{activeDim.summary}</p>
            </div>
            <ul className="lg:col-span-7 grid gap-2.5 sm:grid-cols-2">
              {activeDim.metrics.map((metric) => (
                <li
                  key={metric}
                  className="border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                >
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 03. Why Hospitality Brands Choose DF. — Commercial Equation */}
      <Section surface="tint" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <Eyebrow number="03" accent="blue">
              Why Hospitality Brands Choose DF.
            </Eyebrow>
            <SectionHeading as="h2" size="h2">
              {HOSPITALITY_COPY.whyChooseLead}
            </SectionHeading>
          </div>

          <div className="df-mesh-dark border border-[var(--border-dark)] p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {HOSPITALITY_COPY.equationParts.map((part, idx) => (
                <div key={part} className="flex items-center gap-3">
                  <span className="border border-[var(--border-dark-strong)] bg-[var(--near-black)]/70 px-4 py-2.5 text-sm font-bold text-[var(--off-white)]">
                    {part}
                  </span>
                  {idx < HOSPITALITY_COPY.equationParts.length - 1 ? (
                    <Plus aria-hidden="true" className="h-4 w-4 text-[var(--violet)]" />
                  ) : (
                    <Equal aria-hidden="true" className="h-4 w-4 text-[var(--magenta)]" />
                  )}
                </div>
              ))}
              <span className="bg-[var(--electric-blue)] px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--off-white)] df-slant-block">
                <span className="df-unslant inline-block">{HOSPITALITY_COPY.equationResult}</span>
              </span>
            </div>
            <p className="text-base text-[var(--on-dark-muted)] max-w-2xl">
              {HOSPITALITY_COPY.whyChooseClosing}
            </p>
          </div>
        </Container>
      </Section>

      {/* 04 & 05. Outcomes + Related Practices + Hospitality Photo Slots */}
      <Section surface="off-white" reveal>
        <Container className="space-y-14">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-4">
              <Eyebrow number="04">Commercial Outcomes</Eyebrow>
              <SectionHeading as="h2" size="h2">
                What we help hospitality brands achieve.
              </SectionHeading>
              <div className="pt-4 grid gap-4">
                <ImageSlot
                  aspectRatio="16/9"
                  shotDescription="Modern luxury resort architecture and pool courtyard in natural morning light"
                  alt="Modern hospitality resort architecture placeholder"
                />
                <ImageSlot
                  aspectRatio="16/9"
                  tone="dark"
                  shotDescription="Contemporary hotel suite and digital guest check-in touchpoint"
                  alt="Hospitality guest experience placeholder"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <ul className="divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]">
                {HOSPITALITY_OUTCOMES.map((outcome, idx) => (
                  <li
                    key={outcome}
                    className="py-3.5 flex items-baseline gap-4 text-lg sm:text-xl font-extrabold tracking-tight text-[var(--text-primary)]"
                  >
                    <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Connected Practices for Hospitality
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: 'Hospitality-Focused Digital Advertising',
                      path: '/services/performance-marketing',
                    },
                    {
                      label: 'AXO: Be Bookable by AI Agents',
                      path: '/services/search-intelligence?discipline=axo',
                    },
                    {
                      label: 'GAIO: Shape What AI Knows About You',
                      path: '/services/search-intelligence?discipline=gaio',
                    },
                    {
                      label: 'Hospitality Intelligence & Attribution',
                      path: '/services/intelligence',
                    },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.path}
                      data-spotlight=""
                      className="flex min-h-[48px] items-center justify-between gap-3 df-card-surface df-interactive px-4 py-3 text-sm font-bold text-[var(--text-primary)] hover:border-[var(--link-accent)] hover:text-[var(--link-accent)]"
                    >
                      <span>{link.label}</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="Performance Marketing" />
    </>
  );
}

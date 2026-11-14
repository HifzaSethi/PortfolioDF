import { ArrowRight } from 'lucide-react';
import { ImageSlot } from '../components/brand/ImageSlot';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { STUDIO_COPY, STUDIO_DISCIPLINES } from '../data/studio';
import { usePageMeta } from '../hooks/usePageMeta';

export default function StudioPage() {
  usePageMeta('/studio');

  return (
    <>
      <PracticeHero
        routePath="/studio"
        eyebrow="DF. Studio · Creative & Production"
        surface="dark-mesh"
        title="Content in Context."
        lead={STUDIO_COPY.lead}
        principle={STUDIO_COPY.keyMessage}
      />

      {/* Contrast + Brief to Result Loop */}
      <Section surface="tint" reveal>
        <Container className="space-y-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center border-b border-[var(--border-light-strong)] pb-10">
            <p className="lg:col-span-5 text-xl text-[var(--ink-muted)]">
              {STUDIO_COPY.contrastClaim}
            </p>
            <p className="lg:col-span-7 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--near-black)]">
              {STUDIO_COPY.contrastReframe}
            </p>
          </div>

          <div className="space-y-6">
            <Eyebrow accent="blue">{STUDIO_COPY.loopIntro}</Eyebrow>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {STUDIO_COPY.loopSteps.map((step, idx) => (
                <li
                  key={step}
                  className="border border-[var(--border-light-strong)] bg-[var(--off-white)] p-4 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tabular-nums text-[var(--magenta)]">
                      0{idx + 1}
                    </span>
                    {idx < STUDIO_COPY.loopSteps.length - 1 && (
                      <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--electric-blue)]" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-[var(--near-black)]">{step}</p>
                </li>
              ))}
            </ol>
            <p className="max-w-[66ch] text-base font-semibold text-[var(--near-black)]">
              {STUDIO_COPY.loopClosing}
            </p>
          </div>
        </Container>
      </Section>

      {/* Six Disciplines — Portfolio-Style Presentation */}
      <Section surface="off-white">
        <Container className="space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-light-strong)] pb-8">
            <div className="space-y-2">
              <Eyebrow>Six Production Disciplines</Eyebrow>
              <SectionHeading as="h2" size="h1">
                Built to move bookings, leads, and revenue.
              </SectionHeading>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--magenta)] border border-[var(--border-light-strong)] px-3.5 py-2">
              {STUDIO_COPY.portfolioNotice}
            </p>
          </div>

          <div className="space-y-16">
            {STUDIO_DISCIPLINES.map((discipline, idx) => (
              <article
                key={discipline.id}
                className="grid gap-8 lg:grid-cols-12 lg:items-start border-b border-[var(--border-light)] pb-14 last:border-b-0 last:pb-0"
              >
                <div className="lg:col-span-5">
                  <ImageSlot
                    aspectRatio={discipline.aspectRatio}
                    shotDescription={discipline.shotDescription}
                    alt={discipline.altText}
                    tone={idx % 2 === 1 ? 'dark' : 'light'}
                  />
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--electric-blue)]">
                      0{idx + 1} · {discipline.title}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--near-black)]">
                      {discipline.tagline}
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                      {discipline.description}
                    </p>
                  </div>

                  <ul className="grid gap-2.5 sm:grid-cols-2 pt-2">
                    {discipline.subServices.map((item) => (
                      <li
                        key={item}
                        className="border border-[var(--border-light)] bg-[var(--paper-elevated)] px-3.5 py-2.5 text-sm font-semibold text-[var(--near-black)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {discipline.disclosureNote && (
                    <p className="text-xs font-semibold text-[var(--ink-muted)] pt-1">
                      {discipline.disclosureNote}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="border border-[var(--border-light-strong)] bg-[var(--paper-tint)] p-6">
            <p className="text-sm leading-relaxed text-[var(--near-black)]">
              {STUDIO_COPY.brandDirectionNote}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="DF. Studio" />
    </>
  );
}

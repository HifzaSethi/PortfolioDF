import { ArrowRight } from 'lucide-react';
import { CharacterSlot } from '../components/brand/CharacterSlot';
import { ImageSlot } from '../components/brand/ImageSlot';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { StudioCinema } from '../components/sections/StudioCinema';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE_CONFIG } from '../config/site';
import { STUDIO_COPY, STUDIO_DISCIPLINES } from '../data/studio';
import { usePageMeta } from '../hooks/usePageMeta';

export default function StudioPage() {
  usePageMeta('/studio');
  const hasCharacterAssets = Boolean(
    SITE_CONFIG.assets.characters.Di || SITE_CONFIG.assets.characters.Fi
  );

  return (
    <>
      <PracticeHero
        routePath="/studio"
        number="01"
        eyebrow="DF. Studio · Creative & Production"
        surface="dark-mesh"
        title="Content in Context."
        lead={STUDIO_COPY.lead}
        principle={STUDIO_COPY.keyMessage}
      />

      {/* Contrast + Brief to Result Loop */}
      <Section surface="tint" reveal>
        <Container className="space-y-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center border-b border-[var(--border-strong)] pb-10">
            <p className="lg:col-span-5 text-xl text-[var(--text-muted)]">
              {STUDIO_COPY.contrastClaim}
            </p>
            <p className="lg:col-span-7 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {STUDIO_COPY.contrastReframe}
            </p>
          </div>

          <div className="space-y-6">
            <Eyebrow number="02" accent="blue">
              {STUDIO_COPY.loopIntro}
            </Eyebrow>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {STUDIO_COPY.loopSteps.map((step, idx) => (
                <li
                  key={step}
                  className="df-card-surface df-ambient df-frame-t p-4 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                      0{idx + 1}
                    </span>
                    {idx < STUDIO_COPY.loopSteps.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 text-[var(--eyebrow-blue)]"
                      />
                    )}
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{step}</p>
                </li>
              ))}
            </ol>
            <p className="max-w-[66ch] text-base font-semibold text-[var(--text-primary)]">
              {STUDIO_COPY.loopClosing}
            </p>
          </div>
        </Container>
      </Section>

      {/* Six Disciplines — Portfolio-Style Presentation */}
      <Section surface="off-white">
        <Container className="space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-strong)] pb-8">
            <div className="space-y-2">
              <Eyebrow number="03">Six Production Disciplines</Eyebrow>
              <SectionHeading as="h2" size="h1">
                Built to move bookings, leads, and revenue.
              </SectionHeading>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)] border border-[var(--border-strong)] px-3.5 py-2">
              {STUDIO_COPY.portfolioNotice}
            </p>
          </div>

          <StudioCinema />

          <div className="space-y-16">
            {STUDIO_DISCIPLINES.map((discipline, idx) => (
              <article
                key={discipline.id}
                className="grid gap-8 lg:grid-cols-12 lg:items-start border-b border-[var(--border-subtle)] pb-14 last:border-b-0 last:pb-0"
              >
                <div className="lg:col-span-5">
                  <ImageSlot
                    src={discipline.image?.src}
                    srcSet={discipline.image?.srcSet}
                    sizes={discipline.image?.sizes}
                    aspectRatio={discipline.aspectRatio}
                    shotDescription={discipline.shotDescription}
                    alt={discipline.image?.alt ?? discipline.altText}
                    tone={idx % 2 === 1 ? 'dark' : 'light'}
                  />
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)]">
                      0{idx + 1} · {discipline.title}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                      {discipline.tagline}
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--text-muted)]">
                      {discipline.description}
                    </p>
                  </div>

                  <ul className="grid gap-2.5 sm:grid-cols-2 pt-2">
                    {discipline.subServices.map((item) => (
                      <li
                        key={item}
                        className="df-card-surface df-ambient px-3.5 py-2.5 text-sm font-semibold text-[var(--text-primary)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {discipline.disclosureNote && (
                    <p className="text-xs font-semibold text-[var(--text-muted)] pt-1">
                      {discipline.disclosureNote}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {hasCharacterAssets && (
            <div className="grid gap-6 sm:grid-cols-2 border-t border-[var(--border-strong)] pt-10">
              <CharacterSlot name="Di" />
              <CharacterSlot name="Fi" />
            </div>
          )}

          <div className="df-card-surface df-ambient df-frame-l p-6">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {STUDIO_COPY.brandDirectionNote}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="DF. Studio" />
    </>
  );
}

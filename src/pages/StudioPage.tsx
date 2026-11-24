import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CharacterSlot } from '../components/brand/CharacterSlot';
import { ImageSlot } from '../components/brand/ImageSlot';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import {
  SCENE_GRADIENTS,
  StudioCinema,
  renderDisciplineArtwork,
} from '../components/sections/StudioCinema';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE_CONFIG } from '../config/site';
import { useContent } from '../context/ContentContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { getPortfolioImageUrl } from '../lib/supabase';

export default function StudioPage() {
  usePageMeta('/studio');
  const { content, portfolioItems } = useContent();
  const { copy: studioCopy, disciplines } = content.studio;
  const hasPublishedWork = portfolioItems.length > 0;

  const hasCharacterAssets = Boolean(
    SITE_CONFIG.assets.characters.Di || SITE_CONFIG.assets.characters.Fi
  );

  const disciplineLabelMap = new Map(disciplines.map((d) => [d.id.toLowerCase(), d.title]));

  return (
    <>
      <PracticeHero
        routePath="/studio"
        number="01"
        eyebrow="DF. Studio · Creative & Production"
        surface="dark-mesh"
        title={studioCopy.tagline}
        lead={studioCopy.lead}
        principle={studioCopy.keyMessage}
      />

      {/* Contrast + Brief to Result Loop */}
      <Section surface="tint" reveal>
        <Container className="space-y-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center border-b border-[var(--border-strong)] pb-10">
            <p className="lg:col-span-5 text-xl text-[var(--text-muted)]">
              {studioCopy.contrastClaim}
            </p>
            <p className="lg:col-span-7 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {studioCopy.contrastReframe}
            </p>
          </div>

          <div className="space-y-6">
            <Eyebrow number="02" accent="blue">
              {studioCopy.loopIntro}
            </Eyebrow>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {studioCopy.loopSteps.map((step, idx) => (
                <li
                  key={`${step}-${idx}`}
                  className="df-card-surface df-ambient df-frame-t p-4 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {idx < studioCopy.loopSteps.length - 1 && (
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
              {studioCopy.loopClosing}
            </p>
          </div>
        </Container>
      </Section>

      {/* Selected Work Gallery (rendered ONLY when at least one published portfolio item exists) */}
      {hasPublishedWork && (
        <Section surface="off-white" className="pb-6">
          <Container className="space-y-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-strong)] pb-6">
              <div className="space-y-2">
                <Eyebrow number="03" accent="magenta">
                  Selected Work
                </Eyebrow>
                <SectionHeading as="h2" size="h1">
                  Commercial creative in the field.
                </SectionHeading>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] tabular-nums">
                {portfolioItems.length} {portfolioItems.length === 1 ? 'Engagement' : 'Engagements'}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => {
                const imgUrl = getPortfolioImageUrl(item.imagePath);
                const disciplineName =
                  disciplineLabelMap.get(item.discipline.toLowerCase()) ?? item.discipline;

                return (
                  <article
                    key={item.id}
                    className="df-card-surface df-ambient flex flex-col overflow-hidden"
                  >
                    <ImageSlot
                      src={imgUrl}
                      aspectRatio="4/3"
                      shotDescription={item.title}
                      alt={item.client ? `${item.title} for ${item.client}` : item.title}
                      tone="dark"
                      badgeLabel=""
                      gradientStyle={SCENE_GRADIENTS[item.discipline.toLowerCase()]}
                      className="border-0 border-b border-[var(--border-strong)]"
                    />

                    <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
                          <span>{disciplineName}</span>
                          {item.client && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span className="text-[var(--text-muted)]">{item.client}</span>
                            </>
                          )}
                        </p>
                        <h3 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.externalUrl && (
                        <div className="pt-2 border-t border-[var(--border-subtle)]">
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--link-accent)] df-link-sweep"
                          >
                            <span>View Project</span>
                            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* Six Disciplines — Portfolio-Style Presentation */}
      <Section surface="off-white">
        <Container className="space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-strong)] pb-8">
            <div className="space-y-2">
              <Eyebrow number={hasPublishedWork ? '04' : '03'}>Six Production Disciplines</Eyebrow>
              <SectionHeading as="h2" size="h1">
                Built to move bookings, leads, and revenue.
              </SectionHeading>
            </div>
            {!hasPublishedWork && (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)] border border-[var(--border-strong)] px-3.5 py-2">
                {studioCopy.portfolioNotice}
              </p>
            )}
          </div>

          <StudioCinema />

          <div className="space-y-16">
            {disciplines.map((discipline, idx) => {
              const matchingWork = portfolioItems.find(
                (item) =>
                  item.discipline.toLowerCase() === discipline.id.toLowerCase() ||
                  item.discipline.toLowerCase() === discipline.title.toLowerCase()
              );
              const matchedImageUrl = matchingWork
                ? getPortfolioImageUrl(matchingWork.imagePath)
                : null;
              const effectiveSrc = discipline.image?.src || matchedImageUrl;
              const effectiveAlt =
                matchedImageUrl && matchingWork
                  ? matchingWork.client
                    ? `${matchingWork.title} — ${matchingWork.client}`
                    : matchingWork.title
                  : discipline.image?.alt ?? discipline.altText;

              return (
                <article
                  key={discipline.id}
                  className="grid gap-8 lg:grid-cols-12 lg:items-start border-b border-[var(--border-subtle)] pb-14 last:border-b-0 last:pb-0"
                >
                  <div className="lg:col-span-5">
                    <ImageSlot
                      src={effectiveSrc}
                      srcSet={discipline.image?.srcSet}
                      sizes={discipline.image?.sizes}
                      aspectRatio={discipline.aspectRatio}
                      shotDescription={
                        matchingWork?.title && matchedImageUrl
                          ? matchingWork.title
                          : discipline.shotDescription
                      }
                      alt={effectiveAlt}
                      tone="dark"
                      badgeLabel=""
                      gradientStyle={SCENE_GRADIENTS[discipline.id]}
                      artwork={renderDisciplineArtwork(discipline.id)}
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-blue)]">
                        {String(idx + 1).padStart(2, '0')} · {discipline.title}
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
              );
            })}
          </div>

          {hasCharacterAssets && (
            <div className="grid gap-6 sm:grid-cols-2 border-t border-[var(--border-strong)] pt-10">
              <CharacterSlot name="Di" />
              <CharacterSlot name="Fi" />
            </div>
          )}

          <div className="df-card-surface df-ambient df-frame-l p-4 sm:p-6">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {studioCopy.brandDirectionNote}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="DF. Studio" />
    </>
  );
}

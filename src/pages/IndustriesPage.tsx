import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageSlot } from '../components/brand/ImageSlot';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { INDUSTRIES, INDUSTRIES_COPY } from '../data/industries';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { IndustryItem } from '../types/content';

const INDUSTRY_GRADIENTS: readonly string[] = [
  // 01 Hospitality: Violet glow bottom-left, magenta bloom top-right
  'radial-gradient(circle at 18% 82%, rgba(179,79,255,0.68) 0%, transparent 56%), radial-gradient(circle at 84% 22%, rgba(226,51,137,0.58) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #160921 100%)',
  // 02 Travel & Tourism: Electric blue sweeping horizon, violet core
  'radial-gradient(circle at 78% 72%, rgba(0,87,255,0.72) 0%, transparent 58%), radial-gradient(circle at 22% 24%, rgba(179,79,255,0.52) 0%, transparent 52%), linear-gradient(140deg, #010102 0%, #071330 100%)',
  // 03 Food & Beverage: Warm magenta centerpiece, violet rim
  'radial-gradient(circle at 30% 30%, rgba(226,51,137,0.68) 0%, transparent 54%), radial-gradient(circle at 78% 82%, rgba(179,79,255,0.56) 0%, transparent 56%), linear-gradient(125deg, #010102 0%, #1c0818 100%)',
  // 04 Lifestyle & Luxury: Deep obsidian contrast with crisp diagonal magenta/blue edge
  'radial-gradient(circle at 85% 18%, rgba(226,51,137,0.62) 0%, transparent 52%), radial-gradient(circle at 24% 84%, rgba(0,87,255,0.48) 0%, transparent 56%), linear-gradient(150deg, #010102 0%, #12061c 100%)',
  // 05 Real Estate: Architectural electric blue & violet split
  'radial-gradient(circle at 20% 22%, rgba(0,87,255,0.62) 0%, transparent 54%), radial-gradient(circle at 82% 76%, rgba(179,79,255,0.64) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #0c1029 100%)',
  // 06 Retail & E-commerce: High-energy magenta + electric blue mesh
  'radial-gradient(circle at 72% 26%, rgba(0,87,255,0.65) 0%, transparent 52%), radial-gradient(circle at 26% 74%, rgba(226,51,137,0.66) 0%, transparent 56%), linear-gradient(135deg, #010102 0%, #1a0720 100%)',
  // 07 Healthcare: Calm deep blue with soft violet refraction
  'radial-gradient(circle at 32% 76%, rgba(0,87,255,0.68) 0%, transparent 56%), radial-gradient(circle at 76% 24%, rgba(179,79,255,0.46) 0%, transparent 52%), linear-gradient(135deg, #010102 0%, #06142e 100%)',
  // 08 Financial Services: Precision cobalt + restrained magenta corner light
  'radial-gradient(circle at 82% 82%, rgba(0,87,255,0.62) 0%, transparent 55%), radial-gradient(circle at 18% 20%, rgba(226,51,137,0.48) 0%, transparent 50%), linear-gradient(135deg, #010102 0%, #0c0d24 100%)',
  // 09 Government & Public Sector: Balanced violet + blue civic luminescence
  'radial-gradient(circle at 50% 80%, rgba(179,79,255,0.64) 0%, transparent 58%), radial-gradient(circle at 22% 24%, rgba(0,87,255,0.58) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #0a102b 100%)',
];

function getIndustryGradient(variant: number): string {
  return INDUSTRY_GRADIENTS[variant % INDUSTRY_GRADIENTS.length] ?? INDUSTRY_GRADIENTS[0];
}

function MobileIndustryMedia({
  industry,
  index,
  reducedMotion,
}: {
  industry: IndustryItem;
  index: number;
  reducedMotion: boolean;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion || revealed) return;
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-18% 0px -18% 0px', threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, revealed]);

  return (
    <div ref={hostRef} className="mt-3 lg:hidden">
      <div className={`df-mobile-clip ${revealed || reducedMotion ? 'is-revealed' : ''}`}>
        <ImageSlot
          src={industry.image?.src}
          srcSet={industry.image?.srcSet}
          sizes={industry.image?.sizes}
          alt={industry.image?.alt ?? `${industry.name} editorial placeholder`}
          shotDescription={industry.shotDescription}
          aspectRatio="16/9"
          tone="dark"
          badgeLabel={`PHOTO PLACEHOLDER · 0${index + 1}`}
          gradientStyle={getIndustryGradient(industry.gradientVariant)}
        />
      </div>
    </div>
  );
}

export default function IndustriesPage() {
  usePageMeta('/industries');
  const reducedMotion = useReducedMotion();

  const [hoveredId, setHoveredId] = useState<string>(INDUSTRIES[0].id);
  const [previousId, setPreviousId] = useState<string | null>(null);
  const [announcedIndustry, setAnnouncedIndustry] = useState<string>('');
  const pointerInteractingRef = useRef(false);

  const activeIndex = Math.max(
    0,
    INDUSTRIES.findIndex((i) => i.id === hoveredId)
  );
  const activeIndustry = INDUSTRIES[activeIndex] ?? INDUSTRIES[0];
  const prevIndustry = previousId
    ? INDUSTRIES.find((i) => i.id === previousId) ?? null
    : null;

  const selectVisualIndustry = (id: string, announce = false) => {
    if (id !== hoveredId) {
      setPreviousId(hoveredId);
      setHoveredId(id);
    }
    if (announce) {
      const target = INDUSTRIES.find((i) => i.id === id);
      if (target) {
        setAnnouncedIndustry(`${target.name}: ${target.approachNote}`);
      }
    }
  };

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

      {/* Typographic Index with Desktop 4:5 Media Stage & Mobile Inline Reveals */}
      <Section surface="off-white">
        <Container className="space-y-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <ul
              className="lg:col-span-7 divide-y divide-[var(--border-strong)] border-y border-[var(--border-strong)]"
              onPointerDown={() => {
                pointerInteractingRef.current = true;
              }}
              onKeyDown={() => {
                pointerInteractingRef.current = false;
              }}
            >
              {INDUSTRIES.map((industry, idx) => {
                const isSelected = industry.id === activeIndustry.id;
                return (
                  <li
                    key={industry.id}
                    className="df-row py-1"
                    data-active={isSelected ? 'true' : undefined}
                  >
                    <Link
                      to={industry.path}
                      onMouseEnter={() => selectVisualIndustry(industry.id, false)}
                      onFocus={() =>
                        selectVisualIndustry(industry.id, !pointerInteractingRef.current)
                      }
                      onClick={() => selectVisualIndustry(industry.id, true)}
                      className={`relative z-10 block py-4 px-3 ${
                        isSelected
                          ? 'text-[var(--link-accent)]'
                          : 'text-[var(--text-primary)] hover:text-[var(--link-accent)]'
                      }`}
                    >
                      <div className="flex min-h-[44px] items-center justify-between gap-4">
                        <span className="flex items-baseline gap-4">
                          <span className="df-row-num text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                            0{idx + 1}
                          </span>
                          <span className="df-row-title text-xl sm:text-2xl font-extrabold tracking-tight">
                            {industry.name}
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
                          <span>{industry.isDedicatedPage ? 'Explore Sector' : 'Inquire'}</span>
                          <ArrowUpRight aria-hidden="true" className="df-row-arrow h-4 w-4" />
                        </span>
                      </div>
                      <p className="mt-1.5 pl-8 text-xs leading-relaxed text-[var(--text-muted)] lg:hidden">
                        {industry.approachNote}
                      </p>
                    </Link>

                    <div className="px-3 pb-4 lg:hidden">
                      <MobileIndustryMedia
                        industry={industry}
                        index={idx}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Sticky Column: Large 4:5 Editorial Stage + Context Reveal Panel */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              {/* Desktop 4:5 Slanted-Wipe Media Stage */}
              <div className="hidden lg:block relative overflow-hidden aspect-[4/5] max-h-[440px] w-full border border-[var(--border-strong)] bg-[var(--near-black)]">
                {prevIndustry && prevIndustry.id !== activeIndustry.id && (
                  <div
                    key={`prev-${prevIndustry.id}`}
                    aria-hidden="true"
                    className="df-stage-fade-out pointer-events-none absolute inset-0"
                  >
                    <ImageSlot
                      src={prevIndustry.image?.src}
                      srcSet={prevIndustry.image?.srcSet}
                      sizes={prevIndustry.image?.sizes}
                      alt=""
                      shotDescription={prevIndustry.shotDescription}
                      aspectRatio="4/5"
                      tone="dark"
                      badgeLabel="PHOTO PLACEHOLDER"
                      gradientStyle={getIndustryGradient(prevIndustry.gradientVariant)}
                      hideCaption
                      className="h-full w-full border-0"
                    />
                  </div>
                )}

                <div key={`active-${activeIndustry.id}`} className="df-stage-wipe-in relative h-full w-full">
                  <ImageSlot
                    src={activeIndustry.image?.src}
                    srcSet={activeIndustry.image?.srcSet}
                    sizes={activeIndustry.image?.sizes}
                    alt={activeIndustry.image?.alt ?? `${activeIndustry.name} editorial placeholder`}
                    shotDescription={activeIndustry.shotDescription}
                    aspectRatio="4/5"
                    tone="dark"
                    badgeLabel="PHOTO PLACEHOLDER"
                    gradientStyle={getIndustryGradient(activeIndustry.gradientVariant)}
                    hideCaption
                    className="h-full w-full border-0"
                  />

                  {/* Bottom scrim + Line-Mask Counter & Editorial Industry Title Overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#010102]/95 via-[#010102]/72 to-transparent p-6 pt-14 text-[var(--off-white)]">
                    <div className="overflow-hidden">
                      <p className="df-line-mask-rise text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--magenta)] tabular-nums">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(INDUSTRIES.length).padStart(2, '0')} · SECTOR BRIEF
                      </p>
                    </div>
                    <div className="overflow-hidden mt-1">
                      <p className="df-line-mask-rise text-2xl font-extrabold tracking-tight text-[var(--off-white)]">
                        {activeIndustry.name}
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--off-white)]/85">
                      {activeIndustry.shotDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Context Reveal Panel (live announcements handled via selection-only sr-only region) */}
              <div className="df-card-surface df-ambient df-panel-hairline df-frame-l p-6 sm:p-7 space-y-4">
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
              </div>

              {/* Screen-reader live region updates ONLY on keyboard/click selection, never passive hover */}
              <div className="sr-only" aria-live="polite">
                {announcedIndustry}
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

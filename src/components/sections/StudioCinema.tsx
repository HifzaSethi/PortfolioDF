import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { STUDIO_DISCIPLINES } from '../../data/studio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ImageSlot } from '../brand/ImageSlot';

type FilmTransitionType = 'wipe' | 'push' | 'letterbox' | 'lightleak' | 'whip';

const TRANSITION_ORDER: FilmTransitionType[] = [
  'wipe',
  'push',
  'letterbox',
  'lightleak',
  'whip',
];

const SCENE_GRADIENTS: Record<string, string> = {
  copywriting:
    'radial-gradient(circle at 22% 78%, rgba(179,79,255,0.62) 0%, transparent 56%), radial-gradient(circle at 80% 24%, rgba(226,51,137,0.44) 0%, transparent 52%), linear-gradient(135deg, #010102 0%, #150821 100%)',
  photography:
    'radial-gradient(circle at 76% 32%, rgba(0,87,255,0.58) 0%, transparent 54%), radial-gradient(circle at 24% 72%, rgba(179,79,255,0.5) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #07132c 100%)',
  videography:
    'radial-gradient(circle at 30% 34%, rgba(226,51,137,0.62) 0%, transparent 56%), radial-gradient(circle at 76% 74%, rgba(0,87,255,0.48) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #170818 100%)',
  'graphic-design':
    'radial-gradient(circle at 82% 72%, rgba(179,79,255,0.64) 0%, transparent 54%), radial-gradient(circle at 18% 28%, rgba(0,87,255,0.52) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #0d0e26 100%)',
  'motion-graphics':
    'radial-gradient(circle at 68% 24%, rgba(226,51,137,0.64) 0%, transparent 52%), radial-gradient(circle at 28% 76%, rgba(179,79,255,0.56) 0%, transparent 56%), linear-gradient(135deg, #010102 0%, #1a0721 100%)',
  'ai-content':
    'radial-gradient(circle at 74% 66%, rgba(0,87,255,0.64) 0%, transparent 54%), radial-gradient(circle at 32% 30%, rgba(226,51,137,0.54) 0%, transparent 54%), linear-gradient(135deg, #010102 0%, #09122e 100%)',
};

function renderDisciplineArtwork(disciplineId: string): ReactNode {
  switch (disciplineId) {
    case 'copywriting':
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-45" aria-hidden="true">
          <g transform="skewX(-12)" fill="none" stroke="var(--off-white)" strokeOpacity="0.28">
            <rect x="110" y="64" width="240" height="18" fill="var(--violet)" fillOpacity="0.32" stroke="none" />
            <rect x="110" y="96" width="380" height="12" fill="var(--off-white)" fillOpacity="0.22" stroke="none" />
            <rect x="110" y="120" width="310" height="12" fill="var(--magenta)" fillOpacity="0.35" stroke="none" />
            <line x1="110" y1="168" x2="640" y2="168" strokeWidth="1" />
            <rect x="490" y="54" width="160" height="74" strokeWidth="1.5" />
          </g>
        </svg>
      );
    case 'photography':
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-55" aria-hidden="true">
          <g stroke="var(--off-white)" strokeOpacity="0.32" fill="none" strokeWidth="1.25">
            <line x1="266" y1="0" x2="266" y2="340" />
            <line x1="533" y1="0" x2="533" y2="340" />
            <line x1="0" y1="113" x2="800" y2="113" />
            <line x1="0" y1="226" x2="800" y2="226" />
            <circle cx="400" cy="170" r="88" stroke="var(--violet)" strokeOpacity="0.55" />
            <circle cx="400" cy="170" r="44" stroke="var(--magenta)" strokeOpacity="0.65" />
            <path d="M 180 78 H 208 M 180 78 V 106 M 620 78 H 592 M 620 78 V 106 M 180 262 H 208 M 180 262 V 234 M 620 262 H 592 M 620 262 V 234" strokeWidth="2" />
          </g>
        </svg>
      );
    case 'videography':
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-50" aria-hidden="true">
          <g fill="var(--off-white)" fillOpacity="0.22">
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i}>
                <rect x={32 + i * 48} y="16" width="24" height="14" rx="2" />
                <rect x={32 + i * 48} y="310" width="24" height="14" rx="2" />
              </g>
            ))}
          </g>
          <g stroke="var(--magenta)" strokeOpacity="0.45" fill="none" strokeWidth="1.5">
            <rect x="140" y="54" width="520" height="232" />
            <line x1="400" y1="138" x2="400" y2="202" />
            <line x1="368" y1="170" x2="432" y2="170" />
          </g>
        </svg>
      );
    case 'graphic-design':
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-55" aria-hidden="true">
          <g transform="skewX(-12)">
            <rect x="190" y="52" width="140" height="190" fill="none" stroke="var(--violet)" strokeOpacity="0.55" strokeWidth="2" />
            <rect x="290" y="96" width="180" height="120" fill="var(--electric-blue)" fillOpacity="0.24" stroke="var(--off-white)" strokeOpacity="0.3" strokeWidth="1" />
            <rect x="440" y="64" width="120" height="164" fill="var(--magenta)" fillOpacity="0.22" stroke="none" />
          </g>
        </svg>
      );
    case 'motion-graphics':
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-60" aria-hidden="true">
          <g transform="skewX(-12)" fill="none" strokeLinecap="square">
            <line x1="80" y1="92" x2="620" y2="92" stroke="var(--violet)" strokeOpacity="0.55" strokeWidth="3" />
            <line x1="160" y1="142" x2="720" y2="142" stroke="var(--off-white)" strokeOpacity="0.3" strokeWidth="1.5" />
            <line x1="120" y1="192" x2="660" y2="192" stroke="var(--magenta)" strokeOpacity="0.65" strokeWidth="4" />
            <line x1="210" y1="242" x2="580" y2="242" stroke="var(--electric-blue)" strokeOpacity="0.55" strokeWidth="2" />
          </g>
        </svg>
      );
    case 'ai-content':
    default:
      return (
        <svg viewBox="0 0 800 340" className="h-full w-full opacity-60" aria-hidden="true">
          <g stroke="var(--off-white)" strokeOpacity="0.24" strokeWidth="1">
            <line x1="170" y1="88" x2="400" y2="170" />
            <line x1="290" y1="248" x2="400" y2="170" />
            <line x1="520" y1="74" x2="400" y2="170" />
            <line x1="630" y1="224" x2="400" y2="170" />
            <line x1="170" y1="88" x2="520" y2="74" />
            <line x1="290" y1="248" x2="630" y2="224" />
          </g>
          <g transform="skewX(-12)">
            <rect x="424" y="156" width="22" height="22" fill="var(--magenta)" />
            <rect x="180" y="80" width="12" height="12" fill="var(--violet)" />
            <rect x="330" y="242" width="12" height="12" fill="var(--electric-blue)" />
            <rect x="530" y="68" width="12" height="12" fill="var(--off-white)" />
            <rect x="664" y="218" width="12" height="12" fill="var(--violet)" />
          </g>
        </svg>
      );
  }
}

export function StudioCinema() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [transitionType, setTransitionType] = useState<FilmTransitionType>('wipe');
  const [transitionSeed, setTransitionSeed] = useState(0);

  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  const total = STUDIO_DISCIPLINES.length;
  const activeDiscipline = STUDIO_DISCIPLINES[activeIndex] ?? STUDIO_DISCIPLINES[0];
  const prevDiscipline =
    prevIndex !== null && prevIndex !== activeIndex
      ? STUDIO_DISCIPLINES[prevIndex] ?? null
      : null;

  const isPlaying =
    !reducedMotion &&
    !userPaused &&
    !isHovered &&
    !hasFocusWithin &&
    !isOffscreen &&
    !isTabHidden;

  const goToIndex = useCallback(
    (nextIdx: number) => {
      const normalized = ((nextIdx % total) + total) % total;
      if (normalized === activeIndex) return;

      setPrevIndex(activeIndex);
      setActiveIndex(normalized);
      setTransitionType((prevType) => {
        const curPos = TRANSITION_ORDER.indexOf(prevType);
        const nextType = TRANSITION_ORDER[(curPos + 1) % TRANSITION_ORDER.length];
        return nextType;
      });
      setTransitionSeed((s) => s + 1);
    },
    [activeIndex, total]
  );

  // Track visibility off-screen and tab hidden
  useEffect(() => {
    const host = rootRef.current;
    const onVisibility = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    let observer: IntersectionObserver | null = null;
    if (host && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => setIsOffscreen(!(entry?.isIntersecting ?? true)),
        { threshold: 0.15 }
      );
      observer.observe(host);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, []);

  // 5.5s Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => {
      goToIndex(activeIndex + 1);
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, goToIndex, isPlaying]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToIndex(activeIndex - 1);
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goToIndex(activeIndex + 1);
      else goToIndex(activeIndex - 1);
    }
  };

  const incomingClass =
    transitionSeed === 0
      ? ''
      : transitionType === 'wipe'
        ? 'df-cinema-in-wipe'
        : transitionType === 'push'
          ? 'df-cinema-in-push'
          : transitionType === 'whip'
            ? 'df-cinema-in-whip'
            : 'df-cinema-in-cross';

  const outgoingClass =
    transitionSeed === 0
      ? ''
      : transitionType === 'whip'
        ? 'df-cinema-out-whip'
        : 'df-cinema-out-fade';

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="DF. Studio Creative Disciplines Reel"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHasFocusWithin(false);
        }
      }}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="space-y-4 focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-4"
    >
      {/* Cinema Stage (21:9 desktop, 16:9 mobile) */}
      <div
        className="relative overflow-hidden border border-[var(--border-strong)] bg-[var(--near-black)] aspect-video lg:aspect-[21/9]"
        aria-live="off"
      >
        {/* Outgoing Slide Layer */}
        {prevDiscipline && (
          <div
            key={`out-${prevDiscipline.id}-${transitionSeed}`}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${outgoingClass}`}
          >
            <ImageSlot
              src={prevDiscipline.image?.src}
              srcSet={prevDiscipline.image?.srcSet}
              sizes={prevDiscipline.image?.sizes}
              alt=""
              shotDescription={prevDiscipline.shotDescription}
              aspectRatio="cinema"
              tone="dark"
              badgeLabel="PORTFOLIO PLACEHOLDER: client work to be added"
              gradientStyle={SCENE_GRADIENTS[prevDiscipline.id]}
              artwork={renderDisciplineArtwork(prevDiscipline.id)}
              hideCaption
              className="h-full w-full border-0"
            />
          </div>
        )}

        {/* Active Slide Layer */}
        <div
          key={`in-${activeDiscipline.id}-${transitionSeed}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`Scene ${activeIndex + 1} of ${total}: ${activeDiscipline.title}`}
          className={`relative h-full w-full ${incomingClass}`}
        >
          <ImageSlot
            src={activeDiscipline.image?.src}
            srcSet={activeDiscipline.image?.srcSet}
            sizes={activeDiscipline.image?.sizes}
            alt={activeDiscipline.altText}
            shotDescription={activeDiscipline.shotDescription}
            aspectRatio="cinema"
            tone="dark"
            badgeLabel="PORTFOLIO PLACEHOLDER: client work to be added"
            gradientStyle={SCENE_GRADIENTS[activeDiscipline.id]}
            artwork={renderDisciplineArtwork(activeDiscipline.id)}
            hideCaption
            className="h-full w-full border-0"
          />
        </div>

        {/* Letterbox 2.39:1 Squeeze Bars (triggered during letterbox transition only) */}
        {transitionSeed > 0 && transitionType === 'letterbox' && !reducedMotion && (
          <>
            <div
              key={`lb-top-${transitionSeed}`}
              aria-hidden="true"
              className="df-cinema-letterbox-bar pointer-events-none absolute inset-x-0 top-0 z-20 h-[14%] origin-top bg-[#010102]"
            />
            <div
              key={`lb-bot-${transitionSeed}`}
              aria-hidden="true"
              className="df-cinema-letterbox-bar pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[14%] origin-bottom bg-[#010102]"
            />
          </>
        )}

        {/* Brief Light-Leak Radial Wash (triggered during lightleak transition only) */}
        {transitionSeed > 0 && transitionType === 'lightleak' && !reducedMotion && (
          <div
            key={`leak-${transitionSeed}`}
            aria-hidden="true"
            className="df-cinema-lightleak pointer-events-none absolute inset-0 z-20"
          />
        )}

        {/* Static SVG feTurbulence Film Grain Overlay (~6% opacity) */}
        <div
          aria-hidden="true"
          className="df-film-grain pointer-events-none absolute inset-0 z-20"
        />

        {/* Editorial Scrim + Slate/Timecode + Title/Tagline Line-Mask Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#010102]/95 via-[#010102]/70 to-transparent p-5 sm:p-8 pt-16 text-[var(--off-white)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--violet)] tabular-nums">
              SCENE {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} &middot;{' '}
              {activeDiscipline.title.toUpperCase()}
            </p>
            <p className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--off-white)]/65 tabular-nums">
              2.39:1 &middot; DF. STUDIO REEL
            </p>
          </div>

          <div
            key={`text-${activeDiscipline.id}-${transitionSeed}`}
            className="mt-2 max-w-3xl space-y-1.5"
          >
            <div className="overflow-hidden">
              <h3 className="df-line-mask-rise text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--off-white)]">
                {activeDiscipline.title}
              </h3>
            </div>
            <div className="overflow-hidden">
              <p className="df-line-mask-rise text-sm sm:text-base font-medium text-[var(--off-white)]/88">
                {activeDiscipline.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls & Slanted Frame Progress Ticks */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Studio reel scenes">
          {STUDIO_DISCIPLINES.map((disc, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={disc.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Scene 0${idx + 1}: ${disc.title}`}
                onClick={() => goToIndex(idx)}
                className="group flex h-11 min-w-[44px] items-center justify-center px-1.5 cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2.5 df-slant-block transition-[width,background-color,box-shadow] duration-300 ${
                    isCurrent
                      ? 'w-9 bg-[var(--magenta)] shadow-[0_0_12px_var(--glow-magenta)]'
                      : 'w-5 bg-[var(--border-strong)] group-hover:bg-[var(--violet)]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            aria-label={userPaused ? 'Play discipline reel' : 'Pause discipline reel'}
            className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] df-interactive hover:border-[var(--link-accent)]"
          >
            {userPaused ? (
              <>
                <Play aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="Previous discipline scene"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] df-interactive hover:border-[var(--link-accent)]"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="Next discipline scene"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] df-interactive hover:border-[var(--link-accent)]"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

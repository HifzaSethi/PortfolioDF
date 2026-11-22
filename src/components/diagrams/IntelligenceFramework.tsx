import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useScroll } from 'motion/react';
import { INTELLIGENCE_STAGES } from '../../data/intelligence';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { IntelligenceTransform, type TransformMode } from './IntelligenceTransform';

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const STAGE_TARGETS = [0.12, 0.37, 0.62, 0.88];

export function IntelligenceFramework() {
  const reducedMotion = useReducedMotion();
  const [isScrubViewport, setIsScrubViewport] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.innerWidth >= 1024 && window.innerHeight >= 700
      : true
  );

  useEffect(() => {
    const checkViewport = () => {
      setIsScrubViewport(window.innerWidth >= 1024 && window.innerHeight >= 700);
    };
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const transformMode: TransformMode = reducedMotion
    ? 'reduced'
    : isScrubViewport
      ? 'scrub'
      : 'autoplay';

  const [activeIndex, setActiveIndex] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);
  const [cometBurst, setCometBurst] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0.12);
  const railActiveRef = useRef<SVGLineElement | null>(null);
  const cometRef = useRef<SVGCircleElement | null>(null);
  const cometHaloRef = useRef<SVGCircleElement | null>(null);
  const scrollAnimRafRef = useRef<number>(0);
  const manualOverrideRef = useRef<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const syncRailToProgress = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(1, p));
    const cx = 100 + clamped * 600;
    if (railActiveRef.current) {
      railActiveRef.current.setAttribute('x2', cx.toFixed(1));
    }
    if (cometRef.current) {
      cometRef.current.setAttribute('cx', cx.toFixed(1));
    }
    if (cometHaloRef.current) {
      cometHaloRef.current.setAttribute('cx', cx.toFixed(1));
    }
  }, []);

  // Pulse comet once whenever activeIndex changes
  useEffect(() => {
    if (reducedMotion) return;
    setCometBurst(true);
    const id = window.setTimeout(() => setCometBurst(false), 420);
    return () => window.clearTimeout(id);
  }, [activeIndex, reducedMotion]);

  // Desktop sticky scroll progress subscription (zero per-frame React state updates)
  useEffect(() => {
    if (transformMode !== 'scrub') return;

    const handleProgress = (p: number) => {
      progressRef.current = p;
      syncRailToProgress(p);
      if (manualOverrideRef.current) return;

      const idx = Math.min(
        INTELLIGENCE_STAGES.length - 1,
        Math.max(0, Math.floor(p * INTELLIGENCE_STAGES.length))
      );
      setActiveIndex((prev) => (prev !== idx ? idx : prev));
    };

    handleProgress(scrollYProgress.get());
    const unsub = scrollYProgress.on('change', handleProgress);
    return () => unsub();
  }, [transformMode, scrollYProgress, syncRailToProgress]);

  // Cancel smooth stage-jump animation on user input
  useEffect(() => {
    const cancelScrollAnim = () => {
      if (scrollAnimRafRef.current) {
        window.cancelAnimationFrame(scrollAnimRafRef.current);
        scrollAnimRafRef.current = 0;
        manualOverrideRef.current = false;
      }
    };
    window.addEventListener('wheel', cancelScrollAnim, { passive: true });
    window.addEventListener('touchstart', cancelScrollAnim, { passive: true });
    return () => {
      cancelScrollAnim();
      window.removeEventListener('wheel', cancelScrollAnim);
      window.removeEventListener('touchstart', cancelScrollAnim);
    };
  }, []);

  const selectStage = useCallback(
    (index: number) => {
      const clampedIdx = Math.max(0, Math.min(INTELLIGENCE_STAGES.length - 1, index));
      const targetP = STAGE_TARGETS[clampedIdx] ?? 0.12;
      setActiveIndex(clampedIdx);

      if (reducedMotion) {
        progressRef.current = targetP;
        syncRailToProgress(targetP);
        return;
      }

      if (transformMode === 'scrub' && trackRef.current) {
        const track = trackRef.current;
        const rect = track.getBoundingClientRect();
        const trackTop = window.scrollY + rect.top;
        const scrollableSpan = Math.max(0, track.offsetHeight - window.innerHeight);

        if (scrollableSpan > 40) {
          if (scrollAnimRafRef.current) {
            window.cancelAnimationFrame(scrollAnimRafRef.current);
          }
          manualOverrideRef.current = true;
          const startY = window.scrollY;
          const destY = trackTop + targetP * scrollableSpan;
          const startTime = performance.now();
          const duration = 900;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const rawT = Math.min(1, elapsed / duration);
            const eased = easeInOutCubic(rawT);
            window.scrollTo({ top: startY + (destY - startY) * eased, behavior: 'auto' });

            if (rawT < 1) {
              scrollAnimRafRef.current = window.requestAnimationFrame(tick);
            } else {
              scrollAnimRafRef.current = 0;
              manualOverrideRef.current = false;
            }
          };

          scrollAnimRafRef.current = window.requestAnimationFrame(tick);
          return;
        }
      }

      // Mobile / short autoplay mode: animate progressRef cleanly to stage target
      if (scrollAnimRafRef.current) {
        window.cancelAnimationFrame(scrollAnimRafRef.current);
      }
      const startP = progressRef.current;
      const startTime = performance.now();
      const duration = 560;
      const stepToStage = (now: number) => {
        const rawT = Math.min(1, (now - startTime) / duration);
        const eased = easeInOutCubic(rawT);
        const curr = startP + (targetP - startP) * eased;
        progressRef.current = curr;
        syncRailToProgress(curr);
        if (rawT < 1) {
          scrollAnimRafRef.current = window.requestAnimationFrame(stepToStage);
        } else {
          scrollAnimRafRef.current = 0;
        }
      };
      scrollAnimRafRef.current = window.requestAnimationFrame(stepToStage);
    },
    [reducedMotion, syncRailToProgress, transformMode]
  );

  const handleAutoplayAdvance = useCallback(
    (p: number) => {
      syncRailToProgress(p);
      const idx = Math.min(
        INTELLIGENCE_STAGES.length - 1,
        Math.max(0, Math.floor(p * INTELLIGENCE_STAGES.length))
      );
      setActiveIndex((prev) => (prev !== idx ? idx : prev));
    },
    [syncRailToProgress]
  );

  const handleReplay = useCallback(() => {
    progressRef.current = 0;
    syncRailToProgress(0);
    setActiveIndex(0);
    setReplayNonce((n) => n + 1);
  }, [syncRailToProgress]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let target: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      target = (idx + 1) % INTELLIGENCE_STAGES.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      target = (idx - 1 + INTELLIGENCE_STAGES.length) % INTELLIGENCE_STAGES.length;
    } else if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = INTELLIGENCE_STAGES.length - 1;
    }

    if (target !== null) {
      event.preventDefault();
      selectStage(target);
      document.getElementById(`intel-stage-${INTELLIGENCE_STAGES[target].id}`)?.focus();
    }
  };

  // Keep SVG rail synchronized in reduced-motion mode
  useEffect(() => {
    if (reducedMotion) {
      syncRailToProgress(STAGE_TARGETS[activeIndex] ?? 0.12);
    }
  }, [activeIndex, reducedMotion, syncRailToProgress]);

  const current = INTELLIGENCE_STAGES[activeIndex] ?? INTELLIGENCE_STAGES[0];
  const isScrubbing = transformMode === 'scrub';

  return (
    <div ref={trackRef} className={isScrubbing ? 'lg:min-h-[240vh] relative' : 'relative'}>
      <div className={isScrubbing ? 'lg:sticky lg:top-[84px] space-y-5' : 'space-y-6'}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
              THE DF. INTELLIGENCE FRAMEWORK™
            </p>
            <p className="mt-1.5 max-w-2xl text-lg font-semibold text-[var(--off-white)]">
              Most agencies provide reporting. DF. provides intelligence.
            </p>
          </div>
          <p className="text-xs max-w-sm text-[var(--on-dark-muted)]">
            The operating idea behind every strategy, campaign, report, and recommendation we
            produce.
          </p>
        </div>

        {/* Canvas 2D Transformation Hero Visual (or static 4-panel view under reduced motion) */}
        <IntelligenceTransform
          mode={transformMode}
          activeIndex={activeIndex}
          progressRef={progressRef}
          replayNonce={replayNonce}
          onAutoplayAdvance={handleAutoplayAdvance}
          onSelectStage={selectStage}
          onReplay={handleReplay}
        />

        {/* Connected Stage SVG Rail & Travelling Light Comet */}
        <div className="hidden md:block -mb-2 px-6" aria-hidden="true">
          <svg className="w-full h-5 overflow-visible" viewBox="0 0 800 20" preserveAspectRatio="none">
            <defs>
              <linearGradient id="df-rail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B34FFF" />
                <stop offset="55%" stopColor="#E23389" />
                <stop offset="100%" stopColor="#0057FF" />
              </linearGradient>
            </defs>
            <line
              x1="100"
              y1="10"
              x2="700"
              y2="10"
              stroke="rgba(244,241,234,0.16)"
              strokeWidth="2"
            />
            <line
              ref={railActiveRef}
              x1="100"
              y1="10"
              x2="172"
              y2="10"
              stroke="url(#df-rail-grad)"
              strokeWidth="2.5"
            />
            {INTELLIGENCE_STAGES.map((st, idx) => {
              const cx = 100 + idx * 200;
              const isPast = idx < activeIndex;
              const isCurr = idx === activeIndex;
              return (
                <circle
                  key={st.id}
                  cx={cx}
                  cy="10"
                  r={isCurr ? 5 : 3.5}
                  fill={isCurr ? '#E23389' : isPast ? '#B34FFF' : 'rgba(244,241,234,0.3)'}
                  fillOpacity={isCurr ? 1 : isPast ? 0.55 : 0.4}
                />
              );
            })}
            {!reducedMotion && (
              <>
                <circle
                  ref={cometHaloRef}
                  cx="172"
                  cy="10"
                  r={cometBurst ? 13 : 8}
                  fill="#B34FFF"
                  fillOpacity={cometBurst ? 0.45 : 0.25}
                  style={{ transition: 'r 260ms ease, fill-opacity 260ms ease' }}
                />
                <circle
                  ref={cometRef}
                  cx="172"
                  cy="10"
                  r="4"
                  fill="#F4F1EA"
                />
              </>
            )}
          </svg>
        </div>

        {/* 4-Stage Interactive Sequence (F7: hover highlights only, click/keys switch) */}
        <div
          role="tablist"
          aria-label="DF. Intelligence Framework stages"
          className="grid gap-3 md:grid-cols-4"
        >
          {INTELLIGENCE_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = idx < activeIndex;
            return (
              <button
                key={stage.id}
                id={`intel-stage-${stage.id}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="intel-stage-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectStage(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                data-spotlight=""
                className={`group relative text-left p-5 df-interactive df-glass-dark transition-opacity duration-200 ${
                  isActive
                    ? 'border-[var(--magenta)] bg-[color-mix(in_srgb,var(--electric-blue)_16%,var(--near-black))] opacity-100 shadow-[0_0_24px_var(--glow-violet)]'
                    : isCompleted
                      ? 'opacity-70 hover:opacity-95 border-[var(--violet)]/40'
                      : 'opacity-45 hover:opacity-85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold tabular-nums">
                  <span
                    className={
                      isActive
                        ? 'text-[var(--magenta)] drop-shadow-[0_0_8px_var(--glow-magenta)]'
                        : isCompleted
                          ? 'text-[var(--violet)]'
                          : 'text-[var(--on-dark-subtle)]'
                    }
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className={`h-1.5 w-4 df-slant-block ${
                      isActive
                        ? 'bg-[var(--magenta)]'
                        : isCompleted
                          ? 'bg-[var(--violet)]/60'
                          : 'bg-[var(--on-dark-subtle)]/30'
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-3 text-lg sm:text-xl font-extrabold tracking-tight text-[var(--off-white)]">
                  {stage.label}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-[var(--violet)]">
                  {stage.question}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail (240ms crossfade keyed cleanly by stage id) */}
        <div
          id="intel-stage-panel"
          role="tabpanel"
          aria-live="polite"
          className="df-glass-dark p-5 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden"
        >
          <div
            key={current.id}
            className="df-panel-crossfade space-y-1.5 max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              Stage 0{activeIndex + 1} · {current.label}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--off-white)]">
              {current.question}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--on-dark-muted)]">
              {current.explanation}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                selectStage((activeIndex - 1 + INTELLIGENCE_STAGES.length) % INTELLIGENCE_STAGES.length)
              }
              className="min-h-[44px] px-4 py-2 border border-[var(--border-dark-strong)] text-xs font-semibold text-[var(--off-white)] hover:border-[var(--electric-blue)] df-interactive"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => selectStage((activeIndex + 1) % INTELLIGENCE_STAGES.length)}
              className="min-h-[44px] px-4 py-2 bg-[var(--electric-blue)] text-xs font-semibold text-[var(--off-white)] hover:opacity-90 df-interactive"
            >
              Next Stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

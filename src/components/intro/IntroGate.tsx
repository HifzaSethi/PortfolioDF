import { ArrowRight } from 'lucide-react';
import { animate, type AnimationPlaybackControls } from 'motion/react';
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SITE_CONFIG } from '../../config/site';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CurtainReveal } from './CurtainReveal';
import { useIntro } from './IntroContext';
import { IntroFallback } from './IntroFallback';
import { isWebGLSupported, markIntroSeen } from './introStorage';

const IntroScene = lazy(() => import('./IntroScene'));

interface IntroErrorBoundaryProps {
  onFallback: () => void;
  children: ReactNode;
}

interface IntroErrorBoundaryState {
  failed: boolean;
}

class IntroErrorBoundary extends Component<
  IntroErrorBoundaryProps,
  IntroErrorBoundaryState
> {
  state: IntroErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): IntroErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFallback();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function IntroGate() {
  const {
    phase,
    isActive,
    setPhase,
    setIntroWebGLDisposed,
    setContentRevealAllowed,
  } = useIntro();

  const reducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setIsCoarsePointer(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const [useFallback, setUseFallback] = useState<boolean>(() => !isWebGLSupported());
  const [sceneUnmounted, setSceneUnmounted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const uiStackRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const exploreRef = useRef<HTMLButtonElement | null>(null);

  const cancelledRef = useRef(false);
  const animControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const timersRef = useRef<number[]>([]);

  useBodyScrollLock(isActive);

  const clearScheduled = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
    for (const ctrl of animControlsRef.current) {
      ctrl.stop();
    }
    animControlsRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Sync html[data-intro] attribute cleanly with overlay lifecycle
  useEffect(() => {
    if (isActive) {
      document.documentElement.dataset.intro = 'active';
    } else {
      delete document.documentElement.dataset.intro;
    }
    return () => {
      if (document.documentElement.dataset.intro === 'active') {
        delete document.documentElement.dataset.intro;
      }
    };
  }, [isActive]);

  // 6-second WebGL chunk / readiness timeout fallback
  useEffect(() => {
    if (!isActive || phase !== 'loading' || useFallback) return;
    const timeoutId = window.setTimeout(() => {
      setUseFallback(true);
      setPhase((prev) => (prev === 'loading' ? 'ready' : prev));
    }, 6000);
    return () => window.clearTimeout(timeoutId);
  }, [isActive, phase, useFallback, setPhase]);

  // Initial focus + subtle staged entrance
  useEffect(() => {
    if (!isActive) return;

    const rafFocus = window.requestAnimationFrame(() => {
      exploreRef.current?.focus({ preventScroll: true });
    });

    if (!reducedMotion) {
      const staggerItems: Array<{
        el: HTMLElement | null;
        delay: number;
        y: number;
        opacityTo?: number;
      }> = [
        { el: logoRef.current, delay: 0.16, y: 12 },
        { el: taglineRef.current, delay: 0.28, y: 10 },
        { el: actionsRef.current, delay: 0.4, y: 10 },
        { el: hintRef.current, delay: 0.65, y: 6, opacityTo: 0.82 },
      ];

      for (const item of staggerItems) {
        if (!item.el) continue;
        item.el.style.opacity = '0';
        const ctrl = animate(
          item.el,
          {
            opacity: [0, item.opacityTo ?? 1],
            transform: [`translateY(${item.y}px)`, 'translateY(0px)'],
          },
          {
            duration: 0.48,
            delay: item.delay,
            ease: [0.16, 1, 0.3, 1],
          }
        );
        animControlsRef.current.push(ctrl);
      }
    }

    return () => {
      window.cancelAnimationFrame(rafFocus);
      clearScheduled();
    };
  }, [isActive, reducedMotion, clearScheduled]);

  const finalizeDone = useCallback(() => {
    delete document.documentElement.dataset.intro;
    const shell = document.getElementById('app-shell');
    if (shell) {
      shell.style.transform = '';
      shell.style.transformOrigin = '';
      shell.style.willChange = '';
    }
    setSceneUnmounted(true);
    setIntroWebGLDisposed(true);
    setContentRevealAllowed(true);
    setPhase('done');
    setAnnouncement('Welcome to Digital Field.');

    window.requestAnimationFrame(() => {
      const s = document.getElementById('app-shell');
      if (s) {
        s.style.transform = '';
        s.style.transformOrigin = '';
        s.style.willChange = '';
      }
      const h1 = document.querySelector<HTMLElement>('main h1');
      if (h1) {
        if (!h1.hasAttribute('tabindex')) {
          h1.setAttribute('tabindex', '-1');
        }
        h1.focus({ preventScroll: true });
      }
    });
  }, [setContentRevealAllowed, setIntroWebGLDisposed, setPhase]);

  const handleSceneReady = useCallback(() => {
    setPhase((prev) => (prev === 'loading' ? 'ready' : prev));
  }, [setPhase]);

  const handleFallback = useCallback(() => {
    setUseFallback(true);
    setSceneUnmounted(true);
    setIntroWebGLDisposed(true);
    setPhase((prev) => (prev === 'loading' ? 'ready' : prev));
  }, [setIntroWebGLDisposed, setPhase]);

  const handleFirstInteract = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleExplore = useCallback(() => {
    if (!isActive || phase === 'opening') return;
    cancelledRef.current = false;
    clearScheduled();
    markIntroSeen();
    setHasInteracted(true);
    setPhase('opening');

    if (reducedMotion) {
      setSceneUnmounted(true);
      setIntroWebGLDisposed(true);
      setContentRevealAllowed(true);
      if (overlayRef.current) {
        const ctrl = animate(
          overlayRef.current,
          { opacity: [1, 0] },
          { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
        );
        animControlsRef.current.push(ctrl);
        void ctrl.finished.then(() => {
          if (!cancelledRef.current) finalizeDone();
        });
      } else {
        finalizeDone();
      }
      return;
    }

    // UI lockup gently descends & fades over 0..500ms while curtains begin parting
    if (uiStackRef.current) {
      animControlsRef.current.push(
        animate(
          uiStackRef.current,
          {
            opacity: [1, 0],
            transform: ['translateY(0px)', 'translateY(10px)'],
          },
          { duration: 0.48, ease: [0.16, 1, 0.3, 1] }
        )
      );
    }

    // Start revealing real homepage hero copy as curtains clear center
    scheduleTimer(() => {
      if (!cancelledRef.current) {
        setContentRevealAllowed(true);
      }
    }, 500);

    // Dispose Intro WebGL right at ~600ms so the curtain sweep stays 100% stutter-free
    // HeroEcosystemCanvas will mount cleanly inside finalizeDone() once curtains finish parting
    scheduleTimer(() => {
      if (!cancelledRef.current) {
        setSceneUnmounted(true);
      }
    }, 600);
  }, [
    clearScheduled,
    finalizeDone,
    isActive,
    phase,
    reducedMotion,
    scheduleTimer,
    setContentRevealAllowed,
    setIntroWebGLDisposed,
    setPhase,
  ]);

  const handleSkip = useCallback(() => {
    if (!isActive) return;
    cancelledRef.current = true;
    clearScheduled();
    markIntroSeen();

    const shell = document.getElementById('app-shell');
    if (shell) {
      shell.style.transform = '';
      shell.style.transformOrigin = '';
      shell.style.willChange = '';
    }

    setSceneUnmounted(true);
    setIntroWebGLDisposed(true);
    setContentRevealAllowed(true);

    if (reducedMotion || !overlayRef.current) {
      finalizeDone();
      return;
    }

    const ctrl = animate(
      overlayRef.current,
      { opacity: [1, 0] },
      { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
    );
    animControlsRef.current.push(ctrl);
    void ctrl.finished.then(() => {
      finalizeDone();
    });
  }, [
    clearScheduled,
    finalizeDone,
    isActive,
    reducedMotion,
    setContentRevealAllowed,
    setIntroWebGLDisposed,
  ]);

  const handleCurtainComplete = useCallback(() => {
    if (!cancelledRef.current) {
      finalizeDone();
    }
  }, [finalizeDone]);

  // Escape key immediately skips intro in every active state
  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isActive, handleSkip]);

  return (
    <>
      {/* Persistent polite live region announced after intro finishes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {isActive && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Digital Field. introduction"
          className="fixed inset-0 z-[var(--z-intro)] h-[100dvh] w-full overflow-hidden select-none"
        >
          <CurtainReveal
            phase={phase}
            reducedMotion={reducedMotion}
            onCurtainComplete={handleCurtainComplete}
          >
            <p className="sr-only" aria-live="polite">
              Introduction. Press Explore to enter the website, or Skip Intro.
            </p>
            <p id="intro-canvas-hint" className="sr-only">
              Drag, or use arrow keys to rotate. Press Enter to spin.
            </p>

            {/* Full-stage interactive 3D mark or 14-layer CSS fallback */}
            <div className="absolute inset-0 z-10">
              {phase === 'loading' && !useFallback && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none flex h-full w-full items-start justify-center pt-[clamp(4.5rem,18dvh,10rem)]"
                >
                  <img
                    src={SITE_CONFIG.assets.logos.iconDark}
                    alt=""
                    className="h-24 sm:h-32 w-auto object-contain opacity-75 animate-pulse"
                    draggable={false}
                  />
                </div>
              )}

              {useFallback ? (
                <IntroFallback
                  reducedMotion={reducedMotion}
                  isOpening={phase === 'opening'}
                  onFirstInteract={handleFirstInteract}
                  onReady={handleSceneReady}
                />
              ) : !sceneUnmounted ? (
                <IntroErrorBoundary onFallback={handleFallback}>
                  <Suspense fallback={null}>
                    <IntroScene
                      reducedMotion={reducedMotion}
                      isOpening={phase === 'opening'}
                      onReady={handleSceneReady}
                      onFallback={handleFallback}
                      onFirstInteract={handleFirstInteract}
                    />
                  </Suspense>
                </IntroErrorBoundary>
              ) : null}
            </div>

            {/* Bottom brand lockup & entry actions */}
            <div
              ref={uiStackRef}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-6 pb-[clamp(1rem,4.5dvh,3.5rem)] text-center"
            >
              <p
                ref={hintRef}
                aria-hidden="true"
                className={`mb-3 sm:mb-4 [@media(max-height:460px)]:mb-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--on-dark-subtle)] transition-opacity duration-500 ${
                  hasInteracted || phase === 'opening' ? '!opacity-0' : ''
                }`}
              >
                {isCoarsePointer ? 'DRAG OR TAP' : 'DRAG TO ROTATE'}
              </p>

              <img
                ref={logoRef}
                src={SITE_CONFIG.assets.logos.wordmarkDark}
                alt="Digital Field."
                draggable={false}
                className="h-8 sm:h-11 md:h-14 [@media(max-height:460px)]:h-7 w-auto object-contain"
              />

              <p
                ref={taglineRef}
                className="mt-2 sm:mt-3 [@media(max-height:460px)]:mt-1.5 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.22em] text-[var(--on-dark-muted)]"
              >
                PERFORMANCE IN CONTEXT.
              </p>

              <div
                ref={actionsRef}
                className="pointer-events-auto mt-4 sm:mt-6 [@media(max-height:460px)]:mt-3 flex w-full max-w-xs sm:max-w-none flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
              >
                <button
                  ref={exploreRef}
                  type="button"
                  disabled={phase === 'opening'}
                  onClick={handleExplore}
                  className="relative overflow-hidden inline-flex min-h-[48px] items-center justify-center gap-2.5 px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--near-black)] df-gradient-accent df-slant-block df-interactive focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] disabled:cursor-default"
                >
                  {!reducedMotion && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent df-explore-sweep"
                    />
                  )}
                  <span className="df-unslant relative z-10 inline-flex items-center gap-2">
                    <span>Explore</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="inline-flex min-h-[48px] items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--off-white)] border border-[var(--border-dark-strong)] bg-black/25 backdrop-blur-sm hover:border-[var(--off-white)] df-interactive focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)]"
                >
                  Skip Intro
                </button>
              </div>
            </div>
          </CurtainReveal>
        </div>
      )}
    </>
  );
}

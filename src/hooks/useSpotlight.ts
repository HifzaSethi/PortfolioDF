import { useEffect } from 'react';

/**
 * Single delegated pointermove listener for desktop [data-spotlight] TIER 1 elements
 * plus one-time viewport-center glow pulse on touch devices (@media (hover: none)).
 * Honors prefers-reduced-motion and cleans up all listeners/observers on unmount.
 */
export function useInteractionPolish() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (supportsHover) {
      let rafId = 0;
      let pendingEvent: PointerEvent | null = null;

      const updateSpotlight = () => {
        rafId = 0;
        const e = pendingEvent;
        if (!e) return;
        const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-spotlight]') : null;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        target.style.setProperty('--mx', `${x.toFixed(1)}%`);
        target.style.setProperty('--my', `${y.toFixed(1)}%`);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        pendingEvent = e;
        if (!rafId) {
          rafId = window.requestAnimationFrame(updateSpotlight);
        }
      };

      document.addEventListener('pointermove', onPointerMove, { passive: true });
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
        document.removeEventListener('pointermove', onPointerMove);
      };
    }

    // Touch / coarse-pointer: brief one-time pulse when TIER 1 [data-spotlight] crosses viewport center
    if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      const pulsed = new WeakSet<Element>();
      const timers = new Set<number>();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || pulsed.has(entry.target)) continue;
            pulsed.add(entry.target);
            observer.unobserve(entry.target);
            const el = entry.target as HTMLElement;
            el.setAttribute('data-touch-pulse', 'true');
            const timer = window.setTimeout(() => {
              el.removeAttribute('data-touch-pulse');
              timers.delete(timer);
            }, 520);
            timers.add(timer);
          }
        },
        { rootMargin: '-38% 0px -38% 0px', threshold: 0.2 }
      );

      const scan = () => {
        document.querySelectorAll('.df-interactive[data-spotlight]').forEach((el) => {
          if (!pulsed.has(el)) observer.observe(el);
        });
      };

      scan();
      const mutObserver = new MutationObserver(scan);
      mutObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        mutObserver.disconnect();
        timers.forEach((t) => window.clearTimeout(t));
        timers.clear();
      };
    }
  }, []);
}

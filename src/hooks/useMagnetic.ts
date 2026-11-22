import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX_OFFSET = 6;

export function useMagnetic<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || reducedMotion) {
      if (el) el.style.translate = '0px 0px';
      return;
    }

    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches
    ) {
      return;
    }

    let rafId = 0;
    let active = false;

    const reset = () => {
      if (!active) return;
      active = false;
      el.style.translate = '0px 0px';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        reset();
        return;
      }
      if (rafId) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;

        // Distance from button perimeter rather than just center
        const edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
        const edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
        const edgeDist = Math.hypot(edgeX, edgeY);

        if (edgeDist > MAGNETIC_RADIUS) {
          reset();
          return;
        }

        const strength = 1 - edgeDist / MAGNETIC_RADIUS;
        const maxDist = Math.hypot(rect.width / 2 + MAGNETIC_RADIUS, rect.height / 2 + MAGNETIC_RADIUS);
        const nx = maxDist > 0 ? dx / (rect.width / 2 + MAGNETIC_RADIUS) : 0;
        const ny = maxDist > 0 ? dy / (rect.height / 2 + MAGNETIC_RADIUS) : 0;

        const tx = Math.max(-MAGNETIC_MAX_OFFSET, Math.min(MAGNETIC_MAX_OFFSET, nx * MAGNETIC_MAX_OFFSET * 1.45 * strength));
        const ty = Math.max(-MAGNETIC_MAX_OFFSET, Math.min(MAGNETIC_MAX_OFFSET, ny * MAGNETIC_MAX_OFFSET * 1.45 * strength));

        active = true;
        el.style.translate = `${tx.toFixed(2)}px ${ty.toFixed(2)}px`;
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', reset);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', reset);
      if (rafId) window.cancelAnimationFrame(rafId);
      el.style.translate = '';
    };
  }, [enabled, reducedMotion]);

  return ref;
}

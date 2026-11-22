import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MAX_TILT_DEG = 5;
const MAX_CARD_WIDTH_PX = 460;

export function useTilt<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const resetTilt = () => {
      el.removeAttribute('data-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--gx', '50%');
      el.style.setProperty('--gy', '50%');
    };

    if (
      !enabled ||
      reducedMotion ||
      el.classList.contains('df-slant-block') ||
      typeof window === 'undefined' ||
      !window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches
    ) {
      resetTilt();
      return;
    }

    let rafId = 0;
    let lastClientX = 0;
    let lastClientY = 0;

    const applyTilt = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || rect.width > MAX_CARD_WIDTH_PX) {
        resetTilt();
        return;
      }

      const px = Math.max(0, Math.min(1, (lastClientX - rect.left) / rect.width));
      const py = Math.max(0, Math.min(1, (lastClientY - rect.top) / rect.height));

      const ry = (px - 0.5) * 2 * MAX_TILT_DEG;
      const rx = (0.5 - py) * 2 * MAX_TILT_DEG;

      el.setAttribute('data-tilting', 'true');
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        resetTilt();
        return;
      }
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(applyTilt);
      }
    };

    const onPointerLeave = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      resetTilt();
    };

    el.addEventListener('pointermove', onPointerMove, { passive: true });
    el.addEventListener('pointerleave', onPointerLeave, { passive: true });
    el.addEventListener('pointercancel', onPointerLeave, { passive: true });
    el.addEventListener('blur', onPointerLeave);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointercancel', onPointerLeave);
      el.removeEventListener('blur', onPointerLeave);
      resetTilt();
    };
  }, [enabled, reducedMotion]);

  return ref;
}

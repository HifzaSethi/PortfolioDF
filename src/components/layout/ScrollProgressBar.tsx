import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function ScrollProgressBar() {
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      if (pathname === '/') {
        const hero = document.getElementById('home-hero');
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        const pastHero = window.scrollY > 120 && heroBottom < window.innerHeight * 0.45;
        setVisible(pastHero);
      } else {
        setVisible(window.scrollY > 24);
      }
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pathname, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 right-0 top-0 z-[var(--z-skip)] h-[3px] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left df-gradient-accent"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}

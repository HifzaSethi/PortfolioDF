import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { SITE_CONFIG } from '../../config/site';

interface IntroFallbackProps {
  reducedMotion: boolean;
  isOpening: boolean;
  onFirstInteract: () => void;
  onReady?: () => void;
}

const LAYER_COUNT = 14;

export function IntroFallback({
  reducedMotion,
  isOpening,
  onFirstInteract,
  onReady,
}: IntroFallbackProps) {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  const stateRef = useRef({
    yaw: 0,
    pitch: 0.06,
    velYaw: 0,
    velPitch: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    downTime: 0,
    lastInputTime: 0,
    idleWeight: 1,
    pulseAngle: 0,
    pulseVel: 0,
    pulseActive: false,
    interacted: false,
    reduced: reducedMotion,
  });

  stateRef.current.reduced = reducedMotion;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const applyTransform = (scale = 1) => {
      const s = stateRef.current;
      const degY = (s.yaw + s.pulseAngle) * (180 / Math.PI);
      const degX = s.pitch * (180 / Math.PI);
      stack.style.transform = `scale(${scale}) rotateX(${degX.toFixed(2)}deg) rotateY(${degY.toFixed(2)}deg)`;
    };

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (document.hidden) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
      const s = stateRef.current;

      if (!s.reduced && !s.isDragging) {
        const sinceInput = now - s.lastInputTime;
        if (s.lastInputTime > 0 && sinceInput > 1500) {
          s.idleWeight = Math.min(1, s.idleWeight + dt / 1.2);
          s.pitch += (0.06 - s.pitch) * (1 - Math.exp(-dt / 0.8));
        }

        const damp = Math.pow(0.94, dt * 60);
        s.yaw += s.velYaw * dt;
        s.pitch = Math.max(-0.48, Math.min(0.48, s.pitch + s.velPitch * dt));
        s.velYaw *= damp;
        s.velPitch *= damp;

        if (s.pulseActive) {
          const force = -90 * s.pulseAngle - 14 * s.pulseVel;
          s.pulseVel += force * dt;
          s.pulseAngle += s.pulseVel * dt;
          if (Math.abs(s.pulseAngle) < 0.004 && Math.abs(s.pulseVel) < 0.02) {
            s.pulseAngle = 0;
            s.pulseVel = 0;
            s.pulseActive = false;
          }
        }

        const swayY = Math.sin(elapsed * 0.6) * 0.28 * s.idleWeight;
        const swayX = Math.cos(elapsed * 0.45) * 0.05 * s.idleWeight;
        const degY = (s.yaw + swayY + s.pulseAngle) * (180 / Math.PI);
        const degX = (s.pitch + swayX) * (180 / Math.PI);
        stack.style.transform = `rotateX(${degX.toFixed(2)}deg) rotateY(${degY.toFixed(2)}deg)`;
      } else {
        applyTransform();
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, []);

  const markInteracted = () => {
    const s = stateRef.current;
    s.lastInputTime = performance.now();
    s.idleWeight = 0;
    if (!s.interacted) {
      s.interacted = true;
      onFirstInteract();
    }
  };

  const triggerPulse = (dir: number) => {
    const s = stateRef.current;
    if (s.reduced || s.pulseActive) return;
    markInteracted();
    s.pulseActive = true;
    s.pulseAngle = -dir * Math.PI * 2;
    s.pulseVel = 0;
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      markInteracted();
      s.yaw -= 0.25;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      markInteracted();
      s.yaw += 0.25;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      markInteracted();
      s.pitch = Math.max(-0.48, s.pitch - 0.12);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      markInteracted();
      s.pitch = Math.min(0.48, s.pitch + 0.12);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerPulse(1);
    }
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      role="img"
      aria-label="Interactive 3D Digital Field logo"
      aria-describedby="intro-canvas-hint"
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        const s = stateRef.current;
        e.currentTarget.setPointerCapture(e.pointerId);
        s.isDragging = true;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        s.startX = e.clientX;
        s.startY = e.clientY;
        s.downTime = performance.now();
        s.velYaw = 0;
        s.velPitch = 0;
        markInteracted();
      }}
      onPointerMove={(e) => {
        const s = stateRef.current;
        if (!s.isDragging) return;
        const dx = e.clientX - s.lastX;
        const dy = e.clientY - s.lastY;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        const vy = dx * 0.008;
        const vp = -dy * 0.005;
        s.yaw += vy;
        s.pitch = Math.max(-0.48, Math.min(0.48, s.pitch + vp));
        s.velYaw = vy * 42;
        s.velPitch = vp * 42;
      }}
      onPointerUp={(e) => {
        const s = stateRef.current;
        if (!s.isDragging) return;
        s.isDragging = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        const dist = Math.hypot(e.clientX - s.startX, e.clientY - s.startY);
        if (dist < 6 && performance.now() - s.downTime < 250) {
          const rect = e.currentTarget.getBoundingClientRect();
          const dir = e.clientX >= rect.left + rect.width / 2 ? 1 : -1;
          triggerPulse(dir);
        }
      }}
      onPointerCancel={() => {
        stateRef.current.isDragging = false;
      }}
      className={`relative h-full w-full flex items-start justify-center cursor-grab active:cursor-grabbing select-none focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] transition-all duration-500 ${
        isOpening ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        perspective: '1200px',
        touchAction: 'none',
        paddingTop: 'clamp(3.25rem, 12dvh, 7.5rem)',
      }}
    >
      {/* Radial glow contact halo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] h-52 w-72 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 38% 60%, rgba(179,79,255,0.42), transparent 65%), radial-gradient(circle at 66% 42%, rgba(226,51,137,0.34), transparent 65%)',
        }}
      />

      <div
        ref={stackRef}
        className="relative w-[min(68vw,320px)] sm:w-[min(42vw,390px)] aspect-[419/223]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {Array.from({ length: LAYER_COUNT }).map((_, i) => {
          const z = (i - (LAYER_COUNT - 1)) * 2.8;
          const isFront = i === LAYER_COUNT - 1;
          const t = i / (LAYER_COUNT - 1);
          return (
            <img
              key={i}
              src={SITE_CONFIG.assets.logos.iconDark}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
              style={{
                transform: `translateZ(${z.toFixed(1)}px)`,
                opacity: isFront ? 1 : 0.1 + t * 0.28,
                filter: isFront
                  ? 'drop-shadow(0 0 18px rgba(179,79,255,0.38))'
                  : 'brightness(0.42) drop-shadow(0 0 8px rgba(179,79,255,0.22))',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

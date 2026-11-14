import { useState } from 'react';
import { SITE_CONFIG } from '../../config/site';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * 3D DF. ICON SLOT
 * Drop official 3D DF. icon render (.png / .webm) into SITE_CONFIG.assets.hero3dSrc.
 * Fallback builds an abstract glossy 3D-feeling composition of slanted glass planes
 * along the single --slant (-12deg) axis. Never fakes the custom 1/D/F logo mark.
 */

export function Hero3DSlot() {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const configuredSrc = SITE_CONFIG.assets.hero3dSrc;

  if (configuredSrc) {
    return (
      <div className="relative flex items-center justify-center aspect-square w-full max-w-[460px] mx-auto">
        <img
          src={configuredSrc}
          alt="Digital Field 3D geometric composition"
          className="h-full w-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: ny * -8, y: nx * 10 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      className="relative mx-auto w-full max-w-[460px] aspect-square flex items-center justify-center select-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      data-placeholder-asset="/src/assets/brand/df-icon-3d.png"
      aria-label="Abstract 3D field geometry composition placeholder"
    >
      {/* Ambient radial glow anchored inside composition */}
      <div
        aria-hidden="true"
        className="absolute inset-8 rounded-full opacity-45 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 35% 65%, var(--violet), transparent 60%), radial-gradient(circle at 75% 35%, var(--magenta), transparent 58%)',
        }}
      />

      {/* Layered 3D CSS perspective planes */}
      <div
        className="relative w-[82%] h-[82%] transition-transform duration-300 ease-out"
        style={{
          perspective: '900px',
          transform: reducedMotion
            ? undefined
            : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Back architectural slab */}
        <div
          aria-hidden="true"
          className="absolute inset-6 df-slant-block border border-[var(--border-dark-strong)] bg-[color-mix(in_srgb,var(--violet)_14%,var(--near-black))]"
          style={{
            transform: 'skewX(var(--slant)) translate3d(-14px, -10px, -40px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        />

        {/* Mid glossy gradient plane */}
        <div
          aria-hidden="true"
          className="absolute inset-10 df-slant-block border border-[var(--border-dark-strong)] backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--violet) 32%, transparent), color-mix(in srgb, var(--magenta) 26%, transparent) 60%, color-mix(in srgb, var(--near-black) 70%, transparent))',
            transform: 'skewX(var(--slant)) translate3d(8px, 6px, 0px)',
            boxShadow: '0 24px 60px rgba(1, 1, 2, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.28)',
          }}
        />

        {/* Foreground translucent glass prism */}
        <div
          aria-hidden="true"
          className="absolute inset-16 df-slant-block df-glass-dark flex flex-col justify-between p-6"
          style={{
            transform: 'skewX(var(--slant)) translate3d(20px, 18px, 36px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
        >
          <div className="df-unslant flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--off-white)]/70">
              3D SLOT PLACEHOLDER
            </span>
            <span className="h-2.5 w-2.5 bg-[var(--electric-blue)]" />
          </div>

          {/* Signal vector lines */}
          <svg
            className="df-unslant w-full h-24 opacity-85"
            viewBox="0 0 200 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="72" x2="100" y2="45" stroke="#B34FFF" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="34" y1="18" x2="100" y2="45" stroke="#F4F1EA" strokeWidth="1.2" strokeOpacity="0.45" />
            <line x1="168" y1="22" x2="100" y2="45" stroke="#E23389" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="158" y1="74" x2="100" y2="45" stroke="#0057FF" strokeWidth="1.5" strokeOpacity="0.9" />
            <rect x="94" y="39" width="12" height="12" fill="#E23389" />
          </svg>

          <div className="df-unslant flex items-end justify-between border-t border-[var(--border-dark)] pt-3">
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--off-white)]">
              OBJECTIVE ANCHOR
            </span>
            <span className="h-3.5 w-3.5 bg-[var(--magenta)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

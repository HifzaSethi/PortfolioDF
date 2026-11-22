import { lazy, Suspense, useCallback, useId, useState } from 'react';
import { ECOSYSTEM_NODES } from '../../data/ecosystem';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { scrollToSection } from '../../lib/scroll';
import { useIntro } from '../intro/IntroContext';
import { isWebGLSupported } from '../intro/introStorage';
import { Logo } from './Logo';

const HeroEcosystemCanvas = lazy(() => import('./HeroEcosystemCanvas'));

function Hero3DBrandLoader() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 select-none"
      role="status"
      aria-label="Loading Digital Field 3D ecosystem"
    >
      <div className="animate-pulse">
        <Logo variant="icon" size="lg" />
      </div>
      <div className="h-0.5 w-24 overflow-hidden bg-[var(--border-subtle)]">
        <div className="h-full w-1/2 df-gradient-accent animate-pulse" />
      </div>
    </div>
  );
}

interface EcosystemFallbackSvgProps {
  theme: 'day' | 'night';
  reducedMotion: boolean;
  onSelectNode: (id: string) => void;
}

const FALLBACK_COORDS = ECOSYSTEM_NODES.map((node, i) => {
  const frac = i / (ECOSYSTEM_NODES.length - 1);
  const angle = -Math.PI * 0.65 + frac * Math.PI * 2.55;
  const radius = 165 - frac * 68;
  const cx = 240 + Math.cos(angle) * radius;
  const cy = 240 + Math.sin(angle) * radius * 0.88;
  const color =
    i < 3
      ? 'var(--violet)'
      : i < 7
        ? 'var(--electric-blue)'
        : 'var(--magenta)';
  return { node, cx, cy, color };
});

function EcosystemFallbackSvg({
  theme,
  reducedMotion,
  onSelectNode,
}: EcosystemFallbackSvgProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const gradId = useId();
  const isNight = theme === 'night';
  const activeNode = activeIdx !== null ? ECOSYSTEM_NODES[activeIdx] : null;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center select-none"
      role="group"
      aria-label="Digital Field Ecosystem Constellation map"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full blur-3xl"
        style={{
          opacity: isNight ? 0.32 : 0.16,
          background:
            'radial-gradient(circle at 32% 68%, var(--violet), transparent 62%), radial-gradient(circle at 74% 38%, var(--magenta), transparent 60%)',
        }}
      />

      <svg
        viewBox="0 0 480 480"
        className="relative z-10 h-full w-full overflow-visible"
        role="img"
        aria-label="Ten connected Digital Ecosystem nodes spiralling around the central Digital Field dot"
      >
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--magenta)" stopOpacity="0.95" />
            <stop offset="65%" stopColor="var(--magenta)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--magenta)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient core glow */}
        <circle cx="240" cy="240" r="54" fill={`url(#${gradId})`} />

        {/* Links from each node to core */}
        {FALLBACK_COORDS.map((pt, idx) => {
          const isLit = activeIdx === null ? false : activeIdx === idx;
          const isDimmed = activeIdx !== null && activeIdx !== idx;
          return (
            <line
              key={`core-${pt.node.id}`}
              x1={pt.cx}
              y1={pt.cy}
              x2="240"
              y2="240"
              stroke={isNight ? 'var(--off-white)' : 'var(--near-black)'}
              strokeOpacity={isLit ? 0.6 : isDimmed ? 0.08 : isNight ? 0.16 : 0.18}
              strokeWidth={isLit ? 1.6 : 1}
            />
          );
        })}

        {/* Arced chain links connecting consecutive nodes + feedback to core */}
        {FALLBACK_COORDS.map((pt, idx) => {
          const next = idx < FALLBACK_COORDS.length - 1 ? FALLBACK_COORDS[idx + 1] : null;
          const x2 = next ? next.cx : 240;
          const y2 = next ? next.cy : 240;
          const mx = (pt.cx + x2) * 0.5 + (240 - (pt.cx + x2) * 0.5) * -0.18;
          const my = (pt.cy + y2) * 0.5 + (240 - (pt.cy + y2) * 0.5) * -0.18;
          const d = `M ${pt.cx} ${pt.cy} Q ${mx} ${my} ${x2} ${y2}`;
          const isConnected = activeIdx !== null && (activeIdx === idx || activeIdx === idx + 1);
          const isDimmed = activeIdx !== null && !isConnected;
          return (
            <g key={`arc-${pt.node.id}`}>
              <path
                d={d}
                fill="none"
                stroke={
                  idx === FALLBACK_COORDS.length - 1
                    ? 'var(--magenta)'
                    : isNight
                      ? 'var(--violet)'
                      : 'var(--near-black)'
                }
                strokeOpacity={isConnected ? 0.85 : isDimmed ? 0.14 : isNight ? 0.34 : 0.32}
                strokeWidth={isConnected ? 2 : 1.25}
              />
              {!reducedMotion && (
                <circle r="3" fill={pt.color} opacity={isDimmed ? 0.25 : 0.92}>
                  <animateMotion
                    dur={`${3.8 + (idx % 4) * 0.6}s`}
                    begin={`${idx * 0.35}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Central glossy magenta DF. slanted dot */}
        <g transform="translate(240 240) skewX(-12)">
          <rect
            x="-13"
            y="-13"
            width="26"
            height="26"
            rx="3"
            fill="var(--magenta)"
            stroke="var(--off-white)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        </g>

        {/* Interactive 10 slanted shard nodes */}
        {FALLBACK_COORDS.map((pt, idx) => {
          const isTarget = activeIdx === idx;
          const isDimmed = activeIdx !== null && !isTarget;
          return (
            <g
              key={pt.node.id}
              transform={`translate(${pt.cx} ${pt.cy}) scale(${isTarget ? 1.28 : isDimmed ? 0.92 : 1})`}
              style={{
                cursor: 'pointer',
                opacity: isDimmed ? 0.55 : 1,
                transition: reducedMotion ? 'none' : 'transform 180ms ease, opacity 180ms ease',
              }}
              tabIndex={0}
              role="button"
              aria-label={`${String(pt.node.order).padStart(2, '0')} ${pt.node.title} — ${pt.node.shortTitle}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx((cur) => (cur === idx ? null : cur))}
              onFocus={() => setActiveIdx(idx)}
              onBlur={() => setActiveIdx((cur) => (cur === idx ? null : cur))}
              onClick={() => onSelectNode(pt.node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectNode(pt.node.id);
                }
              }}
            >
              <g transform="skewX(-12)">
                <rect
                  x="-11"
                  y="-14"
                  width="22"
                  height="28"
                  fill={pt.color}
                  fillOpacity={isTarget ? 1 : 0.88}
                  stroke={isTarget ? 'var(--off-white)' : pt.color}
                  strokeWidth={isTarget ? 2 : 1}
                />
              </g>
              <text
                y="4"
                textAnchor="middle"
                fill="var(--off-white)"
                fontSize="9"
                fontWeight="800"
                className="pointer-events-none tabular-nums"
              >
                {String(pt.node.order).padStart(2, '0')}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Active Node Label */}
      {activeNode && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 px-3 py-1.5 df-slant-block border border-[var(--border-strong)] bg-[var(--bg-page)]/92 text-[var(--text-primary)] shadow-lg backdrop-blur-md"
        >
          <div className="df-unslant whitespace-nowrap text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
              {String(activeNode.order).padStart(2, '0')} · {activeNode.shortTitle}
            </p>
            <p className="text-xs font-extrabold">{activeNode.title}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export function Hero3DSlot() {
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const { isActive, introWebGLDisposed } = useIntro();
  const [webGLOk, setWebGLOk] = useState<boolean>(() => isWebGLSupported());
  const [canvasReady, setCanvasReady] = useState(false);

  const canMountWebGL = !isActive || introWebGLDisposed;

  const handleReady = useCallback(() => {
    setCanvasReady(true);
  }, []);

  const handleWebGLError = useCallback(() => {
    setWebGLOk(false);
  }, []);

  const handleSelectNode = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('df:select-ecosystem-node', { detail: { id } }));
    scrollToSection('ecosystem-framework');
  }, []);

  const ecosystemList = (
    <ol className="sr-only">
      {ECOSYSTEM_NODES.map((node) => (
        <li key={node.id}>
          {node.order}. {node.title} — {node.shortTitle}
        </li>
      ))}
    </ol>
  );

  if (!webGLOk) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[540px] flex items-center justify-center">
        <EcosystemFallbackSvg
          theme={theme}
          reducedMotion={reducedMotion}
          onSelectNode={handleSelectNode}
        />
        {ecosystemList}
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[540px]"
      aria-label="Interactive 3D Digital Ecosystem constellation"
    >
      {(!canvasReady || !canMountWebGL) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Hero3DBrandLoader />
        </div>
      )}

      {canMountWebGL && (
        <Suspense fallback={<Hero3DBrandLoader />}>
          <div
            className={`h-full w-full transition-opacity duration-300 ${
              canvasReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <HeroEcosystemCanvas
              theme={theme}
              reducedMotion={reducedMotion}
              onReady={handleReady}
              onWebGLError={handleWebGLError}
              onSelectNode={handleSelectNode}
            />
          </div>
        </Suspense>
      )}
      {ecosystemList}
    </div>
  );
}

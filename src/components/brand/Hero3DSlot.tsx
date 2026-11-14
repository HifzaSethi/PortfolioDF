import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { SITE_CONFIG } from '../../config/site';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { Logo } from './Logo';

const Hero3DCanvas = lazy(() => import('./Hero3DCanvas'));

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

function Hero3DBrandLoader() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 select-none"
      role="status"
      aria-label="Loading Digital Field 3D mark"
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

function Hero3DFallback() {
  const { theme } = useTheme();
  const iconSrc =
    theme === 'night' ? SITE_CONFIG.assets.logos.iconDark : SITE_CONFIG.assets.logos.iconLight;

  return (
    <div className="relative flex h-full w-full items-center justify-center select-none p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full opacity-35 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 32% 68%, var(--violet), transparent 62%), radial-gradient(circle at 74% 38%, var(--magenta), transparent 60%)',
        }}
      />
      <img
        src={iconSrc}
        alt="Digital Field. DF. monogram mark"
        className="relative z-10 h-40 sm:h-48 w-auto object-contain"
        draggable={false}
      />
    </div>
  );
}

export function Hero3DSlot() {
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const [webGLOk, setWebGLOk] = useState<boolean>(() => checkWebGLSupport());
  const [canvasReady, setCanvasReady] = useState(false);

  const handleReady = useCallback(() => {
    setCanvasReady(true);
  }, []);

  const handleWebGLError = useCallback(() => {
    setWebGLOk(false);
  }, []);

  useEffect(() => {
    setWebGLOk(checkWebGLSupport());
  }, []);

  if (reducedMotion || !webGLOk) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[520px] flex items-center justify-center">
        <Hero3DFallback />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[540px]"
      aria-label="Interactive 3D extruded Digital Field monogram sculpture"
    >
      {!canvasReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Hero3DBrandLoader />
        </div>
      )}

      <Suspense fallback={<Hero3DBrandLoader />}>
        <div
          className={`h-full w-full transition-opacity duration-300 ${
            canvasReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Hero3DCanvas
            theme={theme}
            onReady={handleReady}
            onWebGLError={handleWebGLError}
          />
        </div>
      </Suspense>
    </div>
  );
}

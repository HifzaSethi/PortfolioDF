import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { isInitialRootUrl, isIntroSeen } from './introStorage';

export type IntroPhase = 'loading' | 'ready' | 'opening' | 'done';

interface IntroContextValue {
  phase: IntroPhase;
  isActive: boolean;
  introWebGLDisposed: boolean;
  contentRevealAllowed: boolean;
  setPhase: (phase: IntroPhase) => void;
  setIntroWebGLDisposed: (disposed: boolean) => void;
  setContentRevealAllowed: (allowed: boolean) => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

function computeShouldStartActive(): boolean {
  if (typeof window === 'undefined') return false;
  return isInitialRootUrl() && !isIntroSeen();
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    computeShouldStartActive() ? 'loading' : 'done'
  );
  const [introWebGLDisposed, setIntroWebGLDisposed] = useState<boolean>(
    () => !computeShouldStartActive()
  );
  const [contentRevealAllowed, setContentRevealAllowed] = useState<boolean>(
    () => !computeShouldStartActive()
  );

  const handleSetPhase = useCallback((next: IntroPhase) => {
    setPhase(next);
    if (next === 'done') {
      setIntroWebGLDisposed(true);
      setContentRevealAllowed(true);
    }
  }, []);

  const value = useMemo<IntroContextValue>(() => {
    const isActive = phase !== 'done';
    return {
      phase,
      isActive,
      introWebGLDisposed,
      contentRevealAllowed,
      setPhase: handleSetPhase,
      setIntroWebGLDisposed,
      setContentRevealAllowed,
    };
  }, [phase, introWebGLDisposed, contentRevealAllowed, handleSetPhase]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroContextValue {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return ctx;
}

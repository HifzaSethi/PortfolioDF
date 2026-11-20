import { animate, type AnimationPlaybackControls } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { BrandPattern } from '../brand/BrandPattern';
import type { IntroPhase } from './IntroContext';

interface CurtainRevealProps {
  phase: IntroPhase;
  reducedMotion: boolean;
  onCurtainComplete: () => void;
  children: ReactNode;
}

const CURTAIN_EASE: [number, number, number, number] = [0.77, 0, 0.18, 1];

export function CurtainReveal({
  phase,
  reducedMotion,
  onCurtainComplete,
  children,
}: CurtainRevealProps) {
  const veilRef = useRef<HTMLDivElement | null>(null);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const leftPleatRef = useRef<HTMLDivElement | null>(null);
  const rightPleatRef = useRef<HTMLDivElement | null>(null);
  const leftRimRef = useRef<HTMLDivElement | null>(null);
  const rightRimRef = useRef<HTMLDivElement | null>(null);
  const atmosphereRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phase !== 'opening' || reducedMotion) return;

    let cancelled = false;
    let safetyTimer = 0;
    const controls: AnimationPlaybackControls[] = [];
    const shell = document.getElementById('app-shell');

    const cleanupShellTransform = () => {
      if (shell) {
        shell.style.transform = '';
        shell.style.transformOrigin = '';
        shell.style.willChange = '';
      }
    };

    if (shell) {
      shell.style.transformOrigin = '50% 42%';
      shell.style.transform = 'scale(1.035)';
    }

    // Atmosphere glow fades out cleanly ahead of parting
    if (atmosphereRef.current) {
      controls.push(
        animate(
          atmosphereRef.current,
          { opacity: [1, 0] },
          { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
        )
      );
    }

    // Veil eases from 0.55 to 0 as curtains open onto real page
    if (veilRef.current) {
      controls.push(
        animate(
          veilRef.current,
          { opacity: [0.55, 0] },
          { duration: 1.7, delay: 0.45, ease: CURTAIN_EASE }
        )
      );
    }

    // Left curtain parting (500ms -> 2200ms)
    if (leftPanelRef.current) {
      controls.push(
        animate(
          leftPanelRef.current,
          {
            transform: [
              'translate3d(0%, 0, 0) rotateY(0deg)',
              'translate3d(-14%, 0, 40px) rotateY(-6deg)',
              'translate3d(-106%, 0, 80px) rotateY(-10deg)',
            ],
          },
          {
            duration: 1.7,
            delay: 0.5,
            times: [0, 0.35, 1],
            ease: CURTAIN_EASE,
          }
        )
      );
    }

    // Right curtain parting (55ms offset for natural theatrical feel)
    if (rightPanelRef.current) {
      const rightAnim = animate(
        rightPanelRef.current,
        {
          transform: [
            'translate3d(0%, 0, 0) rotateY(0deg)',
            'translate3d(14%, 0, 40px) rotateY(6deg)',
            'translate3d(106%, 0, 80px) rotateY(10deg)',
          ],
        },
        {
          duration: 1.7,
          delay: 0.55,
          times: [0, 0.35, 1],
          ease: CURTAIN_EASE,
        }
      );
      controls.push(rightAnim);

      let completed = false;
      const finishOnce = () => {
        if (cancelled || completed) return;
        completed = true;
        controls.forEach((ctrl) => ctrl.stop());
        cleanupShellTransform();
        onCurtainComplete();
      };

      safetyTimer = window.setTimeout(finishOnce, 2350);

      void rightAnim.finished.then(() => {
        window.clearTimeout(safetyTimer);
        finishOnce();
      });
    }

    // Subtle pleat fabric gathering shift opposite to opening travel (GPU transform only)
    if (leftPleatRef.current) {
      controls.push(
        animate(
          leftPleatRef.current,
          { transform: ['translate3d(0px, 0, 0)', 'translate3d(42px, 0, 0)'] },
          { duration: 1.7, delay: 0.5, ease: CURTAIN_EASE }
        )
      );
    }
    if (rightPleatRef.current) {
      controls.push(
        animate(
          rightPleatRef.current,
          { transform: ['translate3d(0px, 0, 0)', 'translate3d(-42px, 0, 0)'] },
          { duration: 1.7, delay: 0.55, ease: CURTAIN_EASE }
        )
      );
    }

    // Leading-edge rim light swells then fades out
    if (leftRimRef.current) {
      controls.push(
        animate(
          leftRimRef.current,
          { opacity: [0.55, 0.95, 0] },
          { duration: 1.5, delay: 0.45, times: [0, 0.3, 1] }
        )
      );
    }
    if (rightRimRef.current) {
      controls.push(
        animate(
          rightRimRef.current,
          { opacity: [0.55, 0.95, 0] },
          { duration: 1.5, delay: 0.5, times: [0, 0.3, 1] }
        )
      );
    }

    // Real homepage underneath gently settles 1.035 -> 1
    if (shell) {
      controls.push(
        animate(
          shell,
          { transform: ['scale(1.035)', 'scale(1)'] },
          { duration: 1.7, delay: 0.5, ease: CURTAIN_EASE }
        )
      );
    }

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
      controls.forEach((ctrl) => ctrl.stop());
      cleanupShellTransform();
    };
  }, [phase, reducedMotion, onCurtainComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Bottom veil over real homepage */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#010102]"
        style={{ opacity: 0.55 }}
      />

      {/* 3D perspective stage holding left and right curtain panels */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          perspective: '1800px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        {/* Left Curtain */}
        <div
          ref={leftPanelRef}
          className="absolute top-0 bottom-0 left-0 w-[50.6%] overflow-hidden"
          style={{
            transformOrigin: '0% 50%',
            backgroundImage: 'linear-gradient(90deg, #07050c, #0d0716 52%, #07050c)',
          }}
        >
          {/* Pleat texture (oversized horizontally for GPU translate3d shift) */}
          <div
            ref={leftPleatRef}
            className="absolute inset-y-0 -left-14 -right-14"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 22px, rgba(0,0,0,0.35) 22px 30px, transparent 30px 56px)',
            }}
          />
          {/* Subtle violet outer edge + top valance / bottom hem vignette */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 75% 60% at 8% 82%, rgba(179,79,255,0.16), transparent 70%), linear-gradient(180deg, rgba(1,1,2,0.7) 0%, transparent 18%, transparent 82%, rgba(1,1,2,0.8) 100%)',
            }}
          />
          {/* Leading inner edge rim light + trailing cast shadow */}
          <div
            ref={leftRimRef}
            className="absolute top-0 bottom-0 right-0 w-[3px]"
            style={{
              opacity: 0.55,
              backgroundImage: 'linear-gradient(180deg, var(--violet), var(--magenta))',
            }}
          />
        </div>

        {/* Right Curtain */}
        <div
          ref={rightPanelRef}
          className="absolute top-0 bottom-0 right-0 w-[50.6%] overflow-hidden"
          style={{
            transformOrigin: '100% 50%',
            backgroundImage: 'linear-gradient(90deg, #07050c, #0d0716 48%, #07050c)',
          }}
        >
          <div
            ref={rightPleatRef}
            className="absolute inset-y-0 -left-14 -right-14"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 22px, rgba(0,0,0,0.35) 22px 30px, transparent 30px 56px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 75% 60% at 92% 82%, rgba(226,51,137,0.14), transparent 70%), linear-gradient(180deg, rgba(1,1,2,0.7) 0%, transparent 18%, transparent 82%, rgba(1,1,2,0.8) 100%)',
            }}
          />
          <div
            ref={rightRimRef}
            className="absolute top-0 bottom-0 left-0 w-[3px]"
            style={{
              opacity: 0.55,
              backgroundImage: 'linear-gradient(180deg, var(--magenta), var(--violet))',
            }}
          />
        </div>

        {/* Ambient stage pools + subtle DF pattern across closed stage */}
        <div ref={atmosphereRef} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 58% 52% at 18% 88%, rgba(179,79,255,0.16), transparent 68%), radial-gradient(ellipse 56% 52% at 84% 86%, rgba(226,51,137,0.14), transparent 68%), radial-gradient(ellipse 42% 38% at 86% 12%, rgba(0,87,255,0.08), transparent 66%)',
            }}
          />
          <BrandPattern tone="dark" opacity={0.055} />
        </div>
      </div>

      {/* Interactive Intro UI + 3D Scene above curtains */}
      <div className="pointer-events-auto relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

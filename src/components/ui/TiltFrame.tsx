import type { ReactNode } from 'react';
import { useTilt } from '../../hooks/useTilt';

interface TiltFrameProps {
  children: ReactNode;
  className?: string;
  sceneClassName?: string;
  withSheen?: boolean;
  enabled?: boolean;
}

export function TiltFrame({
  children,
  className = '',
  sceneClassName = '',
  withSheen = false,
  enabled = true,
}: TiltFrameProps) {
  const tiltRef = useTilt<HTMLDivElement>(enabled);

  return (
    <div className={`df-tilt-scene ${sceneClassName}`}>
      <div
        ref={tiltRef}
        className={`df-tilt df-tilt-border ${className}`}
      >
        <div className="df-tilt-clip" aria-hidden="true">
          <div className="df-tilt-glare" />
          {withSheen && <div className="df-ambient-sheen" />}
        </div>
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteTransitionProps {
  children: ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="df-route-enter">
      {children}
    </div>
  );
}

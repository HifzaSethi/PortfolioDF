import type { ReactNode } from 'react';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { ScrollProgressBar } from '../components/layout/ScrollProgressBar';
import { useInteractionPolish } from '../hooks/useSpotlight';
import { RouteTransition } from './RouteTransition';
import { ScrollManager } from './ScrollManager';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useInteractionPolish();

  return (
    <div className="flex min-h-screen flex-col df-surface-page text-[var(--text-primary)]">
      <ScrollProgressBar />
      <ScrollManager />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <RouteTransition>{children}</RouteTransition>
      </main>
      <Footer />
    </div>
  );
}

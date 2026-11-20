import type { ReactNode } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { BrandPattern } from '../brand/BrandPattern';
import { useInView } from '../../hooks/useInView';

export type SectionSurface =
  | 'off-white'
  | 'tint'
  | 'dark-mesh'
  | 'hospitality-mesh'
  | 'near-black'
  | 'hero-adaptive';

interface SectionProps {
  id?: string;
  surface?: SectionSurface;
  compact?: boolean;
  withPattern?: boolean;
  reveal?: boolean;
  className?: string;
  children: ReactNode;
}

const SURFACE_CLASSES: Record<Exclude<SectionSurface, 'hero-adaptive'>, string> = {
  'off-white': 'df-surface-page text-[var(--text-primary)]',
  tint: 'bg-[var(--bg-tint)] df-night-mesh-subtle text-[var(--text-primary)]',
  'dark-mesh': 'df-mesh-dark df-mesh-animate text-[var(--off-white)]',
  'hospitality-mesh': 'df-mesh-hospitality df-mesh-animate text-[var(--off-white)]',
  'near-black': 'bg-[var(--near-black)] text-[var(--off-white)]',
};

export function Section({
  id,
  surface = 'off-white',
  compact = false,
  withPattern = false,
  reveal = false,
  className = '',
  children,
}: SectionProps) {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.08, once: true });
  const { theme } = useTheme();

  const surfaceClass =
    surface === 'hero-adaptive'
      ? theme === 'night'
        ? 'df-mesh-dark df-mesh-animate text-[var(--off-white)]'
        : 'df-mesh-day text-[var(--text-primary)]'
      : SURFACE_CLASSES[surface];

  const isDarkSurface =
    surface === 'dark-mesh' ||
    surface === 'hospitality-mesh' ||
    surface === 'near-black' ||
    (surface === 'hero-adaptive' && theme === 'night') ||
    theme === 'night';

  return (
    <section
      id={id}
      ref={reveal ? ref : undefined}
      className={`relative overflow-x-clip ${surfaceClass} ${
        compact ? 'py-[var(--section-py-compact)]' : 'py-[var(--section-py)]'
      } ${reveal ? `df-reveal ${isInView ? 'is-visible' : ''}` : ''} ${className}`}
    >
      {withPattern && <BrandPattern tone={isDarkSurface ? 'dark' : 'light'} />}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}

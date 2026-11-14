import type { ReactNode } from 'react';
import { BrandPattern } from '../brand/BrandPattern';
import { useInView } from '../../hooks/useInView';

export type SectionSurface = 'off-white' | 'tint' | 'dark-mesh' | 'hospitality-mesh' | 'near-black';

interface SectionProps {
  id?: string;
  surface?: SectionSurface;
  compact?: boolean;
  withPattern?: boolean;
  reveal?: boolean;
  className?: string;
  children: ReactNode;
}

const SURFACE_CLASSES: Record<SectionSurface, string> = {
  'off-white': 'bg-[var(--off-white)] text-[var(--near-black)]',
  tint: 'bg-[var(--paper-tint)] text-[var(--near-black)]',
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
  const isDark = surface === 'dark-mesh' || surface === 'hospitality-mesh' || surface === 'near-black';

  return (
    <section
      id={id}
      ref={reveal ? ref : undefined}
      className={`relative overflow-hidden ${SURFACE_CLASSES[surface]} ${
        compact ? 'py-[var(--section-py-compact)]' : 'py-[var(--section-py)]'
      } ${reveal ? `df-reveal ${isInView ? 'is-visible' : ''}` : ''} ${className}`}
    >
      {withPattern && <BrandPattern tone={isDark ? 'dark' : 'light'} opacity={isDark ? 0.07 : 0.04} />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

import type { ReactNode } from 'react';

interface SectionHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display' | 'h1' | 'h2' | 'subheading';
  slanted?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
  children: ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<SectionHeadingProps['size']>, string> = {
  display: 'text-[length:var(--text-display)] font-extrabold leading-[0.98] tracking-[-0.03em]',
  h1: 'text-[length:var(--text-h1-sub)] font-extrabold leading-[1.04] tracking-[-0.025em]',
  h2: 'text-[length:var(--text-h2)] font-bold leading-[1.12] tracking-[-0.02em]',
  subheading: 'text-[length:var(--text-subheading)] font-semibold uppercase tracking-[0.06em] leading-[1.2]',
};

export function SectionHeading({
  as: Tag = 'h2',
  size = 'h2',
  slanted = false,
  tone = 'light',
  className = '',
  children,
}: SectionHeadingProps) {
  const colorClass = tone === 'dark' ? 'text-[var(--off-white)]' : 'text-[var(--near-black)]';

  return (
    <Tag
      className={`${SIZE_CLASSES[size]} ${colorClass} ${
        slanted ? 'italic' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

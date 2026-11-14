import { useState } from 'react';
import { BrandPattern } from './BrandPattern';

export interface ImageSlotProps {
  src?: string | null;
  srcSet?: string;
  sizes?: string;
  alt: string;
  shotDescription: string;
  aspectRatio?: '16/9' | '4/3' | '3/4' | '1/1' | '21/9';
  tone?: 'dark' | 'light';
  className?: string;
}

const ASPECT_CLASS_MAP: Record<NonNullable<ImageSlotProps['aspectRatio']>, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
};

export function ImageSlot({
  src,
  srcSet,
  sizes,
  alt,
  shotDescription,
  aspectRatio = '4/3',
  tone = 'light',
  className = '',
}: ImageSlotProps) {
  const [hasError, setHasError] = useState(false);
  const aspectClass = ASPECT_CLASS_MAP[aspectRatio];
  const isDark = tone === 'dark';

  if (src && !hasError) {
    return (
      <div className={`relative overflow-hidden bg-[var(--near-black)] ${aspectClass} ${className}`}>
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <figure
      className={`relative overflow-hidden border ${aspectClass} ${
        isDark
          ? 'df-mesh-dark border-[var(--border-dark)] text-[var(--off-white)]'
          : 'border-[var(--border-light-strong)] bg-[var(--paper-tint)] text-[var(--near-black)]'
      } ${className}`}
      aria-label={alt}
    >
      <BrandPattern tone={isDark ? 'dark' : 'light'} opacity={isDark ? 0.08 : 0.06} />
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-[10px] font-semibold tracking-[0.16em] uppercase ${
              isDark ? 'text-[var(--off-white)]/75' : 'text-[var(--ink-muted)]'
            }`}
          >
            PHOTO PLACEHOLDER
          </span>
          <span
            aria-hidden="true"
            className="h-2 w-2 bg-[var(--magenta)] shrink-0"
          />
        </div>

        <figcaption
          className={`max-w-[34ch] text-sm leading-relaxed ${
            isDark ? 'text-[var(--off-white)]/90' : 'text-[var(--near-black)]/85'
          }`}
        >
          PHOTO PLACEHOLDER: {shotDescription}
        </figcaption>
      </div>
    </figure>
  );
}

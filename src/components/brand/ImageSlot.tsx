import { useState } from 'react';
import { BrandPattern } from './BrandPattern';

export interface ImageSlotProps {
  src?: string | null;
  srcSet?: string;
  sizes?: string;
  alt: string;
  shotDescription: string;
  aspectRatio?: '16/9' | '4/3' | '3/4' | '1/1' | '21/9';
  tone?: 'dark' | 'light' | 'auto';
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
  tone = 'auto',
  className = '',
}: ImageSlotProps) {
  const [hasError, setHasError] = useState(false);
  const aspectClass = ASPECT_CLASS_MAP[aspectRatio];
  const isDarkMesh = tone === 'dark';

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
      className={`relative overflow-hidden df-frame-l border border-[var(--border-strong)] ${aspectClass} ${
        isDarkMesh
          ? 'df-mesh-dark text-[var(--off-white)]'
          : 'df-card-surface text-[var(--text-primary)]'
      } ${className}`}
      aria-label={alt}
    >
      <BrandPattern tone={isDarkMesh ? 'dark' : 'auto'} />
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase df-slant-block ${
              isDarkMesh
                ? 'bg-[var(--violet)] text-[var(--near-black)]'
                : 'bg-[var(--bg-tint)] text-[var(--text-muted)] border border-[var(--border-strong)]'
            }`}
          >
            <span className="df-unslant block">EDITORIAL SLOT</span>
          </span>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 bg-[var(--magenta)] shrink-0 df-slant-block"
          />
        </div>

        <figcaption
          className={`max-w-[36ch] text-sm font-medium leading-relaxed ${
            isDarkMesh ? 'text-[var(--off-white)]/90' : 'text-[var(--text-muted)]'
          }`}
        >
          {shotDescription}
        </figcaption>
      </div>
    </figure>
  );
}

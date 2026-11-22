import { useState, type ReactNode } from 'react';
import { BrandPattern } from './BrandPattern';

export interface ImageSlotProps {
  src?: string | null;
  srcSet?: string;
  sizes?: string;
  alt: string;
  shotDescription: string;
  aspectRatio?: '16/9' | '4/3' | '3/4' | '4/5' | '1/1' | '21/9' | 'cinema';
  tone?: 'dark' | 'light' | 'auto';
  badgeLabel?: string;
  gradientStyle?: string;
  artwork?: ReactNode;
  hideCaption?: boolean;
  className?: string;
}

const ASPECT_CLASS_MAP: Record<NonNullable<ImageSlotProps['aspectRatio']>, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
  cinema: 'aspect-video lg:aspect-[21/9]',
};

export function ImageSlot({
  src,
  srcSet,
  sizes,
  alt,
  shotDescription,
  aspectRatio = '4/3',
  tone = 'auto',
  badgeLabel = 'EDITORIAL SLOT',
  gradientStyle,
  artwork,
  hideCaption = false,
  className = '',
}: ImageSlotProps) {
  const [hasError, setHasError] = useState(false);
  const aspectClass = ASPECT_CLASS_MAP[aspectRatio];
  const isDarkMesh = tone === 'dark' || Boolean(gradientStyle);

  if (src && !hasError) {
    return (
      <div className={`relative df-media bg-[var(--near-black)] ${aspectClass} ${className}`}>
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
      className={`relative df-media df-frame-l border border-[var(--border-strong)] ${aspectClass} ${
        gradientStyle
          ? 'bg-[var(--near-black)] text-[var(--off-white)]'
          : isDarkMesh
            ? 'df-mesh-dark text-[var(--off-white)]'
            : 'df-card-surface text-[var(--text-primary)]'
      } ${className}`}
      style={gradientStyle ? { backgroundImage: gradientStyle } : undefined}
      aria-label={alt}
    >
      <BrandPattern tone={isDarkMesh ? 'dark' : 'auto'} className="df-media-pattern" />

      {artwork && (
        <div className="df-media-target pointer-events-none absolute inset-0 z-[5]">
          {artwork}
        </div>
      )}

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase df-slant-block ${
              isDarkMesh
                ? 'bg-[var(--violet)] text-[var(--near-black)]'
                : 'bg-[var(--bg-tint)] text-[var(--text-muted)] border border-[var(--border-strong)]'
            }`}
          >
            <span className="df-unslant block">{badgeLabel}</span>
          </span>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 bg-[var(--magenta)] shrink-0 df-slant-block"
          />
        </div>

        {!hideCaption && (
          <figcaption
            className={`max-w-[38ch] text-sm font-medium leading-relaxed ${
              isDarkMesh ? 'text-[var(--off-white)]/92' : 'text-[var(--text-muted)]'
            }`}
          >
            {shotDescription}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

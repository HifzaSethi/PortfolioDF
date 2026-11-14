import { SITE_CONFIG } from '../../config/site';

/**
 * BRAND CHARACTERS: Di & Fi
 * Renders nothing visible in production until official character assets
 * are configured in src/config/site.ts.
 * Includes mandatory AI-generated imagery disclosure label when rendered.
 */

interface CharacterSlotProps {
  name: 'Di' | 'Fi';
  className?: string;
}

export function CharacterSlot({ name, className = '' }: CharacterSlotProps) {
  const src = SITE_CONFIG.assets.characters[name];
  if (!src) return null;

  return (
    <figure className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={`Digital Field brand character ${name}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="block h-auto max-w-full object-contain"
      />
      <figcaption className="mt-2 text-[11px] text-[var(--text-muted)]">
        AI-generated imagery is labeled where disclosure is required.
      </figcaption>
    </figure>
  );
}

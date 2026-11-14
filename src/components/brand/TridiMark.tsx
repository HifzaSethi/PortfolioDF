import { SITE_CONFIG } from '../../config/site';
import { useTheme } from '../../hooks/useTheme';

/**
 * TRIDI MARK (DI + TRI — "Triangle + Digital")
 * Official vector emblem extracted from brand guidelines PDF.
 * Decorative secondary emblem for hero and footer surfaces — never replaces the DF logo.
 */

interface TridiMarkProps {
  size?: number;
  tone?: 'light' | 'dark' | 'auto';
  className?: string;
}

export function TridiMark({ size = 36, tone = 'auto', className = '' }: TridiMarkProps) {
  const { theme } = useTheme();
  const resolvedTone: 'light' | 'dark' =
    tone === 'auto' ? (theme === 'night' ? 'dark' : 'light') : tone;

  const src = resolvedTone === 'dark' ? SITE_CONFIG.assets.tridi.dark : SITE_CONFIG.assets.tridi.light;
  const height = Math.round(size * (411.97 / 492.62));

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={height}
        style={{ width: `${size}px`, height: 'auto' }}
        className="block object-contain select-none"
        draggable={false}
      />
    </span>
  );
}

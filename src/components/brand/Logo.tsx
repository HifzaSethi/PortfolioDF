import { SITE_CONFIG } from '../../config/site';
import { useTheme } from '../../hooks/useTheme';

/**
 * OFFICIAL DIGITAL FIELD. LOGO SYSTEM
 * - Uses ONLY official vector SVG assets extracted from DF_Phase_01_VR_02.pdf.
 * - Enforces minimum 1X clear space on all sides (X = height of the magenta block dot,
 *   which equals ~26.2% of the mark's height).
 * - Never stretches, squashes, recolors, fades, tilts, or adds shadows/outlines/glows.
 * - Light variant (dark ink #010102) on light surfaces; Dark variant (off-white #F4F1EA)
 *   on dark or gradient-mesh surfaces.
 */

export type LogoVariant = 'wordmark' | 'icon' | 'lockup-standard' | 'lockup-italic';
export type LogoTheme = 'light' | 'dark' | 'auto';

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function resolveConfiguredSrc(variant: LogoVariant, resolvedTheme: 'light' | 'dark'): string {
  const logos = SITE_CONFIG.assets.logos;
  if (variant === 'wordmark') return resolvedTheme === 'dark' ? logos.wordmarkDark : logos.wordmarkLight;
  if (variant === 'icon') return resolvedTheme === 'dark' ? logos.iconDark : logos.iconLight;
  if (variant === 'lockup-standard') {
    return resolvedTheme === 'dark' ? logos.lockupStandardDark : logos.lockupStandardLight;
  }
  return resolvedTheme === 'dark' ? logos.lockupItalicDark : logos.lockupItalicLight;
}

const HEIGHT_CLASSES: Record<LogoVariant, Record<'sm' | 'md' | 'lg', string>> = {
  icon: {
    sm: 'h-6 w-auto',
    md: 'h-7 w-auto',
    lg: 'h-9 w-auto',
  },
  wordmark: {
    sm: 'h-7 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
  },
  'lockup-standard': {
    sm: 'h-7 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
  },
  'lockup-italic': {
    sm: 'h-7 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
  },
};

// Clear space = 1X around logo where X = magenta dot height (~0.262 of mark height)
const CLEAR_SPACE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'p-[6px]',
  md: 'p-[8px]',
  lg: 'p-[10px]',
};

export function Logo({
  variant = 'lockup-standard',
  theme = 'auto',
  size = 'md',
  className = '',
}: LogoProps) {
  const { theme: appTheme } = useTheme();
  const resolvedTheme: 'light' | 'dark' =
    theme === 'auto' ? (appTheme === 'night' ? 'dark' : 'light') : theme;

  const src = resolveConfiguredSrc(variant, resolvedTheme);
  const altLabel =
    variant === 'icon' ? 'Digital Field. DF. mark' : 'Digital Field. primary logo';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${CLEAR_SPACE_CLASSES[size]} ${className}`}
    >
      <img
        src={src}
        alt={altLabel}
        className={`block ${HEIGHT_CLASSES[variant][size]} object-contain select-none`}
        draggable={false}
      />
    </span>
  );
}

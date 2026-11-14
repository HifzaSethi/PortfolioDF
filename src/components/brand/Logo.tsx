import { SITE_CONFIG } from '../../config/site';

/**
 * LOGO SYSTEM (PLACEHOLDER MODE)
 *
 * Official Digital Field. Brand Guidelines:
 * - Clear space = 1X on all sides where X = the size of the magenta block dot.
 * - Never stretch, squash, recolor outside the approved palette, add or remove elements,
 *   fade, add shadows, outlines or glows, or tilt/rotate.
 * - Below legible size, switch wordmark to icon.
 * - Drop official SVGs into /src/assets/brand/ and map them in src/config/site.ts.
 */

export type LogoVariant = 'wordmark' | 'icon' | 'lockup-standard' | 'lockup-italic';
export type LogoTheme = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
}

const VARIANT_META: Record<
  LogoVariant,
  { label: string; dimensionsClass: string; targetPath: string }
> = {
  wordmark: {
    label: 'LOGO PLACEHOLDER · WORDMARK',
    dimensionsClass: 'h-9 min-w-[148px] px-3',
    targetPath: '/src/assets/brand/logo-wordmark-*.svg',
  },
  icon: {
    label: 'LOGO PLACEHOLDER · ICON',
    dimensionsClass: 'h-9 w-12 px-2',
    targetPath: '/src/assets/brand/logo-icon-*.svg',
  },
  'lockup-standard': {
    label: 'LOGO PLACEHOLDER · STANDARD LOCKUP',
    dimensionsClass: 'h-11 min-w-[220px] px-3.5',
    targetPath: '/src/assets/brand/logo-lockup-standard-*.svg',
  },
  'lockup-italic': {
    label: 'LOGO PLACEHOLDER · ITALIC LOCKUP',
    dimensionsClass: 'h-11 min-w-[220px] px-3.5',
    targetPath: '/src/assets/brand/logo-lockup-italic-*.svg',
  },
};

function resolveConfiguredSrc(variant: LogoVariant, theme: LogoTheme): string | null {
  const logos = SITE_CONFIG.assets.logos;
  if (variant === 'wordmark') return theme === 'dark' ? logos.wordmarkDark : logos.wordmarkLight;
  if (variant === 'icon') return theme === 'dark' ? logos.iconDark : logos.iconLight;
  if (variant === 'lockup-standard') {
    return theme === 'dark' ? logos.lockupStandardDark : logos.lockupStandardLight;
  }
  return theme === 'dark' ? logos.lockupItalicDark : logos.lockupItalicLight;
}

export function Logo({ variant = 'wordmark', theme = 'light', className = '' }: LogoProps) {
  const configuredSrc = resolveConfiguredSrc(variant, theme);
  const meta = VARIANT_META[variant];

  if (configuredSrc) {
    return (
      <img
        src={configuredSrc}
        alt="Digital Field."
        className={`block h-9 w-auto object-contain select-none ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <span
      className={`inline-flex items-center justify-between gap-2.5 border border-dashed transition-colors ${
        isDark
          ? 'border-[var(--border-dark-strong)] bg-[color-mix(in_srgb,var(--off-white)_4%,transparent)] text-[var(--off-white)]'
          : 'border-[var(--border-light-strong)] bg-[color-mix(in_srgb,var(--near-black)_3%,transparent)] text-[var(--near-black)]'
      } ${meta.dimensionsClass} ${className}`}
      data-placeholder-asset={meta.targetPath}
      aria-label="Digital Field. logo placeholder"
    >
      <span className="text-[10px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap opacity-85">
        {meta.label}
      </span>
      <span
        aria-hidden="true"
        className="inline-block w-2 h-2 shrink-0 bg-[var(--magenta)]"
        title="Dot anchor reference"
      />
    </span>
  );
}

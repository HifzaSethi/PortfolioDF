import { useId } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * OFFICIAL DF. REPEATING PATTERN
 * Derived directly from the official DF logo mark geometry scaled and tiled cleanly
 * across gradient-mesh and surface backgrounds. Adapts stroke/fill contrast to Day/Night mode.
 */

interface BrandPatternProps {
  tone?: 'dark' | 'light' | 'auto';
  opacity?: number;
  className?: string;
}

const DF_MARK_D =
  'M 220.51 136.95 L 314.71 136.95 L 350.52 77.74 L 284.09 77.74 L 270.37 56.32 L 383.71 56.32 L 384.33 55.40 L 419.00 0.00 L 84.60 0.00 L 111.25 36.48 L 0.00 222.67 L 170.08 222.37 Z M 211.37 56.61 L 172.87 119.01 L 145.35 164.04 C 136.55 164.04 127.78 163.88 118.98 164.04 C 110.18 164.04 100.12 164.42 91.16 164.42 C 93.78 160.02 96.86 154.98 99.48 150.58 C 113.69 126.88 128.91 102.33 143.59 77.74 L 129.85 56.32 L 170.45 56.32 C 183.63 56.32 196.96 56.46 210.16 56.46 L 211.37 56.46 Z';
const DF_DOT_D = 'M 263.50 222.68 L 201.22 222.68 L 236.87 164.37 L 299.14 164.37 Z';

export function BrandPattern({
  tone = 'auto',
  opacity,
  className = '',
}: BrandPatternProps) {
  const patternId = useId();
  const { theme } = useTheme();

  const resolvedTone: 'dark' | 'light' =
    tone === 'auto' ? (theme === 'night' ? 'dark' : 'light') : tone;

  const markColor = resolvedTone === 'dark' ? '#F4F1EA' : '#010102';
  const defaultOpacity = resolvedTone === 'dark' ? (theme === 'night' ? 0.095 : 0.065) : 0.045;
  const resolvedOpacity = opacity ?? defaultOpacity;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none transition-opacity duration-300 ${className}`}
      style={{ opacity: resolvedOpacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width="136"
            height="92"
            patternUnits="userSpaceOnUse"
          >
            <g transform="translate(8 10) scale(0.14)">
              <path fillRule="evenodd" clipRule="evenodd" d={DF_MARK_D} fill={markColor} fillOpacity="0.6" />
              <path d={DF_DOT_D} fill="#E23389" fillOpacity="0.85" />
            </g>
            <g transform="translate(76 52) scale(0.14)">
              <path fillRule="evenodd" clipRule="evenodd" d={DF_MARK_D} fill={markColor} fillOpacity="0.45" />
              <path d={DF_DOT_D} fill="#B34FFF" fillOpacity="0.75" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

import { useId } from 'react';

/**
 * DF. PATTERN (PLACEHOLDER)
 * Abstract slanted-geometry parallelogram pattern matching --slant (-12deg).
 * Swappable once official DF. Pattern artwork is supplied.
 */

interface BrandPatternProps {
  tone?: 'dark' | 'light';
  opacity?: number;
  className?: string;
}

export function BrandPattern({
  tone = 'dark',
  opacity = 0.08,
  className = '',
}: BrandPatternProps) {
  const patternId = useId();
  const strokeColor = tone === 'dark' ? '#F4F1EA' : '#010102';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ opacity }}
      data-placeholder-asset="official-df-pattern"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width="84"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="18,8 42,8 30,56 6,56"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
            />
            <polygon
              points="54,8 78,8 66,56 42,56"
              fill={strokeColor}
              fillOpacity="0.18"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

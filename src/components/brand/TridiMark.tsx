/**
 * TRIDI MARK (PLACEHOLDER)
 * Inverted triangle emblem motif.
 * Strictly secondary emblem for dark and gradient surfaces — never a logo replacement.
 */

interface TridiMarkProps {
  size?: number;
  className?: string;
}

export function TridiMark({ size = 36, className = '' }: TridiMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-2 select-none ${className}`}
      data-placeholder-asset="official-tridi-mark"
      title="Tridi Mark placeholder"
    >
      <svg
        width={size}
        height={Math.round(size * 0.88)}
        viewBox="0 0 40 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="3,3 37,3 20,32"
          stroke="url(#tridi-grad)"
          strokeWidth="2"
          fill="none"
        />
        <polygon
          points="11,8 29,8 20,24"
          stroke="#F4F1EA"
          strokeOpacity="0.35"
          strokeWidth="1"
          fill="none"
        />
        <defs>
          <linearGradient id="tridi-grad" x1="3" y1="3" x2="37" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B34FFF" />
            <stop offset="1" stopColor="#E23389" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

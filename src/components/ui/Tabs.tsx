import { useRef, type KeyboardEvent } from 'react';

export interface TabOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface TabsProps {
  ariaLabel: string;
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  tone?: 'light' | 'dark';
  className?: string;
}

export function Tabs({
  ariaLabel,
  options,
  activeId,
  onChange,
  tone = 'light',
  className = '',
}: TabsProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isDark = tone === 'dark';

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % options.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = options.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const target = options[nextIndex];
      onChange(target.id);
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {options.map((opt, index) => {
        const selected = opt.id === activeId;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`min-h-[44px] px-4 py-2 text-left text-sm font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
              selected
                ? 'bg-[var(--electric-blue)] text-[var(--off-white)] border-[var(--electric-blue)]'
                : isDark
                  ? 'bg-transparent text-[var(--off-white)]/80 border-[var(--border-dark)] hover:border-[var(--off-white)]'
                  : 'bg-transparent text-[var(--near-black)]/80 border-[var(--border-light-strong)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)]'
            }`}
          >
            <span className="block">{opt.label}</span>
            {opt.sublabel && (
              <span className="block text-[11px] font-normal opacity-80">{opt.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

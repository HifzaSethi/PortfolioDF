import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  tone?: 'light' | 'dark' | 'auto';
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({
  items,
  tone = 'auto',
  allowMultiple = false,
  defaultOpenIds = [],
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const baseId = useId();
  const isDark = tone === 'dark';

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((item) => item !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div
      className={`divide-y ${
        isDark
          ? 'divide-[var(--border-dark)] border-y border-[var(--border-dark)]'
          : 'divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]'
      } ${className}`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-btn-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className={`flex w-full min-h-[52px] items-center justify-between gap-4 py-4 px-2 text-left df-interactive ${
                isDark
                  ? 'text-[var(--off-white)] hover:text-[var(--violet)]'
                  : 'text-[var(--text-primary)] hover:text-[var(--link-accent)]'
              }`}
            >
              <div>
                <span className="block text-base font-semibold">{item.title}</span>
                {item.subtitle && (
                  <span
                    className={`mt-0.5 block text-xs ${
                      isDark ? 'text-[var(--on-dark-muted)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                )}
              </div>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5 pt-1"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

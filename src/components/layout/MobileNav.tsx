import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import { HEADER_CTA, PRIMARY_NAV } from '../../config/nav';
import { Logo } from '../brand/Logo';
import { LinkButton } from '../ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="fixed inset-0 z-[var(--z-drawer)] flex flex-col bg-[var(--near-black)] text-[var(--off-white)] overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-dark)] px-5 py-4">
        <Link to="/" onClick={onClose} aria-label="Digital Field. Home">
          <Logo variant="icon" theme="dark" />
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-dark)] text-[var(--off-white)] hover:border-[var(--electric-blue)] cursor-pointer"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Mobile Primary" className="flex-1 px-5 py-8">
        <ul className="divide-y divide-[var(--border-dark)]">
          {PRIMARY_NAV.map((item) => {
            const isActive = location.pathname === item.path;
            if (item.children) {
              return (
                <li key={item.path} className="py-2">
                  <button
                    type="button"
                    aria-expanded={servicesExpanded}
                    onClick={() => setServicesExpanded((v) => !v)}
                    className="flex min-h-[48px] w-full items-center justify-between text-left text-xl font-bold text-[var(--off-white)] cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 transition-transform duration-200 ${
                        servicesExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {servicesExpanded && (
                    <ul className="mt-2 mb-3 space-y-1 border-l border-[var(--border-dark-strong)] pl-4">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            onClick={onClose}
                            className={`flex min-h-[44px] items-center text-sm font-medium ${
                              location.pathname === child.path
                                ? 'text-[var(--magenta)] font-semibold'
                                : 'text-[var(--on-dark-muted)] hover:text-[var(--off-white)]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.path} className="py-2">
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex min-h-[48px] items-center text-xl font-bold ${
                    isActive ? 'text-[var(--magenta)]' : 'text-[var(--off-white)]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border-dark)] px-5 py-6 space-y-4">
        <LinkButton
          to={HEADER_CTA.path}
          variant="on-dark"
          onClick={onClose}
          className="w-full justify-center"
        >
          {HEADER_CTA.label}
        </LinkButton>
        <p className="text-center text-xs tracking-[0.16em] uppercase text-[var(--on-dark-subtle)]">
          Performance in Context.
        </p>
      </div>
    </div>
  );
}

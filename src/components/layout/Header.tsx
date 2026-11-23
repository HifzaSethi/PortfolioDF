import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { HEADER_CTA, PRIMARY_NAV } from '../../config/nav';
import { useTheme } from '../../hooks/useTheme';
import { Logo } from '../brand/Logo';
import { LinkButton } from '../ui/Button';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false);
    };
    document.addEventListener('mousedown', handleDocClick);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const openMega = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setMegaOpen(false);
    }, 150);
  };

  return (
    <>
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('main-content');
          if (main) {
            main.focus({ preventScroll: true });
            main.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip)] focus:bg-[var(--electric-blue)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--off-white)]"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseMega}
        className={`sticky top-0 z-[var(--z-header)] border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-md py-2.5 transition-[box-shadow,background-color,border-color] duration-300 ${
          condensed ? 'shadow-[var(--shadow-subtle)]' : ''
        }`}
      >
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-2 sm:gap-5 px-5 sm:px-8 lg:px-10">
          {/* Zone 1: Primary Lockup on Desktop (1X clear space), Compact DF Mark on Mobile */}
          <Link
            to="/"
            aria-label="Digital Field. Home"
            className="shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)]"
          >
            <span className="hidden sm:inline-flex">
              <Logo variant="lockup-standard" theme="auto" size="md" />
            </span>
            <span className="inline-flex sm:hidden">
              <Logo variant="icon" theme="auto" size="md" />
            </span>
          </Link>

          {/* Zone 2: Single-line Primary Navigation */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-[13px] xl:text-sm font-semibold text-[var(--text-primary)]"
          >
            {PRIMARY_NAV.map((item) => {
              const isServices = Boolean(item.children);
              const isActive =
                location.pathname === item.path ||
                (isServices && location.pathname.startsWith('/services'));

              if (isServices) {
                return (
                  <div
                    key={item.path}
                    className="relative flex items-center shrink-0"
                    onMouseEnter={openMega}
                  >
                    <Link
                      to={item.path}
                      onFocus={openMega}
                      className={`df-link-sweep whitespace-nowrap shrink-0 py-1.5 transition-colors ${
                        isActive ? 'text-[var(--link-accent)]' : 'hover:text-[var(--link-accent)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="services-megamenu"
                      aria-label="Toggle Services menu"
                      onClick={() => setMegaOpen((v) => !v)}
                      className="ml-0.5 inline-flex h-8 w-6 items-center justify-center text-current hover:text-[var(--link-accent)] cursor-pointer"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform duration-150 ${
                          megaOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setMegaOpen(false)}
                  className={`df-link-sweep whitespace-nowrap shrink-0 py-1.5 transition-colors ${
                    isActive ? 'text-[var(--link-accent)]' : 'hover:text-[var(--link-accent)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Day / Night Segmented Toggle + Primary Skewed CTA + Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              role="group"
              aria-label="Theme mode"
              className="inline-flex items-center border border-[var(--border-strong)] bg-[var(--bg-tint)] p-0.5 shrink-0"
            >
              <button
                type="button"
                aria-pressed={theme === 'day'}
                title="Switch to Day theme"
                onClick={() => setTheme('day')}
                className={`inline-flex items-center gap-1 sm:gap-1.5 min-h-[36px] px-2 sm:px-2.5 py-1 text-xs font-bold tracking-tight whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2 ${
                  theme === 'day'
                    ? 'df-gradient-accent text-[var(--near-black)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span>Day</span>
              </button>

              <button
                type="button"
                aria-pressed={theme === 'night'}
                title="Switch to Night theme"
                onClick={() => setTheme('night')}
                className={`inline-flex items-center gap-1 sm:gap-1.5 min-h-[36px] px-2 sm:px-2.5 py-1 text-xs font-bold tracking-tight whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2 ${
                  theme === 'night'
                    ? 'df-gradient-accent text-[var(--near-black)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span>Night</span>
              </button>
            </div>

            <LinkButton
              to={HEADER_CTA.path}
              variant={theme === 'night' ? 'gradient' : 'primary'}
              className="hidden md:inline-flex px-4 xl:px-5 text-xs xl:text-sm"
            >
              {HEADER_CTA.label}
            </LinkButton>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--link-accent)] cursor-pointer shrink-0"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <MegaMenu isOpen={megaOpen} onClose={() => setMegaOpen(false)} />
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

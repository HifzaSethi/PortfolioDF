import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { HEADER_CTA, PRIMARY_NAV } from '../../config/nav';
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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip)] focus:bg-[var(--electric-blue)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[var(--off-white)]"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseMega}
        className={`sticky top-0 z-[var(--z-header)] border-b border-[var(--border-light)] bg-[var(--off-white)]/95 backdrop-blur-md transition-all duration-200 ${
          condensed ? 'py-2.5 shadow-sm' : 'py-4'
        }`}
      >
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-4 sm:gap-8 px-5 sm:px-8 lg:px-10">
          {/* Zone 1: Brand Logo Placeholder (Icon on very small viewports, Wordmark on sm+) */}
          <Link
            to="/"
            aria-label="Digital Field. Home"
            className="shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)]"
          >
            <span className="hidden sm:inline-flex">
              <Logo variant="wordmark" theme="light" />
            </span>
            <span className="inline-flex sm:hidden">
              <Logo variant="icon" theme="light" />
            </span>
          </Link>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[var(--near-black)]"
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
                    className="relative flex items-center"
                    onMouseEnter={openMega}
                  >
                    <Link
                      to={item.path}
                      onFocus={openMega}
                      className={`df-link-sweep whitespace-nowrap shrink-0 py-1.5 transition-colors ${
                        isActive ? 'text-[var(--electric-blue)]' : 'hover:text-[var(--electric-blue)]'
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
                      className="ml-1 inline-flex h-8 w-6 items-center justify-center text-current hover:text-[var(--electric-blue)] cursor-pointer"
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
                    isActive ? 'text-[var(--electric-blue)]' : 'hover:text-[var(--electric-blue)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + mobile menu trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <LinkButton
              to={HEADER_CTA.path}
              variant="primary"
              className="hidden sm:inline-flex"
            >
              {HEADER_CTA.label}
            </LinkButton>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center border border-[var(--border-light-strong)] text-[var(--near-black)] hover:border-[var(--electric-blue)] cursor-pointer"
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

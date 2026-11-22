import { Link } from 'react-router-dom';
import { FOOTER_COMPANY_LINKS, FOOTER_PRACTICE_LINKS } from '../../config/nav';
import { SITE_CONFIG } from '../../config/site';
import { BrandPattern } from '../brand/BrandPattern';
import { Logo } from '../brand/Logo';
import { TridiMark } from '../brand/TridiMark';
import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden df-mesh-dark df-mesh-animate border-t border-[var(--border-dark)] text-[var(--off-white)] py-16 sm:py-20">
      <BrandPattern tone="dark" opacity={0.075} />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Lockup, Positioning & Tridi Decorative Emblem */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" aria-label="Digital Field. Home" className="inline-block">
                <Logo variant="lockup-standard" theme="dark" size="lg" />
              </Link>
              <TridiMark size={44} tone="dark" className="opacity-85 shrink-0" />
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-[var(--on-dark-muted)]">
              Digital Performance &amp; Intelligence Consultancy. Connecting brand, content, media,
              search, technology, customer experience, and data into measurable commercial growth.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] bg-[var(--magenta)] text-[var(--near-black)] df-slant-block">
                <span className="df-unslant block">See the Whole Field</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--off-white)]/80">
                Performance in Context.
              </span>
            </div>
          </div>

          {/* Sitemap Links */}
          <div className="sm:col-span-6 lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              01 Navigation
            </h2>
            <ul className="space-y-1 text-sm">
              {FOOTER_COMPANY_LINKS.map((item) => (
                <li key={item.path} className="df-row">
                  <Link
                    to={item.path}
                    className="relative z-10 flex items-center justify-between py-1.5 px-2 text-[var(--off-white)]/85 hover:text-[var(--off-white)]"
                  >
                    <span className="df-row-title">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practices Links */}
          <div className="sm:col-span-6 lg:col-span-3 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              02 Consultancy Practices
            </h2>
            <ul className="space-y-1 text-sm">
              {FOOTER_PRACTICE_LINKS.map((item) => (
                <li key={item.path} className="df-row">
                  <Link
                    to={item.path}
                    className="relative z-10 flex items-center justify-between py-1.5 px-2 text-[var(--off-white)]/85 hover:text-[var(--off-white)]"
                  >
                    <span className="df-row-title">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder Contact Block */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              03 Contact
            </h2>
            <dl className="space-y-2.5 text-xs leading-relaxed text-[var(--on-dark-muted)]">
              <div>
                <dt className="font-semibold text-[var(--off-white)]">Location</dt>
                <dd>{SITE_CONFIG.location.streetPlaceholder}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--off-white)]">Email</dt>
                <dd>{SITE_CONFIG.contact.email ?? SITE_CONFIG.contact.emailPlaceholder}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--off-white)]">Phone</dt>
                <dd>{SITE_CONFIG.contact.phone ?? SITE_CONFIG.contact.phonePlaceholder}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--off-white)]">Social</dt>
                <dd>{SITE_CONFIG.contact.socialPlaceholder}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--border-dark)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--on-dark-subtle)]">
            &copy; {year} {SITE_CONFIG.brandName} Founded {SITE_CONFIG.foundingYear} in Dubai,
            United Arab Emirates.
          </p>
          <p className="text-xs font-bold tracking-[0.22em] text-[var(--off-white)]">
            {SITE_CONFIG.domainDisplay}
          </p>
        </div>
      </Container>
    </footer>
  );
}

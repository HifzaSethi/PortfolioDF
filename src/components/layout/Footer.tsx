import { Link } from 'react-router-dom';
import { FOOTER_COMPANY_LINKS, FOOTER_PRACTICE_LINKS } from '../../config/nav';
import { SITE_CONFIG } from '../../config/site';
import { Logo } from '../brand/Logo';
import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-dark)] bg-[var(--near-black)] text-[var(--off-white)] py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Lockup & Positioning */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" aria-label="Digital Field. Home" className="inline-block">
              <Logo variant="lockup-standard" theme="dark" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--on-dark-muted)]">
              Digital Performance &amp; Intelligence Consultancy. Connecting brand, content, media,
              search, technology, customer experience, and data into measurable commercial growth.
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--off-white)]/70">
              Performance in Context.
            </p>
          </div>

          {/* Sitemap Links */}
          <div className="sm:col-span-6 lg:col-span-2 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_COMPANY_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="df-link-sweep text-[var(--off-white)]/85 hover:text-[var(--off-white)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practices Links */}
          <div className="sm:col-span-6 lg:col-span-3 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              Consultancy Practices
            </h2>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_PRACTICE_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="df-link-sweep text-[var(--off-white)]/85 hover:text-[var(--off-white)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Placeholder Contact Block */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--on-dark-subtle)]">
              Contact
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

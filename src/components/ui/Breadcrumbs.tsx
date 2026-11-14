import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTE_META } from '../../config/seo';

interface BreadcrumbsProps {
  routePath: string;
  tone?: 'light' | 'dark' | 'auto';
}

export function Breadcrumbs({ routePath, tone = 'auto' }: BreadcrumbsProps) {
  const crumbs = ROUTE_META[routePath]?.breadcrumbs;
  if (!crumbs || crumbs.length <= 1) return null;

  const mutedClass =
    tone === 'dark' ? 'text-[var(--on-dark-muted)]' : 'text-[var(--text-muted)]';
  const currentClass =
    tone === 'dark' ? 'text-[var(--off-white)]' : 'text-[var(--text-primary)]';

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className={`flex flex-wrap items-center gap-2 text-xs font-medium ${mutedClass}`}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="inline-flex items-center gap-2">
              {index > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />}
              {isLast ? (
                <span aria-current="page" className={currentClass}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="df-link-sweep hover:text-[var(--link-accent)] transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

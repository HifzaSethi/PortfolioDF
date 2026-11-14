import { SITE_CONFIG } from '../config/site';
import { PRACTICES } from '../data/practices';
import { SEARCH_DISCIPLINES } from '../data/searchIntelligence';
import type { RouteMeta } from '../types/content';

export function buildOrganizationJsonLd(): Record<string, unknown> {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_CONFIG.brandName,
    alternateName: SITE_CONFIG.abbreviation,
    description:
      'Digital Performance & Intelligence Consultancy connecting brand, content, media, search, technology, customer experience, and data into measurable commercial growth.',
    foundingDate: SITE_CONFIG.foundingYear,
    founder: {
      '@type': 'Person',
      name: SITE_CONFIG.founder,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.location.city,
      addressCountry: SITE_CONFIG.location.countryCode,
    },
  };

  if (SITE_CONFIG.baseUrl) {
    org.url = SITE_CONFIG.baseUrl;
  }
  if (SITE_CONFIG.contact.email) {
    org.email = SITE_CONFIG.contact.email;
  }
  if (SITE_CONFIG.contact.phone) {
    org.telephone = SITE_CONFIG.contact.phone;
  }

  return org;
}

export function buildPracticesItemListJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Digital Field. Consultancy Practices',
    itemListElement: PRACTICES.map((practice, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: practice.name,
        description: practice.summary,
        serviceType: practice.roleLabel,
      },
    })),
  };
}

export function buildSearchDisciplinesJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Digital Field. Search Intelligence Disciplines',
    itemListElement: SEARCH_DISCIPLINES.map((discipline, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: `${discipline.acronym} — ${discipline.fullName}`,
        description: discipline.explanation,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  breadcrumbs?: RouteMeta['breadcrumbs']
): Record<string, unknown> | null {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(SITE_CONFIG.baseUrl
        ? { item: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${crumb.path}` }
        : {}),
    })),
  };
}

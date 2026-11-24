import { SITE_CONFIG } from '../config/site';
import { PRACTICES } from '../data/practices';
import { SEARCH_DISCIPLINES } from '../data/searchIntelligence';
import type { SiteSettingsContent } from '../types/cms';
import type { RouteMeta, SearchDiscipline } from '../types/content';

export function buildOrganizationJsonLd(
  siteSettings?: SiteSettingsContent
): Record<string, unknown> {
  const effectiveBaseUrl = siteSettings ? siteSettings.baseUrl : SITE_CONFIG.baseUrl;
  const effectiveEmail = siteSettings ? siteSettings.contact.email : SITE_CONFIG.contact.email;
  const effectivePhone = siteSettings ? siteSettings.contact.phone : SITE_CONFIG.contact.phone;
  const effectiveSocials = siteSettings?.contact.socialLinks ?? [];

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

  if (effectiveBaseUrl) {
    org.url = effectiveBaseUrl;
  }
  if (effectiveEmail) {
    org.email = effectiveEmail;
  }
  if (effectivePhone) {
    org.telephone = effectivePhone;
  }
  if (effectiveSocials.length > 0) {
    org.sameAs = effectiveSocials.map((item) => item.url);
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

export function buildSearchDisciplinesJsonLd(
  disciplines: SearchDiscipline[] = SEARCH_DISCIPLINES
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Digital Field. Search Intelligence Disciplines',
    itemListElement: disciplines.map((discipline, index) => ({
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
  breadcrumbs?: RouteMeta['breadcrumbs'],
  baseUrl?: string
): Record<string, unknown> | null {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  const effectiveBaseUrl = (baseUrl ?? SITE_CONFIG.baseUrl).trim();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(effectiveBaseUrl
        ? { item: `${effectiveBaseUrl.replace(/\/$/, '')}${crumb.path}` }
        : {}),
    })),
  };
}

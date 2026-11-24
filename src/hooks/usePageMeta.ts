import { useEffect } from 'react';
import { ROUTE_META } from '../config/seo';
import { useContent } from '../context/ContentContext';
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd } from '../lib/seo';

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function removeMetaTag(attr: 'name' | 'property', key: string): void {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null): void {
  const existing = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
  if (!data) {
    existing?.remove();
    return;
  }
  let script = existing;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function usePageMeta(routePath: string, extraJsonLd?: Record<string, unknown>): void {
  const { content } = useContent();
  const { siteSettings } = content;

  useEffect(() => {
    const meta = ROUTE_META[routePath] ?? ROUTE_META['/404'];
    document.title = meta.title;

    upsertMetaTag('name', 'description', meta.description);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('property', 'og:type', meta.ogType ?? 'website');
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);

    if (meta.noIndex) {
      upsertMetaTag('name', 'robots', 'noindex, nofollow, noarchive');
    } else {
      removeMetaTag('name', 'robots');
    }

    const origin = siteSettings.baseUrl
      ? siteSettings.baseUrl.replace(/\/$/, '')
      : typeof window !== 'undefined'
        ? window.location.origin
        : '';
    const canonicalUrl = `${origin}${meta.canonicalPath}`;
    upsertCanonical(canonicalUrl);
    upsertMetaTag('property', 'og:url', canonicalUrl);

    upsertJsonLd('df-jsonld-org', buildOrganizationJsonLd(siteSettings));
    upsertJsonLd(
      'df-jsonld-breadcrumbs',
      buildBreadcrumbJsonLd(meta.breadcrumbs, siteSettings.baseUrl)
    );
    upsertJsonLd('df-jsonld-extra', extraJsonLd ?? null);
  }, [routePath, extraJsonLd, siteSettings]);
}

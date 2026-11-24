import { SITE_CONFIG } from '../config/site';
import { INDUSTRIES, INDUSTRIES_COPY } from '../data/industries';
import { PERFORMANCE_MARKETING_LEAD, PERFORMANCE_SECTIONS } from '../data/performanceMarketing';
import {
  SEARCH_DISCIPLINES,
  SEARCH_INTELLIGENCE_COPY,
  SEARCH_MEASUREMENT_VOCABULARY,
} from '../data/searchIntelligence';
import { STUDIO_COPY, STUDIO_DISCIPLINES } from '../data/studio';
import type {
  ContentBundle,
  IndustriesContent,
  PerformanceMarketingContent,
  PortfolioItem,
  SearchIntelligenceContent,
  SiteSettingsContent,
  SocialLink,
  StudioContent,
} from '../types/cms';
import type {
  IndustryItem,
  PerformanceSection,
  SearchDiscipline,
  StudioDiscipline,
} from '../types/content';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d\s().-]{6,32}$/;

export function getDefaultContentBundle(): ContentBundle {
  return {
    siteSettings: {
      baseUrl: SITE_CONFIG.baseUrl,
      contact: {
        email: SITE_CONFIG.contact.email,
        phone: SITE_CONFIG.contact.phone,
        socialLinks: [],
      },
    },
    performanceMarketing: {
      lead: { ...PERFORMANCE_MARKETING_LEAD },
      sections: PERFORMANCE_SECTIONS.map((section) => ({
        ...section,
        items: section.items ? [...section.items] : undefined,
        subBlocks: section.subBlocks
          ? section.subBlocks.map((block) => ({ ...block, items: [...block.items] }))
          : undefined,
      })),
    },
    searchIntelligence: {
      copy: { ...SEARCH_INTELLIGENCE_COPY },
      measurementVocabulary: [...SEARCH_MEASUREMENT_VOCABULARY],
      disciplines: SEARCH_DISCIPLINES.map((discipline) => ({
        ...discipline,
        deliverables: [...discipline.deliverables],
        relatedLink: discipline.relatedLink ? { ...discipline.relatedLink } : undefined,
      })),
    },
    studio: {
      copy: {
        ...STUDIO_COPY,
        loopSteps: [...STUDIO_COPY.loopSteps],
      },
      disciplines: STUDIO_DISCIPLINES.map((discipline) => ({
        ...discipline,
        subServices: [...discipline.subServices],
        image: discipline.image ? { ...discipline.image } : undefined,
      })),
    },
    industries: {
      copy: { ...INDUSTRIES_COPY },
      items: INDUSTRIES.map((item) => ({
        ...item,
        image: item.image ? { ...item.image } : undefined,
      })),
    },
  };
}

export function sanitizeExternalUrl(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();
  if (!value) return null;
  if (/^(javascript|data|vbscript|file):/i.test(value)) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function sanitizeAppOrExternalPath(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();
  if (!value) return null;
  if (/^(javascript|data|vbscript|file):/i.test(value)) return null;
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return sanitizeExternalUrl(value);
}

function asNonEmptyString(val: unknown, fallback: string): string {
  return typeof val === 'string' && val.trim().length > 0 ? val : fallback;
}

function asStringOrEmpty(val: unknown, fallback: string): string {
  return typeof val === 'string' ? val : fallback;
}

function asStringArray(val: unknown, fallback: string[]): string[] {
  if (!Array.isArray(val)) return [...fallback];
  return val.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

export function normalizeSiteSettings(raw: unknown, fallback: SiteSettingsContent): SiteSettingsContent {
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  const contactObj =
    obj.contact && typeof obj.contact === 'object' ? (obj.contact as Record<string, unknown>) : {};

  const emailRaw = typeof contactObj.email === 'string' ? contactObj.email.trim() : '';
  const phoneRaw = typeof contactObj.phone === 'string' ? contactObj.phone.trim() : '';
  const baseUrlRaw = typeof obj.baseUrl === 'string' ? obj.baseUrl.trim() : '';

  const rawLinks = Array.isArray(contactObj.socialLinks) ? contactObj.socialLinks : [];
  const socialLinks: SocialLink[] = rawLinks
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as Record<string, unknown>;
      const label = typeof item.label === 'string' ? item.label.trim() : '';
      const url = sanitizeExternalUrl(typeof item.url === 'string' ? item.url : '');
      if (!label || !url) return null;
      return { label, url };
    })
    .filter((item): item is SocialLink => item !== null);

  const normalizedBaseUrl = sanitizeExternalUrl(baseUrlRaw);

  return {
    baseUrl: normalizedBaseUrl ? normalizedBaseUrl.replace(/\/+$/, '') : '',
    contact: {
      email: emailRaw && EMAIL_PATTERN.test(emailRaw) ? emailRaw : null,
      phone: phoneRaw && PHONE_PATTERN.test(phoneRaw) ? phoneRaw : null,
      socialLinks,
    },
  };
}

export function normalizePerformanceMarketing(
  raw: unknown,
  fallback: PerformanceMarketingContent
): PerformanceMarketingContent {
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  const leadObj = obj.lead && typeof obj.lead === 'object' ? (obj.lead as Record<string, unknown>) : {};

  const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
  const sections: PerformanceSection[] = rawSections
    .map((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null;
      const sec = entry as Record<string, unknown>;
      const title = typeof sec.title === 'string' ? sec.title.trim() : '';
      if (!title) return null;
      const id =
        typeof sec.id === 'string' && sec.id.trim()
          ? sec.id.trim()
          : `section-${idx + 1}`;
      const summary = asStringOrEmpty(sec.summary, '');
      const items = Array.isArray(sec.items) ? asStringArray(sec.items, []) : undefined;
      const subBlocks = Array.isArray(sec.subBlocks)
        ? sec.subBlocks
            .map((sub, sIdx) => {
              if (!sub || typeof sub !== 'object') return null;
              const sb = sub as Record<string, unknown>;
              const subTitle = typeof sb.title === 'string' ? sb.title.trim() : '';
              if (!subTitle) return null;
              return {
                id:
                  typeof sb.id === 'string' && sb.id.trim()
                    ? sb.id.trim()
                    : `${id}-block-${sIdx + 1}`,
                title: subTitle,
                summary: asStringOrEmpty(sb.summary, ''),
                items: asStringArray(sb.items, []),
              };
            })
            .filter((b): b is NonNullable<typeof b> => b !== null)
        : undefined;

      return {
        id,
        title,
        summary,
        ...(items && items.length > 0 ? { items } : {}),
        ...(subBlocks && subBlocks.length > 0 ? { subBlocks } : {}),
      } satisfies PerformanceSection;
    })
    .filter((s): s is PerformanceSection => s !== null);

  return {
    lead: {
      lead: asNonEmptyString(leadObj.lead, fallback.lead.lead),
      principle: asNonEmptyString(leadObj.principle, fallback.lead.principle),
      closingNote: asNonEmptyString(leadObj.closingNote, fallback.lead.closingNote),
      disclaimer: asNonEmptyString(leadObj.disclaimer, fallback.lead.disclaimer),
    },
    sections: sections.length > 0 ? sections : fallback.sections,
  };
}

export function normalizeSearchIntelligence(
  raw: unknown,
  fallback: SearchIntelligenceContent
): SearchIntelligenceContent {
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  const copyObj = obj.copy && typeof obj.copy === 'object' ? (obj.copy as Record<string, unknown>) : {};

  const vocab = asStringArray(obj.measurementVocabulary, fallback.measurementVocabulary);
  const rawDisciplines = Array.isArray(obj.disciplines) ? obj.disciplines : [];
  const disciplines: SearchDiscipline[] = rawDisciplines
    .map((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null;
      const d = entry as Record<string, unknown>;
      const acronym = typeof d.acronym === 'string' ? d.acronym.trim() : '';
      const fullName = typeof d.fullName === 'string' ? d.fullName.trim() : '';
      if (!acronym || !fullName) return null;
      const id =
        typeof d.id === 'string' && d.id.trim()
          ? d.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
          : `discipline-${idx + 1}`;
      const rawRelated =
        d.relatedLink && typeof d.relatedLink === 'object'
          ? (d.relatedLink as Record<string, unknown>)
          : null;
      const relLabel = rawRelated && typeof rawRelated.label === 'string' ? rawRelated.label.trim() : '';
      const relPath =
        rawRelated && typeof rawRelated.path === 'string'
          ? sanitizeAppOrExternalPath(rawRelated.path)
          : null;

      return {
        id,
        acronym,
        fullName,
        tagline: asStringOrEmpty(d.tagline, ''),
        explanation: asStringOrEmpty(d.explanation, ''),
        whereItShowsUp: asStringOrEmpty(d.whereItShowsUp, ''),
        deliverables: asStringArray(d.deliverables, []),
        ...(relLabel && relPath ? { relatedLink: { label: relLabel, path: relPath } } : {}),
      } satisfies SearchDiscipline;
    })
    .filter((item): item is SearchDiscipline => item !== null);

  return {
    copy: {
      lead: asNonEmptyString(copyObj.lead, fallback.copy.lead),
      context: asNonEmptyString(copyObj.context, fallback.copy.context),
      impact: asNonEmptyString(copyObj.impact, fallback.copy.impact),
      closingLine: asNonEmptyString(copyObj.closingLine, fallback.copy.closingLine),
      note: asNonEmptyString(copyObj.note, fallback.copy.note),
    },
    measurementVocabulary: vocab.length > 0 ? vocab : fallback.measurementVocabulary,
    disciplines: disciplines.length > 0 ? disciplines : fallback.disciplines,
  };
}

export function normalizeStudio(raw: unknown, fallback: StudioContent): StudioContent {
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  const copyObj = obj.copy && typeof obj.copy === 'object' ? (obj.copy as Record<string, unknown>) : {};

  const rawDisciplines = Array.isArray(obj.disciplines) ? obj.disciplines : [];
  const validRatios = new Set(['16/9', '4/3', '3/4', '1/1']);
  const disciplines: StudioDiscipline[] = rawDisciplines
    .map<StudioDiscipline | null>((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null;
      const d = entry as Record<string, unknown>;
      const title = typeof d.title === 'string' ? d.title.trim() : '';
      if (!title) return null;
      const id =
        typeof d.id === 'string' && d.id.trim()
          ? d.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
          : `studio-discipline-${idx + 1}`;
      const fallbackMatch = fallback.disciplines.find((f) => f.id === id);
      const ratio =
        typeof d.aspectRatio === 'string' && validRatios.has(d.aspectRatio)
          ? (d.aspectRatio as StudioDiscipline['aspectRatio'])
          : fallbackMatch?.aspectRatio ?? '4/3';

      return {
        id,
        title,
        tagline: asStringOrEmpty(d.tagline, ''),
        description: asStringOrEmpty(d.description, ''),
        shotDescription: asStringOrEmpty(d.shotDescription, fallbackMatch?.shotDescription ?? title),
        altText: asStringOrEmpty(d.altText, fallbackMatch?.altText ?? title),
        aspectRatio: ratio,
        subServices: asStringArray(d.subServices, []),
        ...(typeof d.disclosureNote === 'string' && d.disclosureNote.trim()
          ? { disclosureNote: d.disclosureNote.trim() }
          : {}),
        ...(fallbackMatch?.image ? { image: fallbackMatch.image } : {}),
      };
    })
    .filter((item): item is StudioDiscipline => item !== null);

  return {
    copy: {
      tagline: asNonEmptyString(copyObj.tagline, fallback.copy.tagline),
      contrastClaim: asNonEmptyString(copyObj.contrastClaim, fallback.copy.contrastClaim),
      contrastReframe: asNonEmptyString(copyObj.contrastReframe, fallback.copy.contrastReframe),
      lead: asNonEmptyString(copyObj.lead, fallback.copy.lead),
      keyMessage: asNonEmptyString(copyObj.keyMessage, fallback.copy.keyMessage),
      loopIntro: asNonEmptyString(copyObj.loopIntro, fallback.copy.loopIntro),
      loopSteps: asStringArray(copyObj.loopSteps, fallback.copy.loopSteps),
      loopClosing: asNonEmptyString(copyObj.loopClosing, fallback.copy.loopClosing),
      brandDirectionNote: asNonEmptyString(
        copyObj.brandDirectionNote,
        fallback.copy.brandDirectionNote
      ),
      portfolioNotice: asNonEmptyString(copyObj.portfolioNotice, fallback.copy.portfolioNotice),
    },
    disciplines: disciplines.length > 0 ? disciplines : fallback.disciplines,
  };
}

export function normalizeIndustries(raw: unknown, fallback: IndustriesContent): IndustriesContent {
  if (!raw || typeof raw !== 'object') return fallback;
  const obj = raw as Record<string, unknown>;
  const copyObj = obj.copy && typeof obj.copy === 'object' ? (obj.copy as Record<string, unknown>) : {};

  const rawItems = Array.isArray(obj.items) ? obj.items : [];
  const items: IndustryItem[] = rawItems
    .map<IndustryItem | null>((entry, idx) => {
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as Record<string, unknown>;
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      if (!name) return null;
      const id =
        typeof item.id === 'string' && item.id.trim()
          ? item.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
          : `industry-${idx + 1}`;
      const fallbackMatch = fallback.items.find((f) => f.id === id);
      const safePath =
        sanitizeAppOrExternalPath(typeof item.path === 'string' ? item.path : '') ??
        `/contact?industry=${encodeURIComponent(name)}`;

      return {
        id,
        name,
        approachNote: asStringOrEmpty(item.approachNote, ''),
        path: safePath,
        ...(item.isDedicatedPage ? { isDedicatedPage: true } : {}),
        shotDescription: asStringOrEmpty(item.shotDescription, fallbackMatch?.shotDescription ?? name),
        gradientVariant:
          typeof item.gradientVariant === 'number' && Number.isFinite(item.gradientVariant)
            ? Math.max(0, Math.floor(item.gradientVariant))
            : idx % 9,
        ...(fallbackMatch?.image ? { image: fallbackMatch.image } : {}),
      };
    })
    .filter((item): item is IndustryItem => item !== null);

  return {
    copy: {
      eyebrow: asNonEmptyString(copyObj.eyebrow, fallback.copy.eyebrow),
      headline: asNonEmptyString(copyObj.headline, fallback.copy.headline),
      lead: asNonEmptyString(copyObj.lead, fallback.copy.lead),
      philosophyNote: asNonEmptyString(copyObj.philosophyNote, fallback.copy.philosophyNote),
      caseStudiesPlaceholderTitle: asNonEmptyString(
        copyObj.caseStudiesPlaceholderTitle,
        fallback.copy.caseStudiesPlaceholderTitle
      ),
      caseStudiesPlaceholderBody: asNonEmptyString(
        copyObj.caseStudiesPlaceholderBody,
        fallback.copy.caseStudiesPlaceholderBody
      ),
    },
    items: items.length > 0 ? items : fallback.items,
  };
}

export function validateSiteSettingsInput(value: SiteSettingsContent): Record<string, string> {
  const errors: Record<string, string> = {};
  const email = (value.contact.email ?? '').trim();
  const phone = (value.contact.phone ?? '').trim();
  const baseUrl = value.baseUrl.trim();

  if (email && !EMAIL_PATTERN.test(email)) {
    errors['contact.email'] = 'Enter a valid email address (for example, hello@digitalfield.co).';
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    errors['contact.phone'] = 'Enter a valid phone number (6–32 digits or +/spaces/parentheses).';
  }
  if (baseUrl && !sanitizeExternalUrl(baseUrl)) {
    errors['baseUrl'] = 'Production Base URL must begin with https:// or http://.';
  }

  value.contact.socialLinks.forEach((link, idx) => {
    if (!link.label.trim()) {
      errors[`contact.socialLinks.${idx}.label`] = 'Platform label is required.';
    }
    if (!sanitizeExternalUrl(link.url)) {
      errors[`contact.socialLinks.${idx}.url`] = 'URL must begin with https:// or http://.';
    }
  });

  return errors;
}

export function validatePortfolioDraft(input: {
  title: string;
  discipline: string;
  externalUrl: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title.trim()) {
    errors.title = 'Project title is required.';
  } else if (input.title.trim().length > 160) {
    errors.title = 'Project title must be 160 characters or fewer.';
  }

  if (!input.discipline.trim()) {
    errors.discipline = 'Select a discipline.';
  }

  if (input.externalUrl.trim() && !sanitizeExternalUrl(input.externalUrl)) {
    errors.externalUrl = 'External link must begin with https:// or http://.';
  }

  return errors;
}

export function mapPortfolioRow(row: Record<string, unknown>): PortfolioItem {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    client: String(row.client ?? ''),
    discipline: String(row.discipline ?? ''),
    description: String(row.description ?? ''),
    imagePath: String(row.image_path ?? ''),
    externalUrl: row.external_url ? sanitizeExternalUrl(String(row.external_url)) : null,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 0,
    published: Boolean(row.published),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
    updatedBy: row.updated_by ? String(row.updated_by) : null,
  };
}

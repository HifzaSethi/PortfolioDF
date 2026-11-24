import type {
  IndustryItem,
  PerformanceSection,
  SearchDiscipline,
  StudioDiscipline,
} from './content';

export type ContentKey =
  | 'site_settings'
  | 'performance_marketing'
  | 'search_intelligence'
  | 'studio'
  | 'industries';

export type ContentStatus = 'draft' | 'published';

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettingsContent {
  baseUrl: string;
  contact: {
    email: string | null;
    phone: string | null;
    socialLinks: SocialLink[];
  };
}

export interface PerformanceMarketingContent {
  lead: {
    lead: string;
    principle: string;
    closingNote: string;
    disclaimer: string;
  };
  sections: PerformanceSection[];
}

export interface SearchIntelligenceContent {
  copy: {
    lead: string;
    context: string;
    impact: string;
    closingLine: string;
    note: string;
  };
  measurementVocabulary: string[];
  disciplines: SearchDiscipline[];
}

export interface StudioContent {
  copy: {
    tagline: string;
    contrastClaim: string;
    contrastReframe: string;
    lead: string;
    keyMessage: string;
    loopIntro: string;
    loopSteps: string[];
    loopClosing: string;
    brandDirectionNote: string;
    portfolioNotice: string;
  };
  disciplines: StudioDiscipline[];
}

export interface IndustriesContent {
  copy: {
    eyebrow: string;
    headline: string;
    lead: string;
    philosophyNote: string;
    caseStudiesPlaceholderTitle: string;
    caseStudiesPlaceholderBody: string;
  };
  items: IndustryItem[];
}

export interface ContentBundle {
  siteSettings: SiteSettingsContent;
  performanceMarketing: PerformanceMarketingContent;
  searchIntelligence: SearchIntelligenceContent;
  studio: StudioContent;
  industries: IndustriesContent;
}

export interface SiteContentRecord<T = unknown> {
  id?: string;
  key: ContentKey;
  value: T;
  status: ContentStatus;
  updatedAt: string;
  updatedBy: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  discipline: string;
  description: string;
  imagePath: string;
  externalUrl: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

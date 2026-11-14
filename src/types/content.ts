export interface NavItem {
  label: string;
  path: string;
  description?: string;
  children?: NavItem[];
}

export interface CoreValue {
  id: string;
  number: string;
  title: string;
  summary: string;
  detail: string;
  timeline?: Array<{
    stage: 'NOW' | 'NEXT' | 'THEN' | 'FUTURE';
    action: string;
  }>;
}

export interface FieldMeaning {
  aspect: string;
  title: string;
  description: string;
}

export interface EcosystemNode {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  summary: string;
  items: string[];
  closingLine: string;
  linkTo?: {
    label: string;
    path: string;
  };
}

export interface IntelligenceStage {
  id: 'data' | 'context' | 'intelligence' | 'action';
  label: string;
  question: string;
  explanation: string;
}

export interface PracticeSummary {
  id: string;
  slug: string;
  path: string;
  name: string;
  roleLabel: string;
  tagline: string;
  summary: string;
  keyServices: string[];
  isCore?: boolean;
  isCreativeArm?: boolean;
}

export interface IntelligenceServiceItem {
  id: string;
  title: string;
  outcome: string;
}

export interface PerformanceSection {
  id: string;
  title: string;
  summary: string;
  items?: string[];
  subBlocks?: Array<{
    id: string;
    title: string;
    summary: string;
    items: string[];
  }>;
}

export interface SearchDiscipline {
  id: 'seo' | 'aeo' | 'aio' | 'geo' | 'gaio' | 'axo';
  acronym: 'SEO' | 'AEO' | 'AIO' | 'GEO' | 'GAIO' | 'AXO';
  fullName: string;
  tagline: string;
  explanation: string;
  whereItShowsUp: string;
  deliverables: string[];
  relatedLink?: {
    label: string;
    path: string;
  };
}

export interface GrowthStage {
  id: 'acquire' | 'convert' | 'engage' | 'retain' | 'learn';
  stage: string;
  groups: Array<{
    title: string;
    services: string[];
  }>;
}

export interface TransformationGroup {
  id: string;
  title: string;
  summary: string;
  items: string[];
  connectedNodeIds: string[];
}

export interface StudioDiscipline {
  id: string;
  title: string;
  tagline: string;
  description: string;
  shotDescription: string;
  altText: string;
  aspectRatio: '16/9' | '4/3' | '3/4' | '1/1';
  subServices: string[];
  disclosureNote?: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  approachNote: string;
  path: string;
  isDedicatedPage?: boolean;
}

export type HospitalityDimensionId = 'demand' | 'distribution' | 'commercial' | 'experience';

export interface HospitalityDimension {
  id: HospitalityDimensionId;
  title: string;
  summary: string;
  metrics: string[];
}

export interface HospitalityTouchpoint {
  id: string;
  name: string;
  dimension: HospitalityDimensionId;
  contribution: string;
}

export interface RouteMeta {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article';
  breadcrumbs?: Array<{
    name: string;
    path: string;
  }>;
}

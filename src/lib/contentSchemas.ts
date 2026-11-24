import type { ContentKey } from '../types/cms';

export type FieldType =
  | 'string'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'url'
  | 'boolean'
  | 'select'
  | 'stringList'
  | 'object'
  | 'objectList';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  rows?: number;
  options?: Array<{ label: string; value: string }>;
  itemLabelKey?: string;
  fields?: FieldSchema[];
  createEmptyItem?: () => unknown;
}

export interface ModuleSchema {
  key: ContentKey;
  title: string;
  description: string;
  livePath: string;
  liveLabel: string;
  fields: FieldSchema[];
}

export const SITE_SETTINGS_SCHEMA: ModuleSchema = {
  key: 'site_settings',
  title: 'Site Settings & Contact',
  description:
    'Public email, phone, social links, and production base URL. Footer and Contact rows appear only when populated.',
  livePath: '/contact',
  liveLabel: 'View Contact Page',
  fields: [
    {
      key: 'baseUrl',
      label: 'Production Base URL',
      type: 'url',
      placeholder: 'https://digitalfield.co',
      hint: 'Used for canonical URLs and Organization / Breadcrumb Schema.org JSON-LD.',
    },
    {
      key: 'contact',
      label: 'Public Contact & Social',
      type: 'object',
      fields: [
        {
          key: 'email',
          label: 'Contact Email',
          type: 'email',
          placeholder: 'hello@digitalfield.co',
          hint: 'Leave blank to hide the email row in Footer and Contact.',
        },
        {
          key: 'phone',
          label: 'Contact Phone',
          type: 'phone',
          placeholder: '+971 4 000 0000',
          hint: 'Leave blank to hide the phone row in Footer and Contact.',
        },
        {
          key: 'socialLinks',
          label: 'Social Links',
          type: 'objectList',
          itemLabelKey: 'label',
          createEmptyItem: () => ({ label: 'LinkedIn', url: 'https://' }),
          fields: [
            {
              key: 'label',
              label: 'Platform Label',
              type: 'string',
              required: true,
              placeholder: 'LinkedIn',
            },
            {
              key: 'url',
              label: 'Profile URL',
              type: 'url',
              required: true,
              placeholder: 'https://www.linkedin.com/company/digital-field',
            },
          ],
        },
      ],
    },
  ],
};

export const PERFORMANCE_MARKETING_SCHEMA: ModuleSchema = {
  key: 'performance_marketing',
  title: 'Performance Marketing',
  description:
    'Edit lead copy, channel sections, items, and hospitality media sub-blocks.',
  livePath: '/services/performance-marketing',
  liveLabel: 'View Performance Marketing',
  fields: [
    {
      key: 'lead',
      label: 'Practice Framing Copy',
      type: 'object',
      fields: [
        { key: 'lead', label: 'Hero Lead Statement', type: 'textarea', required: true, rows: 3 },
        { key: 'principle', label: 'Core Principle', type: 'string', required: true },
        { key: 'closingNote', label: 'Closing Statement', type: 'string', required: true },
        { key: 'disclaimer', label: 'Channel Disclaimer', type: 'textarea', rows: 2 },
      ],
    },
    {
      key: 'sections',
      label: 'Channel Practice Sections',
      type: 'objectList',
      itemLabelKey: 'title',
      createEmptyItem: () => ({
        id: `section-${Date.now()}`,
        title: 'New Channel Section',
        summary: '',
        items: [],
      }),
      fields: [
        { key: 'id', label: 'Section Anchor ID', type: 'string', required: true },
        { key: 'title', label: 'Section Title', type: 'string', required: true },
        { key: 'summary', label: 'Section Summary', type: 'textarea', rows: 3 },
        {
          key: 'items',
          label: 'Channel Items',
          type: 'stringList',
          hint: 'Branded items in Paid Social and Additional Media Channels retain their brand tiles automatically.',
        },
        {
          key: 'subBlocks',
          label: 'Nested Sub-Blocks (Optional)',
          type: 'objectList',
          itemLabelKey: 'title',
          createEmptyItem: () => ({
            id: `sub-${Date.now()}`,
            title: 'New Sub-Block',
            summary: '',
            items: [],
          }),
          fields: [
            { key: 'id', label: 'Sub-Block ID', type: 'string', required: true },
            { key: 'title', label: 'Title', type: 'string', required: true },
            { key: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
            { key: 'items', label: 'Items', type: 'stringList' },
          ],
        },
      ],
    },
  ],
};

export const SEARCH_INTELLIGENCE_SCHEMA: ModuleSchema = {
  key: 'search_intelligence',
  title: 'Search Intelligence',
  description:
    'Edit overview copy, measurement vocabulary, and Search Intelligence disciplines (updates JSON-LD automatically).',
  livePath: '/services/search-intelligence',
  liveLabel: 'View Search Intelligence',
  fields: [
    {
      key: 'copy',
      label: 'Overview Copy',
      type: 'object',
      fields: [
        { key: 'lead', label: 'Hero Lead', type: 'textarea', required: true, rows: 3 },
        { key: 'context', label: 'Context Intro', type: 'textarea', required: true, rows: 2 },
        { key: 'impact', label: 'Core Principle', type: 'string', required: true },
        { key: 'closingLine', label: 'Closing Statement', type: 'string', required: true },
        { key: 'note', label: 'Platform Reference Note', type: 'textarea', rows: 2 },
      ],
    },
    {
      key: 'measurementVocabulary',
      label: 'Measurement Vocabulary',
      type: 'stringList',
    },
    {
      key: 'disciplines',
      label: 'Search Disciplines',
      type: 'objectList',
      itemLabelKey: 'acronym',
      createEmptyItem: () => ({
        id: `disc-${Date.now()}`,
        acronym: 'NEW',
        fullName: 'New Search Discipline',
        tagline: '',
        explanation: '',
        whereItShowsUp: '',
        deliverables: [],
      }),
      fields: [
        { key: 'id', label: 'Discipline ID (URL slug)', type: 'string', required: true },
        { key: 'acronym', label: 'Acronym', type: 'string', required: true },
        { key: 'fullName', label: 'Full Name', type: 'string', required: true },
        { key: 'tagline', label: 'Tagline', type: 'string', required: true },
        { key: 'explanation', label: 'Explanation', type: 'textarea', required: true, rows: 3 },
        { key: 'whereItShowsUp', label: 'Where It Shows Up', type: 'textarea', rows: 2 },
        { key: 'deliverables', label: 'Deliverables', type: 'stringList' },
      ],
    },
  ],
};

export const STUDIO_SCHEMA: ModuleSchema = {
  key: 'studio',
  title: 'DF. Studio',
  description:
    'Edit Studio framing copy, Brief-to-Result loop, and production disciplines.',
  livePath: '/studio',
  liveLabel: 'View DF. Studio',
  fields: [
    {
      key: 'copy',
      label: 'Studio Copy',
      type: 'object',
      fields: [
        { key: 'tagline', label: 'Tagline', type: 'string', required: true },
        { key: 'contrastClaim', label: 'Contrast Lead', type: 'string', required: true },
        { key: 'contrastReframe', label: 'Contrast Reframe', type: 'string', required: true },
        { key: 'lead', label: 'Hero Lead', type: 'textarea', required: true, rows: 3 },
        { key: 'keyMessage', label: 'Key Principle', type: 'string', required: true },
        { key: 'loopIntro', label: 'Loop Section Label', type: 'string', required: true },
        { key: 'loopSteps', label: 'Loop Steps', type: 'stringList' },
        { key: 'loopClosing', label: 'Loop Closing Note', type: 'textarea', rows: 2 },
        { key: 'brandDirectionNote', label: 'Brand Direction Note', type: 'textarea', rows: 2 },
        {
          key: 'portfolioNotice',
          label: 'Default Portfolio Notice (shown only when 0 published work items exist)',
          type: 'string',
        },
      ],
    },
    {
      key: 'disciplines',
      label: 'Production Disciplines',
      type: 'objectList',
      itemLabelKey: 'title',
      createEmptyItem: () => ({
        id: `studio-${Date.now()}`,
        title: 'New Discipline',
        tagline: '',
        description: '',
        shotDescription: 'Creative production scene',
        altText: 'DF. Studio creative direction',
        aspectRatio: '4/3',
        subServices: [],
      }),
      fields: [
        { key: 'id', label: 'Discipline ID', type: 'string', required: true },
        { key: 'title', label: 'Title', type: 'string', required: true },
        { key: 'tagline', label: 'Tagline', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { key: 'shotDescription', label: 'Visual Frame Caption', type: 'string' },
        { key: 'altText', label: 'Image Alt Text', type: 'string' },
        {
          key: 'aspectRatio',
          label: 'Frame Aspect Ratio',
          type: 'select',
          options: [
            { label: '4:3 Landscape', value: '4/3' },
            { label: '16:9 Widescreen', value: '16/9' },
            { label: '3:4 Portrait', value: '3/4' },
            { label: '1:1 Square', value: '1/1' },
          ],
        },
        { key: 'subServices', label: 'Sub-Services', type: 'stringList' },
        { key: 'disclosureNote', label: 'Disclosure Note (Optional)', type: 'string' },
      ],
    },
  ],
};

export const INDUSTRIES_SCHEMA: ModuleSchema = {
  key: 'industries',
  title: 'Industries',
  description:
    'Edit Industries hero copy, case studies briefing note, and commercial sectors.',
  livePath: '/industries',
  liveLabel: 'View Industries',
  fields: [
    {
      key: 'copy',
      label: 'Industries Overview Copy',
      type: 'object',
      fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'string', required: true },
        { key: 'headline', label: 'Hero Headline', type: 'string', required: true },
        { key: 'lead', label: 'Hero Lead', type: 'textarea', required: true, rows: 3 },
        { key: 'philosophyNote', label: 'Core Principle', type: 'string', required: true },
        {
          key: 'caseStudiesPlaceholderTitle',
          label: 'Case Studies Band Heading',
          type: 'string',
          required: true,
        },
        {
          key: 'caseStudiesPlaceholderBody',
          label: 'Case Studies Band Body',
          type: 'textarea',
          required: true,
          rows: 3,
        },
      ],
    },
    {
      key: 'items',
      label: 'Sector List',
      type: 'objectList',
      itemLabelKey: 'name',
      createEmptyItem: () => ({
        id: `industry-${Date.now()}`,
        name: 'New Sector',
        approachNote: '',
        path: '/contact',
        isDedicatedPage: false,
        shotDescription: 'Commercial sector environment',
        gradientVariant: 0,
      }),
      fields: [
        { key: 'id', label: 'Sector ID', type: 'string', required: true },
        { key: 'name', label: 'Sector Name', type: 'string', required: true },
        { key: 'approachNote', label: 'Approach Summary', type: 'textarea', required: true, rows: 3 },
        { key: 'path', label: 'Link Path (e.g. /hospitality or /contact?...)', type: 'string', required: true },
        { key: 'isDedicatedPage', label: 'Has Dedicated Sector Page', type: 'boolean' },
        { key: 'shotDescription', label: 'Visual Stage Brief', type: 'string' },
      ],
    },
  ],
};

export const MODULE_SCHEMAS: Record<ContentKey, ModuleSchema> = {
  site_settings: SITE_SETTINGS_SCHEMA,
  performance_marketing: PERFORMANCE_MARKETING_SCHEMA,
  search_intelligence: SEARCH_INTELLIGENCE_SCHEMA,
  studio: STUDIO_SCHEMA,
  industries: INDUSTRIES_SCHEMA,
};

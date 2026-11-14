import type { PracticeSummary } from '../types/content';

export const PRACTICES: PracticeSummary[] = [
  {
    id: 'intelligence',
    slug: 'intelligence',
    path: '/services/intelligence',
    name: 'Intelligence',
    roleLabel: 'The Core',
    tagline: 'Data becomes intelligence only when it drives action.',
    summary:
      'The core of everything DF. does. Intelligence connects signals across media, search, brand, technology, and revenue into one connected decision-making system.',
    keyServices: [
      'Business Intelligence & Dashboards',
      'Cross-Channel Performance Intelligence',
      'Unified Reporting & Attribution',
      'Customer & Revenue Intelligence',
    ],
    isCore: true,
  },
  {
    id: 'performance-marketing',
    slug: 'performance-marketing',
    path: '/services/performance-marketing',
    name: 'Performance Marketing',
    roleLabel: 'How DF. Acts · Paid Activation',
    tagline: 'Channels are activation tools, not the strategy itself.',
    summary:
      'Media strategies that start with the business objective to maximize visibility, acquisitions, leads, bookings, and revenue across paid digital channels.',
    keyServices: [
      'Paid Media Management',
      'Google Ads & Paid Social',
      'Hospitality Metasearch, OTAs & GDS',
      'Conversion & ROAS Optimization',
    ],
  },
  {
    id: 'search-intelligence',
    slug: 'search-intelligence',
    path: '/services/search-intelligence',
    name: 'Search Intelligence',
    roleLabel: 'How DF. Acts · Discoverability',
    tagline: 'From ranking to recommendation to reservation.',
    summary:
      'Increase discoverability across search engines, AI assistants, and AI booking agents by combining SEO, AEO, AIO, GEO, GAIO, and AXO.',
    keyServices: [
      'SEO & AEO Answer Optimization',
      'AIO & GEO AI Citations',
      'GAIO Brand Perception',
      'AXO Agent Readiness',
    ],
  },
  {
    id: 'growth-marketing',
    slug: 'growth-marketing',
    path: '/services/growth-marketing',
    name: 'Growth Marketing',
    roleLabel: 'How DF. Acts · Lifecycle & LTV',
    tagline: 'Continuous experimentation across the full customer journey.',
    summary:
      'Accelerate acquisition, funnel conversion, lifecycle engagement, retention, and customer lifetime value through experimentation and automation.',
    keyServices: [
      'Go-to-Market & Acquisition Programs',
      'Funnel Design & CRO',
      'CRM, Email, SMS & WhatsApp Lifecycle',
      'Retention, Loyalty & Experimentation',
    ],
  },
  {
    id: 'digital-transformation',
    slug: 'digital-transformation',
    path: '/services/digital-transformation',
    name: 'Digital Transformation',
    roleLabel: 'How DF. Acts · Connected Systems',
    tagline: 'Technology that connects the field.',
    summary:
      'Modernize operations, customer experiences, and MarTech infrastructure so every platform, data source, and team works toward the same objective.',
    keyServices: [
      'Digital Strategy & Roadmaps',
      'CX, Web & E-Commerce Modernization',
      'CRM, CDP & MarTech Integration',
      'AI Adoption & Workflow Automation',
    ],
  },
];

export const STUDIO_PRACTICE_SUMMARY: PracticeSummary = {
  id: 'studio',
  slug: 'studio',
  path: '/studio',
  name: 'DF. Studio',
  roleLabel: 'How DF. Shows Up · Creative & Production',
  tagline: 'Content in Context.',
  summary:
    'The creative and production arm of DF. Briefed from business objectives and intelligence signals, and measured by bookings, leads, and revenue.',
  keyServices: [
    'Copywriting (EN & AR)',
    'Photography & Videography',
    'Graphic Design & Motion Graphics',
    'Governed AI Content Production',
  ],
  isCreativeArm: true,
};

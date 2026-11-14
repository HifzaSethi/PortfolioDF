import type { NavItem } from '../types/content';

export const PRIMARY_NAV: NavItem[] = [
  {
    label: 'About',
    path: '/about',
    description: 'Positioning, five core values, the name, and why nothing performs in isolation.',
  },
  {
    label: 'Services',
    path: '/services',
    description: 'Intelligence at the core, four connected practices, and DF. Studio.',
    children: [
      {
        label: 'Services Overview',
        path: '/services',
        description: 'How the five practices and DF. Studio form one growth ecosystem.',
      },
      {
        label: 'Intelligence',
        path: '/services/intelligence',
        description: 'The core system turning activity across every channel into decisions.',
      },
      {
        label: 'Performance Marketing',
        path: '/services/performance-marketing',
        description: 'Paid media, Google Ads, Paid Social, Hospitality distribution, and CRO.',
      },
      {
        label: 'Search Intelligence',
        path: '/services/search-intelligence',
        description: 'Discoverability across SEO, AEO, AIO, GEO, GAIO, and AXO.',
      },
      {
        label: 'Growth Marketing',
        path: '/services/growth-marketing',
        description: 'Full-lifecycle acquisition, conversion, retention, and experimentation.',
      },
      {
        label: 'Digital Transformation',
        path: '/services/digital-transformation',
        description: 'Technology, MarTech, CRM, AI automation, and connected systems.',
      },
    ],
  },
  {
    label: 'Studio',
    path: '/studio',
    description: 'Content in Context: copywriting, photography, video, design, motion, and AI content.',
  },
  {
    label: 'Industries',
    path: '/industries',
    description: 'Nine commercial sectors navigated through Performance in Context.',
  },
  {
    label: 'Hospitality',
    path: '/hospitality',
    description: 'Core hospitality expertise across demand, distribution, commercial, and CX.',
  },
];

export const HEADER_CTA: NavItem = {
  label: 'Start a conversation',
  path: '/contact',
};

export const FOOTER_COMPANY_LINKS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About / Our Approach', path: '/about' },
  { label: 'Services Overview', path: '/services' },
  { label: 'DF. Studio', path: '/studio' },
  { label: 'Industries', path: '/industries' },
  { label: 'Hospitality', path: '/hospitality' },
  { label: 'Contact', path: '/contact' },
];

export const FOOTER_PRACTICE_LINKS: NavItem[] = [
  { label: 'Intelligence (Core)', path: '/services/intelligence' },
  { label: 'Performance Marketing', path: '/services/performance-marketing' },
  { label: 'Search Intelligence', path: '/services/search-intelligence' },
  { label: 'Growth Marketing', path: '/services/growth-marketing' },
  { label: 'Digital Transformation', path: '/services/digital-transformation' },
];

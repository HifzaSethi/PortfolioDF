import type { RouteMeta } from '../types/content';

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'Digital Field. (DF.) — Performance in Context',
    description:
      'Digital Field. (DF.) is a Digital Performance & Intelligence Consultancy connecting brand, search, media, technology, content, and data into growth.',
    canonicalPath: '/',
    ogType: 'website',
  },
  '/about': {
    title: 'About & Approach | Digital Field. (DF.)',
    description:
      'Founded in 2021 by Islam Helal in Dubai. Explore our five core values, the Digital Ecosystem Framework, and why reporting is not intelligence.',
    canonicalPath: '/about',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  '/services': {
    title: 'Consultancy Practices & Services | Digital Field.',
    description:
      'Intelligence at the core, four activation and transformation practices, and DF. Studio for creative production in context.',
    canonicalPath: '/services',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ],
  },
  '/services/intelligence': {
    title: 'Intelligence Practice | Digital Field. (DF.)',
    description:
      'The core of DF.: Data, Context, Intelligence, Action. Turn disconnected analytics into unified commercial decisions.',
    canonicalPath: '/services/intelligence',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Intelligence', path: '/services/intelligence' },
    ],
  },
  '/services/performance-marketing': {
    title: 'Performance Marketing | Digital Field. (DF.)',
    description:
      'Objective-led paid media across Google Ads, Paid Social, Metasearch, OTAs, GDS, programmatic media, and conversion optimization.',
    canonicalPath: '/services/performance-marketing',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Performance Marketing', path: '/services/performance-marketing' },
    ],
  },
  '/services/search-intelligence': {
    title: 'Search Intelligence: SEO, AEO, AIO, GEO, GAIO, AXO | DF.',
    description:
      'Increase discoverability across search engines, Google AI Overviews, AI assistants, and booking agents with six distinct search disciplines.',
    canonicalPath: '/services/search-intelligence',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Search Intelligence', path: '/services/search-intelligence' },
    ],
  },
  '/services/growth-marketing': {
    title: 'Growth Marketing | Digital Field. (DF.)',
    description:
      'Accelerate customer acquisition, funnel conversion, lifecycle engagement, retention, and lifetime value through continuous experimentation.',
    canonicalPath: '/services/growth-marketing',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Growth Marketing', path: '/services/growth-marketing' },
    ],
  },
  '/services/digital-transformation': {
    title: 'Digital Transformation | Digital Field. (DF.)',
    description:
      'Technology that connects the field: strategy roadmaps, CX modernization, CRM and CDP ecosystems, AI automation, and governance.',
    canonicalPath: '/services/digital-transformation',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Digital Transformation', path: '/services/digital-transformation' },
    ],
  },
  '/studio': {
    title: 'DF. Studio — Content in Context | Digital Field.',
    description:
      'Copywriting, photography, videography, graphic design, motion graphics, and AI content briefed by intelligence and judged on commercial outcomes.',
    canonicalPath: '/studio',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'DF. Studio', path: '/studio' },
    ],
  },
  '/industries': {
    title: 'Industries | Digital Field. (DF.)',
    description:
      'Applying Performance in Context across hospitality, travel, F&B, luxury, real estate, retail, healthcare, financial services, and public sector.',
    canonicalPath: '/industries',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries' },
    ],
  },
  '/hospitality': {
    title: 'Hospitality Performance | Digital Field. (DF.)',
    description:
      'Built for hospitality performance across 14 ecosystem touchpoints, linking demand, distribution, commercial outcomes, and guest experience.',
    canonicalPath: '/hospitality',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Industries', path: '/industries' },
      { name: 'Hospitality', path: '/hospitality' },
    ],
  },
  '/contact': {
    title: 'Start a Conversation | Digital Field. (DF.)',
    description:
      'What is the business trying to achieve? Share your objective and context to start a conversation with Digital Field.',
    canonicalPath: '/contact',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ],
  },
  '/404': {
    title: 'Page Not Found | Digital Field. (DF.)',
    description: 'The requested route could not be found. Return to Digital Field.',
    canonicalPath: '/404',
  },
};

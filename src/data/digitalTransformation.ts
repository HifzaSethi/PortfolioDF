import type { TransformationGroup } from '../types/content';

export const DIGITAL_TRANSFORMATION_COPY = {
  tagline: 'Technology that connects the field.',
  contrastClaim: 'Most transformation projects ask which system to buy.',
  contrastReframe: 'DF. asks what the business needs that system to do.',
  lead: 'Enable business growth through technology, automation, data, and AI; modernize operations, improve customer experiences, and build digital ecosystems where every platform, data source, and team works toward the same objective.',
  closing: "Systems don't transform a business. Connected systems do.",
};

export const TRANSFORMATION_GROUPS: TransformationGroup[] = [
  {
    id: 'strategy-roadmaps',
    title: 'Strategy & Roadmaps',
    summary: 'Align architecture, operating models, and commercial priorities before selecting tools.',
    items: [
      'Digital Strategy & Roadmaps',
      'Operating Model Transformation',
      'Innovation & Pilot Programs',
      'Digital Sales Enablement',
    ],
    connectedNodeIds: ['strategy', 'operations', 'commercial'],
  },
  {
    id: 'cx-digital-products',
    title: 'Customer Experience & Digital Products',
    summary: 'Modernize websites, applications, and booking journeys where traffic turns into revenue.',
    items: [
      'Customer Experience (CX) Transformation',
      'Website, App & E-Commerce Modernization',
      'Digital Product Design',
      'Personalization',
    ],
    connectedNodeIds: ['cx', 'web', 'commercial'],
  },
  {
    id: 'data-crm-martech',
    title: 'Data, CRM & MarTech',
    summary: 'Connect customer, content, and commercial systems into one unified source of signal.',
    items: [
      'CRM Implementation & Optimization',
      'Customer Data Platforms (CDP)',
      'Marketing Technology (MarTech) Integration',
      'System Integration (ERP, CMS, CRM)',
      'API & Connected Ecosystems',
      'Cloud & Platform Migration',
    ],
    connectedNodeIds: ['crm', 'cdp', 'api', 'data'],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    summary: 'Embed practical automation and workplace intelligence across daily execution.',
    items: [
      'AI Adoption & Automation',
      'Workflow Digitization',
      'Digital Workplace Tools',
    ],
    connectedNodeIds: ['ai', 'operations', 'data'],
  },
  {
    id: 'change-governance',
    title: 'Change & Governance',
    summary: 'Ensure teams adopt connected workflows securely and consistently over time.',
    items: [
      'Change Management & Training',
      'Cybersecurity & Compliance Support',
    ],
    connectedNodeIds: ['teams', 'operations', 'strategy'],
  },
];

export const TRANSFORMATION_SYSTEM_NODES = [
  { id: 'strategy', label: 'Business Strategy' },
  { id: 'cx', label: 'Customer Experience' },
  { id: 'web', label: 'Web & Commerce' },
  { id: 'crm', label: 'CRM' },
  { id: 'cdp', label: 'CDP' },
  { id: 'api', label: 'APIs & ERP / CMS' },
  { id: 'data', label: 'Unified Data' },
  { id: 'ai', label: 'AI & Workflows' },
  { id: 'operations', label: 'Operating Model' },
  { id: 'teams', label: 'Teams & Governance' },
  { id: 'commercial', label: 'Commercial Growth' },
];

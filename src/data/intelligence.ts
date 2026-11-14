import type { IntelligenceServiceItem, IntelligenceStage } from '../types/content';

export const INTELLIGENCE_STAGES: IntelligenceStage[] = [
  {
    id: 'data',
    label: 'DATA',
    question: 'What happened?',
    explanation:
      'Unifying signals across analytics platforms, CRM, media channels, search intelligence, business activity, and revenue data into one reliable baseline.',
  },
  {
    id: 'context',
    label: 'CONTEXT',
    question: 'What influenced it?',
    explanation:
      'Examining pricing shifts, seasonality, PR coverage, search demand trends, content changes, customer sentiment, and offline forces acting on the field.',
  },
  {
    id: 'intelligence',
    label: 'INTELLIGENCE',
    question: 'Why did it happen?',
    explanation:
      'Connecting disparate metrics across teams and touchpoints to uncover the true commercial drivers behind every change in performance.',
  },
  {
    id: 'action',
    label: 'ACTION',
    question: 'What should happen next?',
    explanation:
      'Translating insight into prioritized media, search, creative, technology, and commercial decisions aligned to business objectives.',
  },
];

export const REPORTING_VS_INTELLIGENCE = {
  lead: 'Most agencies provide reporting. DF. provides intelligence.',
  metricsNote:
    'Metrics like clicks, impressions, traffic, engagement, CPC, CTR, and conversions explain what happened. They rarely explain why.',
  reporting: {
    title: 'Reporting',
    subtitle: 'Describes past activity',
    points: [
      'Tells you what happened',
      'Shows which campaign generated results',
      'Highlights which channel performed best',
      'Tracks where budget was spent',
    ],
  },
  intelligence: {
    title: 'Intelligence',
    subtitle: 'Guides commercial decisions',
    points: [
      'Explains why performance changed',
      'Identifies what factors influenced results',
      'Surfaces what opportunities exist',
      'Defines what actions should happen next',
      'Evaluates what impact the decision will have on the business',
    ],
  },
};

export const MODEL_COMPARISON = {
  traditional: {
    label: 'Traditional Agency Model',
    steps: ['Campaign', 'Metrics', 'Report'],
  },
  dfModel: {
    label: 'DF. Intelligence Model',
    steps: [
      'Business Objective',
      'Digital Ecosystem',
      'Data',
      'Context',
      'Intelligence',
      'Action',
      'Commercial Growth',
    ],
  },
};

export const DASHBOARD_CONTEXT_DATA = {
  title: 'Never Stop at the Dashboard',
  illustrativeLabel: 'Illustrative example',
  metricLabel: 'CTR',
  metricDelta: '↑ 12%',
  caption: 'Accurate. But incomplete.',
  supportingText:
    'A campaign may deliver strong results, but was the success driven by better targeting, stronger content, increased brand demand, pricing changes, PR coverage, seasonality, customer sentiment, market shifts, or external factors? Without context, optimization becomes guesswork.',
  questions: [
    'What changed around the campaign?',
    'Was there PR coverage?',
    'Did search demand shift?',
    'Did the content mix change?',
    'Was seasonality a factor?',
    'Did pricing change?',
    'Was product interest affected?',
    'Were offline activities influencing performance?',
  ],
};

export const INTELLIGENCE_SERVICES: IntelligenceServiceItem[] = [
  {
    id: 'bi-dashboards',
    title: 'Business Intelligence & Dashboards',
    outcome:
      'Connect commercial, media, and operational metrics into executive decision views built around business objectives.',
  },
  {
    id: 'data-strategy-governance',
    title: 'Data Strategy & Governance',
    outcome:
      'Establish clean taxonomy, tracking standards, and ownership across every measurement touchpoint.',
  },
  {
    id: 'cross-channel-intelligence',
    title: 'Cross-Channel Performance Intelligence',
    outcome:
      'Evaluate how search, paid media, content, pricing, and brand perception influence one another in market.',
  },
  {
    id: 'unified-reporting-attribution',
    title: 'Unified Reporting & Attribution',
    outcome:
      'Replace fragmented channel scorecards with connected contribution reporting tied to commercial outcomes.',
  },
  {
    id: 'predictive-trend-analysis',
    title: 'Predictive & Trend Analysis',
    outcome:
      'Spot shifts in category demand, booking windows, and consumer behavior before budget is misallocated.',
  },
  {
    id: 'competitive-market-intelligence',
    title: 'Competitive & Market Intelligence',
    outcome:
      'Track market movements, share of voice, and category positioning across search and AI surfaces.',
  },
  {
    id: 'customer-revenue-intelligence',
    title: 'Customer & Revenue Intelligence',
    outcome:
      'Link acquisition cohorts, retention patterns, and lifetime value directly back to channel investments.',
  },
  {
    id: 'ai-powered-insights',
    title: 'AI-Powered Insights & Automation',
    outcome:
      'Surface anomalies, emerging signal correlations, and decision prompts faster without manual reconciliation.',
  },
  {
    id: 'recurring-intelligence-reviews',
    title: 'Recurring Intelligence Reviews',
    outcome:
      'Structured executive reviews focused on what changed, why it moved, and what action follows next.',
  },
];

export const DATA_SOURCES_SINGLE_TRUTH = [
  'Analytics Platforms',
  'CRM Data',
  'Media Data',
  'Search Intelligence',
  'Business Data',
  'Revenue Data',
];

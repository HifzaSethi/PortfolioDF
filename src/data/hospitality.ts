import type { HospitalityDimension, HospitalityTouchpoint } from '../types/content';

export const HOSPITALITY_COPY = {
  tagline: 'Built for hospitality performance.',
  lead: 'Hospitality is one of the most complex digital ecosystems. Performance is influenced by far more than media spend alone: pricing, demand trends, distribution channels, search visibility, guest experience, review sentiment, seasonality, market conditions, brand strength, and competitive activity all shape commercial performance. DF. understands how these elements work together because hospitality is not just another industry vertical. It is one of our core areas of expertise.',
  whoWeServe: [
    'Hotels',
    'Resorts',
    'Serviced apartments',
    'Hospitality groups',
    'Destinations',
    'Travel brands',
  ],
  ecosystemMessage:
    'Each channel generates valuable data and contributes to commercial performance. DF. connects these signals into a single performance framework.',
  dimensionsCaption:
    'Because bookings are not driven by a single channel. They are influenced by the entire hospitality ecosystem.',
  whyChooseLead: 'DF. combines digital performance expertise with hospitality commercial understanding.',
  whyChooseClosing:
    'This allows us to move beyond channel management and help hospitality brands make smarter commercial decisions.',
  equationParts: [
    'Demand',
    'Visibility',
    'Distribution',
    'Guest Experience',
    'Commercial Strategy',
  ],
  equationResult: 'Revenue Growth',
};

export const HOSPITALITY_DIMENSIONS: HospitalityDimension[] = [
  {
    id: 'demand',
    title: 'DEMAND',
    summary: 'Understanding traveler intent and market shifts before setting media bids.',
    metrics: [
      'Destination search demand',
      'Market trends',
      'Traveler intent',
      'Source market behavior',
      'Competitor activity',
    ],
  },
  {
    id: 'distribution',
    title: 'DISTRIBUTION',
    summary: 'Balancing direct booking growth against third-party reach and acquisition cost.',
    metrics: [
      'Direct bookings',
      'OTA contribution',
      'Metasearch performance',
      'GDS effectiveness',
      'Channel profitability',
    ],
  },
  {
    id: 'commercial',
    title: 'COMMERCIAL',
    summary: 'Measuring every digital action by the property commercial metrics that matter.',
    metrics: [
      'Occupancy',
      'ADR',
      'RevPAR',
      'Revenue contribution',
      'Acquisition costs',
      'Profitability',
    ],
  },
  {
    id: 'experience',
    title: 'CUSTOMER EXPERIENCE',
    summary: 'Turning pre-stay impression, booking ease, and post-stay sentiment into repeat demand.',
    metrics: [
      'Guest reviews',
      'Reputation signals',
      'Website usability',
      'Booking experience',
      'Loyalty and retention',
    ],
  },
];

export const HOSPITALITY_TOUCHPOINTS: HospitalityTouchpoint[] = [
  {
    id: 'brand-website',
    name: 'Brand Website (brand.com)',
    dimension: 'commercial',
    contribution: 'Primary direct booking conversion hub, UX & UI performance, and ADR capture.',
  },
  {
    id: 'booking-engine',
    name: 'Booking Engine',
    dimension: 'distribution',
    contribution: 'Booking funnel efficiency, rate parity display, and AI booking agent readiness.',
  },
  {
    id: 'crm-loyalty',
    name: 'CRM & Loyalty Platforms',
    dimension: 'experience',
    contribution: 'Guest segmentation, repeat stays, retention programs, and lifetime value growth.',
  },
  {
    id: 'google-hotel-ads',
    name: 'Google Hotel Ads',
    dimension: 'distribution',
    contribution: 'High-intent rate comparison and direct booking share on Google surfaces.',
  },
  {
    id: 'otas',
    name: 'Online Travel Agencies (OTAs)',
    dimension: 'distribution',
    contribution: 'OTA visibility, ranking strength, market share, and billboard demand capture.',
  },
  {
    id: 'gds',
    name: 'Global Distribution Systems (GDS)',
    dimension: 'distribution',
    contribution: 'Travel agent, corporate travel buyer, and TMC distribution reach.',
  },
  {
    id: 'metasearch',
    name: 'Metasearch Platforms',
    dimension: 'distribution',
    contribution: 'Competitive rate visibility at the booking decision stage while lowering distribution costs.',
  },
  {
    id: 'search-engines',
    name: 'Search Engines',
    dimension: 'demand',
    contribution: 'Destination search demand, organic visibility, and traveler intent capture.',
  },
  {
    id: 'ai-assistants-agents',
    name: 'AI Assistants & Booking Agents',
    dimension: 'demand',
    contribution: 'AI recommendations (GEO), accurate property facts (GAIO), and agent-ready booking (AXO).',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    dimension: 'demand',
    contribution: 'Source market inspiration, audience signals, and demand generation.',
  },
  {
    id: 'content-visual-assets',
    name: 'Content & Visual Assets',
    dimension: 'experience',
    contribution: 'Property, room, and F&B imagery plus listing copy that shapes conversion before arrival.',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    dimension: 'experience',
    contribution: 'Pre-arrival upgrades, seasonal offers, and post-stay retention sequences.',
  },
  {
    id: 'reputation-reviews',
    name: 'Reputation & Reviews',
    dimension: 'experience',
    contribution: 'Guest sentiment signals influencing OTA conversion, AI perception, and brand strength.',
  },
  {
    id: 'revenue-management',
    name: 'Revenue Management Systems',
    dimension: 'commercial',
    contribution: 'Pricing competitiveness, occupancy targets, ADR, RevPAR, and channel profitability.',
  },
];

export const HOSPITALITY_OUTCOMES: string[] = [
  'Increase Direct Bookings',
  'Reduce Distribution Costs',
  'Improve Occupancy',
  'Increase ADR & RevPAR',
  'Improve OTA Visibility',
  'Grow Market Share',
  'Strengthen Brand Visibility',
  'Increase Guest Acquisition',
  'Improve Marketing Efficiency',
  'Maximize Revenue Contribution',
  'Be Found and Booked Through AI',
];

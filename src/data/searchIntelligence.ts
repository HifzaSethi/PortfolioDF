import type { SearchDiscipline } from '../types/content';

export const SEARCH_INTELLIGENCE_COPY = {
  lead: 'Increase discoverability across search engines, AI platforms, and AI agents by combining SEO, AEO, AIO, GEO, GAIO, and AXO, so the brand is visible wherever customers search.',
  context:
    'Customers search when intent is highest, on search engines, in AI assistants, and increasingly through AI agents that act on their behalf.',
  impact: 'Visibility wherever customers search directly affects business opportunities.',
  closingLine: 'From ranking to recommendation to reservation: visibility wherever the decision is made.',
  note: 'AI platforms and assistant names (Google, ChatGPT, Gemini, Claude, Perplexity, Copilot, Siri, Alexa, Google Assistant) are referenced descriptively as surfaces where brands must remain discoverable, without implied partnership.',
};

export const SEARCH_MEASUREMENT_VOCABULARY: string[] = [
  'Search Demand Trends',
  'Brand Search Volume',
  'SEO Performance',
  'Answer & Featured Snippet Visibility (AEO)',
  'Google AI Overviews Presence (AIO)',
  'AI Platform Citations & Recommendations (GEO)',
  'AI Brand Accuracy & Sentiment (GAIO)',
  'AI Agent Readiness (AXO)',
  'Competitor Share of Voice',
];

export const SEARCH_DISCIPLINES: SearchDiscipline[] = [
  {
    id: 'seo',
    acronym: 'SEO',
    fullName: 'Search Engine Optimization',
    tagline: 'Rank where customers search.',
    explanation:
      'Improve visibility, organic traffic, and rankings across search engines through technical, content, and authority optimization.',
    whereItShowsUp: 'Organic search results, map packs, and Google Business Profiles.',
    deliverables: [
      'Technical SEO Audits & Optimization',
      'Keyword & Search Demand Research',
      'Search Intent Analysis',
      'On-Page SEO Optimization',
      'Content Strategy & Content Gap Analysis',
      'Local SEO & Google Business Profile Optimization',
      'Schema & Structured Data Implementation',
      'Competitor Search Analysis',
      'Link Building & Digital PR',
      'Organic Performance Monitoring',
      'SEO Reporting & Insights',
    ],
  },
  {
    id: 'aeo',
    acronym: 'AEO',
    fullName: 'Answer Engine Optimization',
    tagline: 'Be the answer, not just a result.',
    explanation:
      'Structure content so search engines and voice assistants give the brand’s answer directly.',
    whereItShowsUp:
      'Featured Snippets, People Also Ask panels, and voice assistants (Siri, Alexa, Google Assistant).',
    deliverables: [
      'Featured Snippet Optimization',
      'People Also Ask Targeting',
      'Question & Conversational Query Research',
      'FAQ & Knowledge Content Creation',
      'Voice Search Optimization (Siri, Alexa, Google Assistant)',
      'Answer-First Content Structuring',
      'Zero-Click Visibility Measurement',
    ],
  },
  {
    id: 'aio',
    acronym: 'AIO',
    fullName: 'AI Overviews Optimization',
    tagline: "Be in Google's AI summary.",
    explanation:
      'Optimize for Google AI Overviews and AI Mode, where Google summarises the answer before any link is clicked.',
    whereItShowsUp: 'Google AI Overviews and Google AI Mode summaries above organic links.',
    deliverables: [
      'AI Overviews Visibility Tracking',
      'AI Mode Presence Analysis',
      'Source & Citation Eligibility Optimization',
      'Content Depth & Topical Authority',
      'Structured Data for AI Summaries',
      'AI Overview Click & Traffic Impact Measurement',
    ],
  },
  {
    id: 'geo',
    acronym: 'GEO',
    fullName: 'Generative Engine Optimization',
    tagline: 'Be cited and recommended by AI.',
    explanation:
      'Increase brand visibility in AI platforms such as ChatGPT, Gemini, Claude, Perplexity, and Copilot, so the brand is named when customers ask for a recommendation.',
    whereItShowsUp:
      'Conversational recommendations and cited answers in ChatGPT, Gemini, Claude, Perplexity, and Copilot.',
    deliverables: [
      'AI Search Visibility Strategy',
      'AI Prompt & Recommendation Research',
      'AI Citation & Brand Mention Monitoring',
      'Competitor Benchmarking in AI Answers',
      'AI-Ready Content Development',
      'Third-Party Source & Publisher Strategy',
      'Reputation & Review Optimization',
      'AI Share of Voice & Referral Measurement',
    ],
  },
  {
    id: 'gaio',
    acronym: 'GAIO',
    fullName: 'Generative AI Optimization',
    tagline: 'Shape what AI knows about you.',
    explanation:
      'Make sure AI models describe the brand accurately, completely, and favourably, from its facts and offers to its reputation.',
    whereItShowsUp:
      'Model brand summaries, entity knowledge graphs, Arabic and English AI narratives, and cited fact bases.',
    deliverables: [
      'AI Brand Perception Audits',
      'Entity Optimization & Knowledge Graph Presence',
      'Brand Fact Accuracy (Wikipedia, Wikidata, directories, listings)',
      'First-Party Data & Authoritative Source Development',
      'AI Sentiment & Brand Narrative Monitoring',
      'Misinformation & Hallucination Correction',
      'Arabic & English AI Brand Presence',
    ],
  },
  {
    id: 'axo',
    acronym: 'AXO',
    fullName: 'Agent Experience Optimization',
    tagline: 'Be bookable by AI agents.',
    explanation:
      'Prepare the website, booking engine, and data so AI agents can find, compare, and transact on the customer’s behalf.',
    whereItShowsUp:
      'Autonomous AI booking and shopping agents reading structured feeds, llms.txt, rates, availability, and checkout flows.',
    deliverables: [
      'Agent-Readable Site Architecture',
      'Structured Product, Room, Rate & Availability Data',
      'Booking Engine & Checkout Agent Readiness',
      'llms.txt & AI Crawler Access Management',
      'API & Feed Readiness for AI Platforms',
      'Agentic Commerce & Booking Testing',
      'AI Agent Traffic & Conversion Measurement',
    ],
    relatedLink: {
      label: 'See Hospitality AI Booking Readiness',
      path: '/hospitality',
    },
  },
];

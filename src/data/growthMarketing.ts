import type { GrowthStage } from '../types/content';

export const GROWTH_MARKETING_COPY = {
  lead: 'Accelerate customer acquisition, engagement, retention, and lifetime value through continuous experimentation, automation, and customer-centric growth strategies.',
  cxConnection: 'Customer experience influences acquisition efficiency and lifetime value.',
};

export const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 'acquire',
    stage: 'ACQUIRE',
    groups: [
      {
        title: 'Strategy and acquisition',
        services: [
          'Growth Strategy & Go-to-Market Planning',
          'Customer Acquisition Programs',
          'Audience Segmentation & Personas',
        ],
      },
      {
        title: 'Growth levers',
        services: [
          'Influencer & Partnership Growth',
          'Content-Led Growth Initiatives',
          'Product-Led Growth Strategies',
        ],
      },
    ],
  },
  {
    id: 'convert',
    stage: 'CONVERT',
    groups: [
      {
        title: 'Funnel and conversion',
        services: [
          'Funnel Design & Optimization',
          'Customer Journey Mapping',
          'Landing Page & CRO Optimization',
          'Lead Generation & Nurturing',
        ],
      },
    ],
  },
  {
    id: 'engage',
    stage: 'ENGAGE',
    groups: [
      {
        title: 'Engagement and lifecycle',
        services: [
          'CRM Strategy & Management',
          'Email Marketing & Automation',
          'SMS, WhatsApp & Push Messaging',
          'Product Onboarding Campaigns',
        ],
      },
    ],
  },
  {
    id: 'retain',
    stage: 'RETAIN',
    groups: [
      {
        title: 'Retention and loyalty',
        services: [
          'Retention & Win-Back Programs',
          'Churn Reduction Strategies',
          'Loyalty & Referral Programs',
          'Community Building',
        ],
      },
    ],
  },
  {
    id: 'learn',
    stage: 'LEARN',
    groups: [
      {
        title: 'Learning and value',
        services: [
          'Growth Experimentation & A/B Testing',
          'Customer Lifetime Value Optimization',
          'Analytics & Growth Reporting',
        ],
      },
    ],
  },
];

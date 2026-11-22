import type { IndustryItem } from '../types/content';

export const INDUSTRIES_COPY = {
  eyebrow: 'INDUSTRIES',
  headline: 'Nine sectors. One connected perspective.',
  lead: 'Every sector carries distinct demand cycles, buying journeys, and commercial pressures. DF. applies Performance in Context across each ecosystem — aligning objective, data, intelligence, and action.',
  philosophyNote: 'Business outcomes always take priority over vanity metrics.',
  caseStudiesPlaceholderTitle: 'Case studies: coming soon / to be supplied',
  caseStudiesPlaceholderBody:
    'Verified client case studies and commercial outcomes will be added here once approved for public release.',
};

export const INDUSTRIES: IndustryItem[] = [
  {
    id: 'hospitality',
    name: 'Hospitality: Hotels & Resorts',
    approachNote:
      'Connects demand signals, direct booking funnels, OTA and metasearch distribution, guest reviews, and revenue strategy into one commercial ecosystem.',
    path: '/hospitality',
    isDedicatedPage: true,
    shotDescription:
      'Modern hotel lobby, natural light, real guests, considered composition.',
    gradientVariant: 0,
    image: { src: null, alt: 'Hospitality: Hotels & Resorts editorial placeholder' },
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    approachNote:
      'Aligns destination search demand, seasonal booking windows, AI discovery, and multi-market acquisition around measurable traveler bookings.',
    path: '/contact?industry=Travel+%26+Tourism',
    shotDescription:
      'Sunlit airport terminal departure concourse, unhurried travelers, architectural daylight.',
    gradientVariant: 1,
    image: { src: null, alt: 'Travel & Tourism editorial placeholder' },
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    approachNote:
      'Links local search visibility, visual storytelling, delivery marketplace presence, and guest retention to drive footfall and repeat orders.',
    path: '/contact?industry=Food+%26+Beverage',
    shotDescription:
      'Contemporary dining room service counter, warm timber and ceramic textures, candid chef preparation.',
    gradientVariant: 2,
    image: { src: null, alt: 'Food & Beverage editorial placeholder' },
  },
  {
    id: 'lifestyle-luxury',
    name: 'Lifestyle & Luxury Brands',
    approachNote:
      'Protects brand perception across AI summaries, editorial creative, and high-intent search while turning consideration into commercial value.',
    path: '/contact?industry=Lifestyle+%26+Luxury+Brands',
    shotDescription:
      'Minimalist flagship boutique interior, sculpted stone display, soft diffused daylight.',
    gradientVariant: 3,
    image: { src: null, alt: 'Lifestyle & Luxury Brands editorial placeholder' },
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    approachNote:
      'Connects high-intent search demand, qualified lead nurturing, CRM intelligence, and architectural content to shorten sales cycles.',
    path: '/contact?industry=Real+Estate',
    shotDescription:
      'Residential development courtyard at golden hour, clean concrete lines, landscaped water reflection.',
    gradientVariant: 4,
    image: { src: null, alt: 'Real Estate editorial placeholder' },
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail & E-commerce',
    approachNote:
      'Unifies marketplace feeds, paid acquisition, agent-ready product data, conversion UX, and lifecycle CRM to improve margin and lifetime value.',
    path: '/contact?industry=Retail+%26+E-commerce',
    shotDescription:
      'Omnichannel fulfillment studio and merchandising table, tactile packaging materials, balanced lighting.',
    gradientVariant: 5,
    image: { src: null, alt: 'Retail & E-commerce editorial placeholder' },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    approachNote:
      'Builds accurate entity presence, answer-first medical discovery, and trusted patient booking journeys guided by strict governance.',
    path: '/contact?industry=Healthcare',
    shotDescription:
      'Modern specialist clinic reception, calm acoustic materials, warm indirect daylight.',
    gradientVariant: 6,
    image: { src: null, alt: 'Healthcare editorial placeholder' },
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    approachNote:
      'Connects high-consideration search intent, compliant content architecture, digital onboarding, and attribution intelligence.',
    path: '/contact?industry=Financial+Services',
    shotDescription:
      'Private advisory meeting room, glass partitions, natural city skyline depth.',
    gradientVariant: 7,
    image: { src: null, alt: 'Financial Services editorial placeholder' },
  },
  {
    id: 'government-public',
    name: 'Government & Public Sector',
    approachNote:
      'Unifies public discoverability across bilingual Arabic and English AI surfaces with modernized digital experiences and connected service ecosystems.',
    path: '/contact?industry=Government+%26+Public+Sector',
    shotDescription:
      'Civic cultural pavilion and public plaza, geometric shade canopy, citizens walking in daylight.',
    gradientVariant: 8,
    image: { src: null, alt: 'Government & Public Sector editorial placeholder' },
  },
];

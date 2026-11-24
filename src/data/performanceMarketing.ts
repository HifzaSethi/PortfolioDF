import type { BrandLogoId } from '../components/brand/BrandLogo';
import type { PerformanceSection } from '../types/content';

export const PERFORMANCE_MARKETING_LEAD = {
  lead: 'Drive measurable growth through media strategies that start with the business objective and maximize visibility, acquisitions, leads, bookings, and revenue across paid digital channels.',
  principle: 'Channels are activation tools, not the strategy itself.',
  closingNote: 'The right mix depends on objectives, audience, and commercial outcomes.',
  disclaimer:
    'Platform and network names listed below are descriptive references to media channels DF. manages, without implied official partnership or certification.',
};

export const PERFORMANCE_SECTIONS: PerformanceSection[] = [
  {
    id: 'paid-media-management',
    title: 'Paid Media Management',
    summary:
      'Reach the right audience at every stage of the customer journey through search, social, programmatic, and digital media; maximize performance, conversions, and ROI via intelligence-led campaign management and continuous optimization.',
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    summary:
      "Reach high-intent audiences across Google's ecosystem (Search, Display, YouTube, Shopping, Performance Max); increase visibility, drive qualified traffic, generate conversions, and maximize Return on Ad Spend (ROAS).",
    items: [
      'Search Ads',
      'Performance Max',
      'Display Ads',
      'YouTube Ads',
      'Shopping Ads',
      'Demand Gen Campaigns',
      'App Campaigns',
      'Local Campaigns',
      'Remarketing Campaigns',
    ],
  },
  {
    id: 'paid-social',
    title: 'Paid Social',
    summary:
      'Advertising built on audience signals, not assumptions, driving awareness, engagement, leads, and sales.',
    items: [
      'Meta (Facebook & Instagram)',
      'TikTok',
      'Snapchat',
      'X (Formerly Twitter)',
      'LinkedIn',
      'Pinterest',
      'Influencer & Creator Amplification',
    ],
  },
  {
    id: 'hospitality-digital-advertising',
    title: 'Hospitality-Focused Digital Advertising',
    summary:
      'Channels specifically built for hospitality brands (metasearch, OTAs, travel marketplaces, GDS); build the right channel mix to drive direct bookings, increase occupancy, strengthen OTA ranking and visibility, capture high-intent travelers, expand distribution through global travel networks, and maximize overall revenue performance.',
    subBlocks: [
      {
        id: 'metasearch',
        title: 'Metasearch',
        summary:
          'Capture high-intent travelers at the booking decision stage (Google Hotel Ads, Tripadvisor, Trivago, Kayak); optimize visibility, competitiveness, and direct booking performance to maximize occupancy and revenue while reducing distribution costs.',
        items: [
          'Google Hotel Ads',
          'Tripadvisor Sponsored Placements',
          'Trivago Ads',
          'Kayak Advertising',
          'Skyscanner Advertising',
          'Wego Advertising',
        ],
      },
      {
        id: 'otas',
        title: 'Online Travel Agencies (OTAs)',
        summary:
          'Increase visibility, bookings, and market share across Booking.com, Expedia, Agoda, Trip.com, and more; optimize property rankings, sponsored placements, pricing visibility, and promotional campaigns.',
        items: [
          'Booking Holdings Sponsored Listings',
          'Expedia TravelAds',
          'Expedia Co-Op Campaigns',
          'Agoda Sponsored Ads',
          'Hotels.com Advertising',
          'Hotelbeds Marketing Solutions',
          'Ctrip / Trip.com Advertising',
        ],
      },
      {
        id: 'gds',
        title: 'GDS & Travel Trade Distribution',
        summary:
          'Expand reach through global distribution systems and travel trade networks (Amadeus, Sabre, Travelport); enhance visibility among travel agents, corporate travel buyers, and TMCs.',
        items: [
          'Amadeus Media Solutions',
          'Sabre Travel Network',
          'Travelport Advertising',
          'GDS Display Advertising',
          'Travel Agent Marketing Programs',
          'Corporate Travel Network Advertising',
          'Consortia & TMC Marketing Programs',
        ],
      },
    ],
  },
  {
    id: 'additional-media-channels',
    title: 'Additional Media Channels',
    summary:
      'Programmatic, marketplace, retail media, audio, and connected TV; identify and optimize the right mix.',
    items: [
      'Microsoft Advertising (Bing)',
      'Amazon Ads',
      'Apple Search Ads',
      'Programmatic Advertising',
      'Native Advertising (Taboola & Outbrain)',
      'CTV & OTT Advertising',
      'Spotify & Podcast Advertising',
      'DOOH Advertising',
      'Affiliate Marketing',
      'Retail Media Networks',
      'Marketplace Advertising',
    ],
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    summary:
      'Continuous testing, audience insights, conversion tracking, and optimization guided by context, not just metrics.',
    items: [
      'Audience Research & Targeting',
      'Media Planning & Budget Allocation',
      'Campaign Management',
      'Creative Strategy & Ad Development',
      'Landing Page Optimization',
      'Conversion Rate Optimization (CRO)',
      'A/B Testing',
      'Retargeting Strategies',
      'Tracking & Attribution Setup',
      'Performance Reporting & Insights',
      'ROAS, CPA & Revenue Optimization',
    ],
  },
];

export const PERFORMANCE_CHANNEL_BRAND_LOOKUP: Record<string, BrandLogoId> = {
  // Paid Social
  'Meta (Facebook & Instagram)': 'meta',
  TikTok: 'tiktok',
  Snapchat: 'snapchat',
  'X (Formerly Twitter)': 'x',
  LinkedIn: 'linkedin',
  Pinterest: 'pinterest',
  'Influencer & Creator Amplification': 'channel-influencer',
  // Additional Media Channels
  'Microsoft Advertising (Bing)': 'microsoft',
  'Amazon Ads': 'amazon',
  'Apple Search Ads': 'apple',
  'Programmatic Advertising': 'channel-programmatic',
  'Native Advertising (Taboola & Outbrain)': 'native-taboola-outbrain',
  'CTV & OTT Advertising': 'channel-ctv',
  'Spotify & Podcast Advertising': 'spotify',
  'DOOH Advertising': 'channel-dooh',
  'Affiliate Marketing': 'channel-affiliate',
  'Retail Media Networks': 'channel-retail-media',
  'Marketplace Advertising': 'channel-marketplace',
};

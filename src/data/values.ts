import type { CoreValue, FieldMeaning } from '../types/content';

export const CORE_VALUES: CoreValue[] = [
  {
    id: 'see-the-whole-field',
    number: '01',
    title: 'See the Whole Field.',
    summary: 'Context before conclusions.',
    detail:
      'We look beyond individual campaigns to the forces shaping performance across the ecosystem.',
  },
  {
    id: 'business-before-metrics',
    number: '02',
    title: 'Business Before Metrics.',
    summary: 'Objectives lead, channels follow.',
    detail:
      'We define success around commercial and strategic goals first, then build the ecosystem required to reach them.',
  },
  {
    id: 'ask-why',
    number: '03',
    title: 'Ask Why.',
    summary: 'Challenge assumptions, connect signals.',
    detail:
      'We challenge assumptions and connect signals to find the reason behind every result, not just the result itself.',
  },
  {
    id: 'think-forward',
    number: '04',
    title: 'Think Forward.',
    summary: "Today's insight should inform tomorrow's decision.",
    detail: 'We balance immediate performance with sustainable, long-term growth.',
    timeline: [
      { stage: 'NOW', action: 'Optimize campaigns' },
      { stage: 'NEXT', action: 'Refine content and audiences' },
      { stage: 'THEN', action: 'Strengthen the value proposition' },
      { stage: 'FUTURE', action: 'Inform growth and investment decisions' },
    ],
  },
  {
    id: 'connect-the-dots',
    number: '05',
    title: 'Connect the Dots.',
    summary: 'Nothing performs in isolation.',
    detail:
      'Every touchpoint creates a signal; we turn disconnected data into actionable intelligence.',
  },
];

export const FIELD_MEANINGS: FieldMeaning[] = [
  {
    aspect: 'Technical',
    title: 'A discrete unit of data',
    description:
      'In data, a field is one discrete unit — a column, a value. Clicks, bookings, reviews, and search terms are each just a field of data until connected to something bigger.',
  },
  {
    aspect: 'Vantage Point',
    title: 'Width, not narrowness',
    description:
      'You survey a field all at once, from above. It implies width, perspective, and seeing every interacting factor rather than isolating one channel.',
  },
  {
    aspect: 'Physics',
    title: 'An invisible shaping force',
    description:
      'A field is an invisible force that shapes what happens inside it without touching the object. Nobody sees the field, only its effect. Likewise, the real driver of performance is rarely visible on a dashboard.',
  },
];

export const THE_DOT_COPY = {
  eyebrow: 'THE DOT',
  headline: "It's not where the name ends; it's where the field begins.",
  body: 'Every click, search, booking, and campaign is a data point floating in the field, meaningless alone. Pulled back to one fixed point — the business objective — it becomes intelligence. In the DF. mark, the dot sits as the magenta block at the foot of the F.',
  closingLine: 'The name is the story, compressed to two words.',
};

export const DF_VALUE_LIST: string[] = [
  'Understand the complete digital ecosystem',
  'Connect disconnected data points',
  'Improve marketing efficiency',
  'Identify growth opportunities',
  'Increase revenue and profitability',
  'Improve customer acquisition',
  'Make more informed decisions',
  'Align digital investments with business objectives',
  'Build sustainable long-term growth',
];

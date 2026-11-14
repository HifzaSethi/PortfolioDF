import iconLight from '../assets/brand/logo-icon-light.svg';
import iconDark from '../assets/brand/logo-icon-dark.svg';
import wordmarkLight from '../assets/brand/logo-wordmark-light.svg';
import wordmarkDark from '../assets/brand/logo-wordmark-dark.svg';
import lockupStandardLight from '../assets/brand/logo-lockup-standard-light.svg';
import lockupStandardDark from '../assets/brand/logo-lockup-standard-dark.svg';
import lockupItalicLight from '../assets/brand/logo-lockup-italic-light.svg';
import lockupItalicDark from '../assets/brand/logo-lockup-italic-dark.svg';
import tridiLight from '../assets/brand/tridi-mark-light.svg';
import tridiDark from '../assets/brand/tridi-mark-dark.svg';

export const SITE_CONFIG = {
  brandName: 'Digital Field.',
  abbreviation: 'DF.',
  domainDisplay: 'DIGITALFIELD.CO',
  // PLACEHOLDER: Replace with verified production URL (e.g. 'https://digitalfield.co') when deployed.
  baseUrl: '' as string,
  foundingYear: '2021',
  founder: 'Islam Helal',
  location: {
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    streetPlaceholder: 'Dubai, United Arab Emirates (street address placeholder)',
  },

  // Contact Placeholders — leave null until verified client details are supplied.
  contact: {
    email: null as string | null,
    emailPlaceholder: 'PLACEHOLDER: replace with verified company email',
    phone: null as string | null,
    phonePlaceholder: 'PLACEHOLDER: replace with verified phone number',
    socialPlaceholder: 'PLACEHOLDER: verified social links to be supplied',
    contactEndpoint: null as string | null,
    requirePrivacyConsent: false,
    privacyWordingPlaceholder: 'Privacy notice wording to be supplied by client.',
  },

  // Official Brand Vector Assets extracted from DF_Phase_01_VR_02.pdf
  assets: {
    logos: {
      wordmarkLight,
      wordmarkDark,
      iconLight,
      iconDark,
      lockupStandardLight,
      lockupStandardDark,
      lockupItalicLight,
      lockupItalicDark,
    },
    tridi: {
      light: tridiLight,
      dark: tridiDark,
    },
    characters: {
      Di: null as string | null,
      Fi: null as string | null,
    },
  },
} as const;

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
    // Configure CONTACT_ENDPOINT to POST JSON form submissions to your backend/serverless endpoint.
    contactEndpoint: null as string | null,
    // Set to true ONLY once the client provides approved privacy policy wording.
    requirePrivacyConsent: false,
    privacyWordingPlaceholder: 'Privacy notice wording to be supplied by client.',
  },

  // Brand Asset Paths — drop official SVGs/renders/photos here to replace placeholders globally.
  assets: {
    logos: {
      wordmarkLight: null as string | null, // Target path: /src/assets/brand/logo-wordmark-light.svg
      wordmarkDark: null as string | null,  // Target path: /src/assets/brand/logo-wordmark-dark.svg
      iconLight: null as string | null,     // Target path: /src/assets/brand/logo-icon-light.svg
      iconDark: null as string | null,      // Target path: /src/assets/brand/logo-icon-dark.svg
      lockupStandardLight: null as string | null, // /src/assets/brand/logo-lockup-standard-light.svg
      lockupStandardDark: null as string | null,  // /src/assets/brand/logo-lockup-standard-dark.svg
      lockupItalicLight: null as string | null,   // /src/assets/brand/logo-lockup-italic-light.svg
      lockupItalicDark: null as string | null,    // /src/assets/brand/logo-lockup-italic-dark.svg
    },
    hero3dSrc: null as string | null, // Target path: /src/assets/brand/df-icon-3d.png (or .webm)
    characters: {
      Di: null as string | null, // Target path: /src/assets/brand/character-di.png
      Fi: null as string | null, // Target path: /src/assets/brand/character-fi.png
    },
  },
} as const;

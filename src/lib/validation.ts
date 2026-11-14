export interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  industry: string;
  service: string;
  message: string;
  consent: boolean;
  websiteHoneypot: string; // Spam trap
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 2000;

export function validateContactField(
  field: keyof ContactFormValues,
  values: ContactFormValues,
  requireConsent: boolean
): string | undefined {
  switch (field) {
    case 'name':
      if (!values.name.trim()) return 'Please enter your name.';
      if (values.name.trim().length < 2) return 'Name must be at least 2 characters.';
      return undefined;

    case 'email':
      if (!values.email.trim()) return 'Please enter your business email.';
      if (!EMAIL_PATTERN.test(values.email.trim())) {
        return 'Please enter a valid email address (for example, name@company.com).';
      }
      return undefined;

    case 'company':
      if (!values.company.trim()) return 'Please enter your company or organization name.';
      return undefined;

    case 'message': {
      const len = values.message.trim().length;
      if (!len) return 'Please tell us what the business is trying to achieve.';
      if (len < MESSAGE_MIN_LENGTH) {
        return `Please share at least ${MESSAGE_MIN_LENGTH} characters of context (${MESSAGE_MIN_LENGTH - len} more needed).`;
      }
      if (len > MESSAGE_MAX_LENGTH) {
        return `Message must be under ${MESSAGE_MAX_LENGTH} characters.`;
      }
      return undefined;
    }

    case 'consent':
      if (requireConsent && !values.consent) {
        return 'Please confirm the privacy acknowledgement before continuing.';
      }
      return undefined;

    default:
      return undefined;
  }
}

export function validateContactForm(
  values: ContactFormValues,
  requireConsent: boolean
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const fields: Array<keyof ContactFormValues> = ['name', 'email', 'company', 'message', 'consent'];

  for (const field of fields) {
    const err = validateContactField(field, values, requireConsent);
    if (err) errors[field] = err;
  }

  return errors;
}

export function composeContactPlaintext(values: ContactFormValues): string {
  return [
    'DIGITAL FIELD. — NEW CONVERSATION INQUIRY',
    '========================================',
    `Name: ${values.name.trim()}`,
    `Business Email: ${values.email.trim()}`,
    `Company: ${values.company.trim()}`,
    `Industry: ${values.industry || 'Not specified'}`,
    `Service of Interest: ${values.service || 'Not sure yet'}`,
    '',
    'Business Objective & Context:',
    values.message.trim(),
  ].join('\n');
}

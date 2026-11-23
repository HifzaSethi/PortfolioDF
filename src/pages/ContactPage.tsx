import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { InlineStatus } from '../components/ui/InlineStatus';
import { SITE_CONFIG } from '../config/site';
import { INDUSTRIES } from '../data/industries';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  composeContactPlaintext,
  validateContactField,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '../lib/validation';

const SERVICE_OPTIONS = [
  'Intelligence',
  'Performance Marketing',
  'Search Intelligence',
  'Growth Marketing',
  'Digital Transformation',
  'DF. Studio',
  'Not sure yet',
];

const INDUSTRY_OPTIONS = [...INDUSTRIES.map((i) => i.name), 'Other'];

const FIELD_INPUT_CLASSES =
  'w-full min-h-[44px] border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-2.5 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2';

export default function ContactPage() {
  usePageMeta('/contact');
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    company: '',
    industry: searchParams.get('industry') ?? '',
    service: searchParams.get('service') ?? '',
    message: '',
    consent: false,
    websiteHoneypot: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'fallback' | 'error'>(
    'idle'
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [composedText, setComposedText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const preIndustry = searchParams.get('industry');
    const preService = searchParams.get('service');
    setValues((prev) => ({
      ...prev,
      industry: preIndustry ?? prev.industry,
      service: preService ?? prev.service,
    }));
  }, [searchParams]);

  const handleFieldChange = (field: keyof ContactFormValues, value: string | boolean) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) {
      const err = validateContactField(field, next, SITE_CONFIG.contact.requirePrivacyConsent);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof ContactFormValues) => {
    const err = validateContactField(field, values, SITE_CONFIG.contact.requirePrivacyConsent);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (values.websiteHoneypot.trim()) {
      return;
    }

    const formErrors = validateContactForm(values, SITE_CONFIG.contact.requirePrivacyConsent);
    setErrors(formErrors);

    const firstErrorField = (
      ['name', 'email', 'company', 'message', 'consent'] as Array<keyof ContactFormValues>
    ).find((key) => Boolean(formErrors[key]));

    if (firstErrorField) {
      document.getElementById(`contact-${firstErrorField}`)?.focus();
      setStatus('error');
      setStatusMessage('Please review the highlighted fields before continuing.');
      return;
    }

    const endpoint = SITE_CONFIG.contact.contactEndpoint;
    const realEmail = SITE_CONFIG.contact.email;
    const plaintext = composeContactPlaintext(values);
    setComposedText(plaintext);

    if (endpoint) {
      setStatus('submitting');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Request failed');
        setStatus('success');
        setStatusMessage('Your inquiry has been submitted.');
      } catch {
        setStatus('error');
        setStatusMessage(
          'Unable to submit to the configured endpoint. Your entered details have been preserved below.'
        );
      }
      return;
    }

    if (realEmail) {
      const subject = encodeURIComponent(
        `Digital Field Inquiry — ${values.company.trim()}`
      );
      const body = encodeURIComponent(plaintext);
      window.location.href = `mailto:${realEmail}?subject=${subject}&body=${body}`;
      setStatus('success');
      setStatusMessage('Opening your default email client with the inquiry details prefilled.');
      return;
    }

    // Honest Fallback (default when no backend or email address is configured)
    setStatus('fallback');
    setStatusMessage("This form isn't connected to email yet.");
  };

  const handleCopy = async () => {
    if (!composedText) return;
    try {
      await navigator.clipboard.writeText(composedText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback ignored safely
    }
  };

  const handleDownloadTxt = () => {
    if (!composedText) return;
    const blob = new Blob([composedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-field-inquiry-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PracticeHero
        routePath="/contact"
        number="01"
        eyebrow="Start a Conversation"
        surface="dark-mesh"
        title="What is the business trying to achieve?"
        lead="Tell us the objective. We'll start there."
      />

      <Section surface="off-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left: Process & Labeled Placeholder Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  What happens next
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-muted)]">
                  Every engagement begins with the commercial objective, the surrounding digital
                  ecosystem, and the signals influencing performance today.
                </p>
                <ol className="space-y-3 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-primary)]">
                  <li className="flex gap-3">
                    <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">01</span>
                    <span>Share your business goal, sector context, and current challenges.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">02</span>
                    <span>We examine how search, media, content, technology, and data interact.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold tabular-nums text-[var(--eyebrow-magenta)]">03</span>
                    <span>We define the ecosystem priorities tied directly to commercial growth.</span>
                  </li>
                </ol>
              </div>

              <div className="df-card-surface df-ambient df-frame-l p-4 sm:p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Studio Location &amp; Inquiries
                </p>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-bold text-[var(--text-primary)]">Office</dt>
                    <dd className="text-[var(--text-muted)]">
                      {SITE_CONFIG.location.city}, {SITE_CONFIG.location.country}
                    </dd>
                  </div>
                  {SITE_CONFIG.contact.email && (
                    <div>
                      <dt className="font-bold text-[var(--text-primary)]">Email</dt>
                      <dd className="text-[var(--text-muted)]">
                        <a
                          href={`mailto:${SITE_CONFIG.contact.email}`}
                          className="df-link-sweep text-[var(--link-accent)]"
                        >
                          {SITE_CONFIG.contact.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {SITE_CONFIG.contact.phone && (
                    <div>
                      <dt className="font-bold text-[var(--text-primary)]">Phone</dt>
                      <dd className="text-[var(--text-muted)]">
                        <a
                          href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                          className="df-link-sweep text-[var(--link-accent)]"
                        >
                          {SITE_CONFIG.contact.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {!SITE_CONFIG.contact.email && !SITE_CONFIG.contact.phone && (
                    <div>
                      <dt className="font-bold text-[var(--text-primary)]">Direct Inquiries</dt>
                      <dd className="mt-1 text-[var(--text-muted)]">
                        <button
                          type="button"
                          onClick={() => document.getElementById('contact-name')?.focus()}
                          className="df-link-sweep text-left font-semibold text-[var(--link-accent)] cursor-pointer"
                        >
                          Use the inquiry form to start a conversation
                        </button>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Right: Accessible Form + Honest Fallback */}
            <div className="lg:col-span-7 df-card-surface p-4 sm:p-10 space-y-6">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.websiteHoneypot}
                    onChange={(e) => handleFieldChange('websiteHoneypot', e.target.value)}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="contact-name" label="Name" required error={errors.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={values.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={FIELD_INPUT_CLASSES}
                    />
                  </FormField>

                  <FormField
                    id="contact-email"
                    label="Business email"
                    required
                    error={errors.email}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={values.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={FIELD_INPUT_CLASSES}
                    />
                  </FormField>
                </div>

                <FormField id="contact-company" label="Company" required error={errors.company}>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    required
                    value={values.company}
                    onChange={(e) => handleFieldChange('company', e.target.value)}
                    onBlur={() => handleBlur('company')}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? 'contact-company-error' : undefined}
                    className={FIELD_INPUT_CLASSES}
                  />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="contact-industry" label="Industry">
                    <select
                      id="contact-industry"
                      name="industry"
                      value={values.industry}
                      onChange={(e) => handleFieldChange('industry', e.target.value)}
                      className={FIELD_INPUT_CLASSES}
                    >
                      <option value="">Select an industry</option>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField id="contact-service" label="Service of interest">
                    <select
                      id="contact-service"
                      name="service"
                      value={values.service}
                      onChange={(e) => handleFieldChange('service', e.target.value)}
                      className={FIELD_INPUT_CLASSES}
                    >
                      <option value="">Select a practice</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField
                  id="contact-message"
                  label="What is the business trying to achieve?"
                  required
                  error={errors.message}
                  hint={`Minimum ${MESSAGE_MIN_LENGTH} characters.`}
                  counter={`${values.message.trim().length} / ${MESSAGE_MAX_LENGTH}`}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    maxLength={MESSAGE_MAX_LENGTH}
                    value={values.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : 'contact-message-hint'
                    }
                    className="w-full border border-[var(--border-strong)] bg-[var(--input-bg)] px-3.5 py-3 text-sm text-[var(--input-text)] placeholder:text-[var(--text-subtle)] df-input-focus focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2"
                  />
                </FormField>

                {SITE_CONFIG.contact.requirePrivacyConsent && (
                  <FormField id="contact-consent" label="Privacy consent" required error={errors.consent}>
                    <label className="flex items-start gap-3 text-sm text-[var(--text-primary)] cursor-pointer">
                      <input
                        id="contact-consent"
                        type="checkbox"
                        checked={values.consent}
                        onChange={(e) => handleFieldChange('consent', e.target.checked)}
                        className="mt-1 h-4 w-4 accent-[var(--electric-blue)]"
                      />
                      <span>{SITE_CONFIG.contact.privacyWordingPlaceholder}</span>
                    </label>
                  </FormField>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto"
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Prepare conversation'}
                  </Button>
                </div>
              </form>

              {status === 'error' && (
                <InlineStatus variant="error" title="Check required details">
                  {statusMessage}
                </InlineStatus>
              )}

              {status === 'success' && (
                <InlineStatus variant="success" title="Inquiry ready">
                  {statusMessage}
                </InlineStatus>
              )}

              {status === 'fallback' && (
                <InlineStatus variant="info" title={statusMessage}>
                  <p className="mb-3">
                    No backend endpoint or verified email address is configured in{' '}
                    <code>src/config/site.ts</code> yet. Your composed inquiry is ready below so
                    you can copy or download it directly.
                  </p>
                  <textarea
                    readOnly
                    aria-label="Composed inquiry message"
                    rows={8}
                    value={composedText}
                    className="w-full border border-[var(--border-strong)] bg-[var(--input-bg)] p-3 font-mono text-xs text-[var(--input-text)]"
                  />
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button type="button" variant="primary" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <Check aria-hidden="true" className="h-4 w-4" />
                          <span>Copied message</span>
                        </>
                      ) : (
                        <>
                          <Copy aria-hidden="true" className="h-4 w-4" />
                          <span>Copy message</span>
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleDownloadTxt}>
                      <Download aria-hidden="true" className="h-4 w-4" />
                      <span>Download as .txt</span>
                    </Button>
                  </div>
                </InlineStatus>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

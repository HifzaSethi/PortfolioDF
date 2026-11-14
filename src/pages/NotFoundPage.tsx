import { ArrowRight } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('/404');

  return (
    <>
      <Section surface="off-white" className="py-24 sm:py-32">
        <Container className="space-y-6 max-w-3xl">
          <Eyebrow>404 · Route Not Found</Eyebrow>
          <SectionHeading as="h1" size="display" slanted>
            This path is outside the field.
          </SectionHeading>
          <p className="text-lg leading-relaxed text-[var(--ink-muted)]">
            The route you requested could not be found. Return to the main site or explore our
            consultancy practices directly.
          </p>
          <div className="flex flex-wrap gap-4 pt-3">
            <LinkButton to="/" variant="primary">
              <span>Home</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </LinkButton>
            <LinkButton to="/services" variant="secondary">
              <span>Services</span>
            </LinkButton>
            <LinkButton to="/contact" variant="secondary">
              <span>Contact</span>
            </LinkButton>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}

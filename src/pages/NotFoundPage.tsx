import { ArrowRight } from 'lucide-react';
import { TridiMark } from '../components/brand/TridiMark';
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
      <Section surface="hero-adaptive" withPattern className="py-24 sm:py-32">
        <Container className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <TridiMark size={26} tone="auto" />
            <Eyebrow number="404">Route Not Found</Eyebrow>
          </div>
          <SectionHeading as="h1" size="display" slanted>
            This path is outside the field.
          </SectionHeading>
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">
            The route you requested could not be found. Return to the main site or explore our
            consultancy practices directly.
          </p>
          <div className="flex flex-wrap gap-4 pt-3">
            <LinkButton to="/" variant="gradient">
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

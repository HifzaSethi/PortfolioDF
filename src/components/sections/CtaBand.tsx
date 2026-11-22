import { ArrowRight } from 'lucide-react';
import { TridiMark } from '../brand/TridiMark';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { LinkButton } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeading } from '../ui/SectionHeading';

interface CtaBandProps {
  serviceParam?: string;
}

export function CtaBand({ serviceParam }: CtaBandProps) {
  const destination = serviceParam
    ? `/contact?service=${encodeURIComponent(serviceParam)}`
    : '/contact';

  return (
    <Section surface="dark-mesh" withPattern>
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-3">
              <TridiMark size={30} tone="dark" />
              <Eyebrow tone="dark">Performance in Context.</Eyebrow>
            </div>

            <SectionHeading as="h2" size="h1" slanted tone="dark">
              What is the business trying to achieve?
            </SectionHeading>

            <p className="max-w-[60ch] text-base sm:text-lg leading-relaxed text-[var(--on-dark-muted)]">
              Tell us the objective. We connect the brand, search, media, content, technology, and
              data signals influencing your commercial growth.
            </p>
          </div>

          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <LinkButton to={destination} variant="gradient" magnetic>
              <span>Start a conversation</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 df-btn-arrow" />
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}

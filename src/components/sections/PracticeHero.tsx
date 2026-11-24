import type { ReactNode } from 'react';
import { TridiMark } from '../brand/TridiMark';
import { Container } from '../layout/Container';
import { Section, type SectionSurface } from '../layout/Section';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeading } from '../ui/SectionHeading';

interface PracticeHeroProps {
  routePath: string;
  eyebrow: string;
  number?: string;
  title: ReactNode;
  lead: string;
  principle?: string;
  surface?: SectionSurface;
  actions?: ReactNode;
}

export function PracticeHero({
  routePath,
  eyebrow,
  number,
  title,
  lead,
  principle,
  surface = 'hero-adaptive',
  actions,
}: PracticeHeroProps) {
  const isDarkMesh =
    surface === 'dark-mesh' || surface === 'hospitality-mesh' || surface === 'near-black';
  const showPattern = isDarkMesh || surface === 'hero-adaptive';

  return (
    <Section surface={surface} withPattern={showPattern} className="pt-12 pb-14 sm:pt-16 sm:pb-20">
      <Container>
        <Breadcrumbs routePath={routePath} tone={isDarkMesh ? 'dark' : 'auto'} />

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9 space-y-5 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0">
                <TridiMark size={26} tone={isDarkMesh ? 'dark' : 'auto'} />
              </span>
              <Eyebrow number={number} tone={isDarkMesh ? 'dark' : 'auto'} className="min-w-0">
                {eyebrow}
              </Eyebrow>
            </div>

            <SectionHeading
              as="h1"
              size="display"
              slanted
              tone={isDarkMesh ? 'dark' : 'auto'}
            >
              {title}
            </SectionHeading>

            <p
              className={`max-w-[64ch] text-lg sm:text-xl leading-relaxed ${
                isDarkMesh ? 'text-[var(--on-dark-muted)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {lead}
            </p>
          </div>

          {(principle || actions) && (
            <div className="lg:col-span-3 space-y-5">
              {principle && (
                <div
                  className={`df-frame-t pt-4 ${
                    isDarkMesh ? 'border-[var(--border-dark-strong)]' : 'border-[var(--border-strong)]'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
                    Core Principle
                  </p>
                  <p
                    className={`mt-1.5 text-sm font-semibold ${
                      isDarkMesh ? 'text-[var(--off-white)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {principle}
                  </p>
                </div>
              )}
              {actions && <div>{actions}</div>}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

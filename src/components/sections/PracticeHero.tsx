import type { ReactNode } from 'react';
import { Container } from '../layout/Container';
import { Section, type SectionSurface } from '../layout/Section';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Eyebrow } from '../ui/Eyebrow';
import { SectionHeading } from '../ui/SectionHeading';
import { TridiMark } from '../brand/TridiMark';

interface PracticeHeroProps {
  routePath: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  principle?: string;
  surface?: SectionSurface;
  actions?: ReactNode;
}

export function PracticeHero({
  routePath,
  eyebrow,
  title,
  lead,
  principle,
  surface = 'off-white',
  actions,
}: PracticeHeroProps) {
  const isDark = surface === 'dark-mesh' || surface === 'hospitality-mesh' || surface === 'near-black';

  return (
    <Section surface={surface} withPattern={isDark} className="pt-12 pb-14 sm:pt-16 sm:pb-20">
      <Container>
        <Breadcrumbs routePath={routePath} tone={isDark ? 'dark' : 'light'} />

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-9 space-y-5">
            <div className="flex items-center gap-3">
              {isDark && <TridiMark size={24} />}
              <Eyebrow tone={isDark ? 'dark' : 'light'}>{eyebrow}</Eyebrow>
            </div>

            <SectionHeading
              as="h1"
              size="display"
              slanted
              tone={isDark ? 'dark' : 'light'}
            >
              {title}
            </SectionHeading>

            <p
              className={`max-w-[64ch] text-lg sm:text-xl leading-relaxed ${
                isDark ? 'text-[var(--on-dark-muted)]' : 'text-[var(--ink-muted)]'
              }`}
            >
              {lead}
            </p>
          </div>

          {(principle || actions) && (
            <div className="lg:col-span-3 space-y-5">
              {principle && (
                <div
                  className={`border-t pt-4 ${
                    isDark ? 'border-[var(--border-dark-strong)]' : 'border-[var(--border-light-strong)]'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--magenta)]">
                    Core Principle
                  </p>
                  <p
                    className={`mt-1.5 text-sm font-semibold ${
                      isDark ? 'text-[var(--off-white)]' : 'text-[var(--near-black)]'
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

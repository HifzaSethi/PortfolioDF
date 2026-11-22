import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  PERFORMANCE_MARKETING_LEAD,
  PERFORMANCE_SECTIONS,
} from '../data/performanceMarketing';
import { usePageMeta } from '../hooks/usePageMeta';
import { scrollToSection } from '../lib/scroll';

export default function PerformanceMarketingPage() {
  usePageMeta('/services/performance-marketing');

  return (
    <>
      <PracticeHero
        routePath="/services/performance-marketing"
        number="01"
        eyebrow="Practice 02 · How DF. Acts"
        title="Performance Marketing."
        lead={PERFORMANCE_MARKETING_LEAD.lead}
        principle={PERFORMANCE_MARKETING_LEAD.principle}
      />

      <Section surface="off-white" className="pt-8">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Sticky Side Index */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 df-card-surface df-ambient df-panel-hairline df-frame-l p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                Channel Index
              </p>
              <nav aria-label="Performance Marketing sections">
                <ul className="space-y-1.5">
                  {PERFORMANCE_SECTIONS.map((sec, idx) => (
                    <li key={sec.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(sec.id)}
                        className="w-full min-h-[40px] flex items-center gap-3 px-3 py-1.5 text-left text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--link-accent)] df-interactive"
                      >
                        <span className="text-xs tabular-nums text-[var(--text-muted)]">
                          0{idx + 1}
                        </span>
                        <span>{sec.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Six Practice Sections */}
            <div className="lg:col-span-8 space-y-16">
              {PERFORMANCE_SECTIONS.map((section, idx) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="df-frame-t pt-10 space-y-6"
                >
                  <div className="space-y-3">
                    <Eyebrow number={`0${idx + 1}`}>Channel Practice</Eyebrow>
                    <SectionHeading as="h2" size="h2">
                      {section.title}
                    </SectionHeading>
                    <p className="max-w-[66ch] text-base leading-relaxed text-[var(--text-muted)]">
                      {section.summary}
                    </p>
                  </div>

                  {section.items && (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="df-card-surface df-ambient px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subBlocks && (
                    <div className="space-y-6">
                      {section.subBlocks.map((block) => (
                        <div
                          key={block.id}
                          className="df-card-surface df-ambient df-frame-l p-6 space-y-4"
                        >
                          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                            {block.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                            {block.summary}
                          </p>
                          <ul className="grid gap-2.5 sm:grid-cols-2">
                            {block.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="h-1.5 w-1.5 bg-[var(--eyebrow-blue)] shrink-0"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              <div className="border-t border-[var(--border-strong)] pt-8 space-y-3">
                <p className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  {PERFORMANCE_MARKETING_LEAD.closingNote}
                </p>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  {PERFORMANCE_MARKETING_LEAD.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="Performance Marketing" />
    </>
  );
}

import { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { PracticeHero } from '../components/sections/PracticeHero';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SectionHeading } from '../components/ui/SectionHeading';
import {
  DIGITAL_TRANSFORMATION_COPY,
  TRANSFORMATION_GROUPS,
  TRANSFORMATION_SYSTEM_NODES,
} from '../data/digitalTransformation';
import { usePageMeta } from '../hooks/usePageMeta';

export default function DigitalTransformationPage() {
  usePageMeta('/services/digital-transformation');
  const [activeGroupId, setActiveGroupId] = useState<string>(TRANSFORMATION_GROUPS[0].id);

  const activeGroup =
    TRANSFORMATION_GROUPS.find((g) => g.id === activeGroupId) ?? TRANSFORMATION_GROUPS[0];

  return (
    <>
      <PracticeHero
        routePath="/services/digital-transformation"
        number="01"
        eyebrow="Practice 05 · How DF. Acts"
        title="Digital Transformation."
        lead={DIGITAL_TRANSFORMATION_COPY.lead}
        principle={DIGITAL_TRANSFORMATION_COPY.tagline}
      />

      {/* Claim, Then Reframe */}
      <Section surface="tint" compact>
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center border-y border-[var(--border-strong)] py-8">
            <p className="lg:col-span-5 text-xl text-[var(--text-muted)]">
              {DIGITAL_TRANSFORMATION_COPY.contrastClaim}
            </p>
            <p className="lg:col-span-7 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {DIGITAL_TRANSFORMATION_COPY.contrastReframe}
            </p>
          </div>
        </Container>
      </Section>

      {/* Interactive Connected Systems Map + Five Groups */}
      <Section surface="off-white">
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Group Selector & Interactive Systems Map */}
            <div className="lg:col-span-5 space-y-4">
              <Eyebrow number="02" accent="blue">
                Interactive Systems Map
              </Eyebrow>
              <p className="text-sm text-[var(--text-muted)]">
                Select a transformation pillar to see which parts of the ecosystem it connects.
              </p>

              <div className="space-y-2" role="tablist" aria-label="Transformation pillars">
                {TRANSFORMATION_GROUPS.map((group, idx) => {
                  const isActive = group.id === activeGroup.id;
                  return (
                    <button
                      key={group.id}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      data-spotlight=""
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-full min-h-[52px] flex items-center justify-between gap-3 px-4 py-3 text-left border df-interactive ${
                        isActive
                          ? 'bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] border-[var(--link-accent)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-strong)] hover:border-[var(--link-accent)]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            isActive ? 'text-[var(--magenta)]' : 'text-[var(--eyebrow-magenta)]'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-bold">{group.title}</span>
                      </span>
                      <span className="text-xs opacity-70 tabular-nums">
                        {group.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connected Nodes & Active Group Deliverables */}
            <div className="lg:col-span-7 space-y-6" aria-live="polite">
              <div className="df-mesh-dark border border-[var(--border-dark)] p-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                  Connected Ecosystem Nodes · {activeGroup.title}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {TRANSFORMATION_SYSTEM_NODES.map((node) => {
                    const isLinked = activeGroup.connectedNodeIds.includes(node.id);
                    return (
                      <span
                        key={node.id}
                        className={`px-3.5 py-2 text-xs font-bold border transition-all duration-150 ${
                          isLinked
                            ? 'border-[var(--electric-blue)] bg-[var(--electric-blue)] text-[var(--off-white)]'
                            : 'border-[var(--border-dark)] text-[var(--on-dark-subtle)] opacity-55'
                        }`}
                      >
                        {node.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="df-card-surface df-ambient df-panel-hairline df-frame-l p-6 sm:p-8 space-y-4">
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {activeGroup.title}
                </h2>
                <p className="text-base text-[var(--text-muted)]">{activeGroup.summary}</p>
                <ul className="grid gap-3 sm:grid-cols-2 pt-2">
                  {activeGroup.items.map((item) => (
                    <li
                      key={item}
                      className="border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Complete Index of All 19 Services Across 5 Groups */}
          <div className="border-t border-[var(--border-strong)] pt-12 space-y-8">
            <SectionHeading as="h2" size="h2">
              Complete Transformation Capabilities (5 Groups · 19 Services)
            </SectionHeading>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TRANSFORMATION_GROUPS.map((group) => (
                <div
                  key={group.id}
                  className="df-card-surface df-ambient df-frame-t p-6 space-y-4"
                >
                  <h3 className="text-base font-extrabold uppercase tracking-[0.06em] text-[var(--text-primary)]">
                    {group.title}
                  </h3>
                  <ul className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-primary)]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 bg-[var(--link-accent)] shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {DIGITAL_TRANSFORMATION_COPY.closing}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand serviceParam="Digital Transformation" />
    </>
  );
}

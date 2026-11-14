import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero3DSlot } from '../components/brand/Hero3DSlot';
import { ImageSlot } from '../components/brand/ImageSlot';
import { TridiMark } from '../components/brand/TridiMark';
import { EcosystemDiagram } from '../components/diagrams/EcosystemDiagram';
import { IntelligenceFramework } from '../components/diagrams/IntelligenceFramework';
import { PracticeConstellation } from '../components/diagrams/PracticeConstellation';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/sections/CtaBand';
import { ValueList } from '../components/sections/ValueList';
import { LinkButton } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { GradientText } from '../components/ui/GradientText';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Tag } from '../components/ui/Tag';
import { ECOSYSTEM_INTRO } from '../data/ecosystem';
import { INDUSTRIES } from '../data/industries';
import { STUDIO_DISCIPLINES } from '../data/studio';
import { usePageMeta } from '../hooks/usePageMeta';

export default function HomePage() {
  usePageMeta('/');
  const [dotsAligned, setDotsAligned] = useState(true);

  return (
    <>
      {/* A. HERO — Dark Gradient Mesh */}
      <Section surface="dark-mesh" withPattern className="pt-14 pb-20 sm:pt-20 sm:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="flex items-center gap-3">
                <TridiMark size={24} />
                <Eyebrow tone="dark">Performance in Context.</Eyebrow>
              </div>

              <SectionHeading as="h1" size="display" slanted tone="dark">
                SEE THE{' '}
                <GradientText>WHOLE FIELD.</GradientText>
              </SectionHeading>

              <p className="max-w-[54ch] text-lg sm:text-xl leading-relaxed text-[var(--on-dark-muted)]">
                Nothing performs in isolation. DF. is a Digital Performance &amp; Intelligence
                Consultancy that connects the signals others report separately.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <LinkButton to="/contact" variant="on-dark">
                  <span>Start a conversation</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </LinkButton>
                <Link
                  to="/about"
                  className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--off-white)] df-link-sweep"
                >
                  <span>See how we think</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Hero3DSlot />
            </div>
          </div>
        </Container>
      </Section>

      {/* B. THE PROBLEM — Off-White, Typography-Led, T-Shape */}
      <Section surface="off-white" reveal>
        <Container>
          <div className="border-b border-[var(--border-light-strong)] pb-10">
            <Eyebrow>The Fragmentation Problem</Eyebrow>
            <SectionHeading as="h2" size="h1" className="mt-4 max-w-4xl">
              Specialists optimize channels. Businesses inherit the gaps between them.
            </SectionHeading>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-lg leading-relaxed text-[var(--near-black)]">
                The industry is highly specialized: one agency manages paid media, another SEO,
                another content, another websites, and another analytics.
              </p>
              <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                Each produces valid insight inside its own silo, yet leadership is left with
                fragmented data, disconnected recommendations, and no clear view of what truly
                drives commercial performance.
              </p>

              {/* Subtle disconnected dots SVG motif */}
              <div className="pt-4">
                <svg
                  aria-label="Diagram showing disconnected channel metrics floating without an objective anchor"
                  role="img"
                  className="w-full max-w-md h-24 border border-[var(--border-light)] bg-[var(--paper-tint)] p-3"
                  viewBox="0 0 360 72"
                >
                  <text x="12" y="16" fill="#010102" fillOpacity="0.55" fontSize="9" fontWeight="600">
                    SILOED CHANNEL REPORTS
                  </text>
                  <rect x="24" y="34" width="8" height="8" fill="#010102" fillOpacity="0.4" />
                  <rect x="92" y="48" width="8" height="8" fill="#010102" fillOpacity="0.4" />
                  <rect x="164" y="26" width="8" height="8" fill="#010102" fillOpacity="0.4" />
                  <rect x="238" y="44" width="8" height="8" fill="#010102" fillOpacity="0.4" />
                  <rect x="308" y="30" width="8" height="8" fill="#010102" fillOpacity="0.4" />
                  <line x1="36" y1="38" x2="78" y2="50" stroke="#010102" strokeOpacity="0.16" strokeDasharray="3 3" />
                  <line x1="176" y1="30" x2="222" y2="46" stroke="#010102" strokeOpacity="0.16" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-6 lg:border-l lg:border-[var(--border-light)] lg:pl-10 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
                Claim, Then Reframe
              </p>
              <blockquote className="space-y-4">
                <p className="text-xl font-normal text-[var(--ink-muted)]">
                  Most agencies ask: &ldquo;How do we improve the campaign?&rdquo;
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-[var(--near-black)]">
                  DF. asks: &ldquo;What is the business trying to achieve, and what across the
                  digital field is influencing it?&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </Container>
      </Section>

      {/* C. NOTHING PERFORMS IN ISOLATION — Resolving Dots Interactive Visual */}
      <Section surface="tint" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-5">
              <Eyebrow accent="blue">The Alternative</Eyebrow>
              <SectionHeading as="h2" size="h2" slanted>
                Nothing Performs in Isolation.
              </SectionHeading>
              <p className="text-base leading-relaxed text-[var(--near-black)]">
                Marketing, sales, brand, ecommerce, technology, customer experience, and analytics
                teams each see part of the picture. DF. connects the signals across the business
                ecosystem — aligning digital strategy with brand positioning, content, media, PR,
                customer insights, offline activities, and commercial goals.
              </p>
              <p className="text-base font-semibold text-[var(--near-black)]">
                Outcome: understand not only what is performing, but why, what is influencing it,
                and what should happen next.
              </p>
            </div>

            {/* Interactive Scattered Dots -> One Fixed Point */}
            <div className="lg:col-span-6 border border-[var(--border-light-strong)] bg-[var(--off-white)] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                  Signal Alignment Model
                </span>
                <button
                  type="button"
                  onClick={() => setDotsAligned((v) => !v)}
                  className="min-h-[40px] px-3.5 py-1.5 border border-[var(--border-light-strong)] text-xs font-semibold text-[var(--near-black)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)] cursor-pointer"
                >
                  {dotsAligned ? 'Show Disconnected State' : 'Resolve to Business Objective'}
                </button>
              </div>

              <svg
                aria-label={
                  dotsAligned
                    ? 'Signals across brand, content, search, media, CX, and offline resolving to one fixed business objective dot'
                    : 'Scattered unaligned channel signals'
                }
                role="img"
                className="w-full h-56 border border-[var(--border-light)] bg-[var(--paper-elevated)]"
                viewBox="0 0 480 220"
              >
                {/* Signal lines when aligned */}
                {dotsAligned && (
                  <g stroke="#0057FF" strokeOpacity="0.48" strokeWidth="1.5">
                    <line x1="68" y1="42" x2="240" y2="110" />
                    <line x1="112" y1="176" x2="240" y2="110" />
                    <line x1="240" y1="30" x2="240" y2="110" />
                    <line x1="406" y1="46" x2="240" y2="110" />
                    <line x1="418" y1="168" x2="240" y2="110" />
                    <line x1="240" y1="190" x2="240" y2="110" />
                  </g>
                )}

                {/* Peripheral signal nodes */}
                {[
                  { label: 'Brand', x: dotsAligned ? 68 : 42, y: dotsAligned ? 42 : 30 },
                  { label: 'Media', x: dotsAligned ? 112 : 76, y: dotsAligned ? 176 : 192 },
                  { label: 'Search', x: dotsAligned ? 240 : 190, y: dotsAligned ? 30 : 46 },
                  { label: 'Content', x: dotsAligned ? 406 : 434, y: dotsAligned ? 46 : 32 },
                  { label: 'CX & CRM', x: dotsAligned ? 418 : 412, y: dotsAligned ? 168 : 190 },
                  { label: 'Offline & PR', x: dotsAligned ? 240 : 300, y: dotsAligned ? 190 : 176 },
                ].map((pt) => (
                  <g key={pt.label} className="transition-all duration-500">
                    <rect
                      x={pt.x - 5}
                      y={pt.y - 5}
                      width="10"
                      height="10"
                      fill={dotsAligned ? '#0057FF' : '#010102'}
                      fillOpacity={dotsAligned ? 1 : 0.4}
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 18}
                      textAnchor="middle"
                      fill="#010102"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {/* Fixed Objective Anchor Dot */}
                <rect x="231" y="101" width="18" height="18" fill="#E23389" />
                <text
                  x="240"
                  y="134"
                  textAnchor="middle"
                  fill="#010102"
                  fontSize="10"
                  fontWeight="800"
                >
                  BUSINESS OBJECTIVE
                </text>
              </svg>
            </div>
          </div>
        </Container>
      </Section>

      {/* D. DIGITAL ECOSYSTEM FRAMEWORK — Interactive */}
      <Section id="ecosystem-framework" surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <Eyebrow>{ECOSYSTEM_INTRO.eyebrow}</Eyebrow>
            <SectionHeading as="h2" size="h1">
              {ECOSYSTEM_INTRO.headline}
            </SectionHeading>
            <p className="text-lg leading-relaxed text-[var(--ink-muted)]">
              {ECOSYSTEM_INTRO.description}
            </p>
          </div>

          <EcosystemDiagram />
        </Container>
      </Section>

      {/* E. THE DF. INTELLIGENCE FRAMEWORK™ — Dark Gradient Mesh */}
      <Section surface="dark-mesh" withPattern reveal>
        <Container className="space-y-8">
          <IntelligenceFramework />
          <div className="pt-2">
            <Link
              to="/services/intelligence"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--off-white)] df-link-sweep"
            >
              <span>Explore the Intelligence Practice</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* F. FIVE PRACTICE AREAS — Constellation */}
      <Section surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-3">
              <Eyebrow>Five Practice Areas</Eyebrow>
              <SectionHeading as="h2" size="h1">
                Intelligence at the centre. Four practices in motion.
              </SectionHeading>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base font-semibold text-[var(--near-black)]">
                Every other practice produces activity. Intelligence is what turns that activity
                into decisions.
              </p>
            </div>
          </div>

          <PracticeConstellation />
        </Container>
      </Section>

      {/* G. DF. STUDIO TEASER — Split-Screen */}
      <Section surface="tint" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow>DF. Studio</Eyebrow>
              <SectionHeading as="h2" size="h1" slanted>
                Content in Context.
              </SectionHeading>
              <div className="space-y-3">
                <p className="text-base text-[var(--ink-muted)]">
                  Most studios ask what will look good.
                </p>
                <p className="text-xl font-bold text-[var(--near-black)]">
                  DF. Studio asks what the content needs to achieve.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-3 pt-2">
                {STUDIO_DISCIPLINES.map((disc) => (
                  <Tag key={disc.id}>{disc.title}</Tag>
                ))}
              </div>

              <div className="pt-2">
                <LinkButton to="/studio" variant="primary">
                  <span>Explore DF. Studio</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <ImageSlot
                aspectRatio="4/3"
                shotDescription="Creative professionals collaborating in a real working environment, natural light"
                alt="DF. Studio creative team collaboration placeholder"
              />
              <ImageSlot
                aspectRatio="4/3"
                tone="dark"
                shotDescription="Modern architectural hospitality interior framed for commercial campaign film"
                alt="DF. Studio hospitality production placeholder"
              />
              <div className="col-span-2">
                <ImageSlot
                  aspectRatio="21/9"
                  shotDescription="Bilingual English and Arabic editorial art direction and campaign layouts"
                  alt="DF. Studio editorial and campaign production placeholder"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* H. INDUSTRIES AND HOSPITALITY */}
      <Section surface="off-white" reveal>
        <Container className="space-y-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <Eyebrow>Nine Industries</Eyebrow>
              <SectionHeading as="h2" size="h2">
                Built for complex commercial ecosystems.
              </SectionHeading>
              <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                Digital marketing is our expertise. The entire digital field is our perspective.
              </p>
              <div className="pt-2">
                <Link
                  to="/industries"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--electric-blue)] df-link-sweep"
                >
                  <span>Explore all nine industries</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ul className="divide-y divide-[var(--border-light)] border-y border-[var(--border-light)]">
                {INDUSTRIES.map((ind, idx) => (
                  <li key={ind.id}>
                    <Link
                      to={ind.path}
                      className="flex min-h-[48px] items-center justify-between gap-4 py-3 text-base font-bold text-[var(--near-black)] hover:text-[var(--electric-blue)] transition-colors"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-xs font-semibold tabular-nums text-[var(--ink-muted)]">
                          0{idx + 1}
                        </span>
                        <span>{ind.name}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Large Visually Distinct Hospitality Feature Block */}
          <div className="df-mesh-hospitality border border-[var(--border-dark)] p-8 sm:p-12 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-5">
              <Eyebrow tone="dark">Core Sector Expertise</Eyebrow>
              <SectionHeading as="h3" size="h1" slanted tone="dark">
                Built for hospitality performance.
              </SectionHeading>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--on-dark-muted)]">
                Hospitality is one of the most complex digital ecosystems. Pricing, demand trends,
                distribution channels, search visibility, guest experience, review sentiment, and
                seasonality all shape commercial performance. It is one of our core areas of
                expertise.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <LinkButton to="/hospitality" variant="on-dark">
                  <span>Explore Hospitality</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </LinkButton>
                <Link
                  to="/industries"
                  className="inline-flex min-h-[44px] items-center px-3 py-2 text-sm font-semibold text-[var(--off-white)] df-link-sweep"
                >
                  All Industries
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ImageSlot
                tone="dark"
                aspectRatio="4/3"
                shotDescription="Contemporary luxury hotel lobby and guest arrival experience at dusk"
                alt="Hospitality sector expertise placeholder"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* I. WHY DIGITAL FIELD + THE DF. VALUE */}
      <Section surface="tint" reveal>
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-3">
              <Eyebrow>Why Digital Field.</Eyebrow>
              <SectionHeading as="h2" size="h2">
                One master proposition. One philosophy.
              </SectionHeading>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <p className="text-lg leading-relaxed text-[var(--near-black)]">
                Strategy, technology, data, content, customer experience, and marketing working
                toward one business goal. DF. goes beyond managing channels to explain the broader
                factors influencing visibility, customer acquisition, revenue, and long-term growth.
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--magenta)]">
                Performance in Context.
              </p>
            </div>
          </div>

          <ValueList />
        </Container>
      </Section>

      {/* J. CONTACT / CONVERSION BAND */}
      <CtaBand />
    </>
  );
}

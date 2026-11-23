import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero3DSlot } from '../components/brand/Hero3DSlot';
import { ImageSlot } from '../components/brand/ImageSlot';
import { TridiMark } from '../components/brand/TridiMark';
import { EcosystemDiagram } from '../components/diagrams/EcosystemDiagram';
import { IntelligenceFramework } from '../components/diagrams/IntelligenceFramework';
import { PracticeConstellation } from '../components/diagrams/PracticeConstellation';
import { useIntro } from '../components/intro/IntroContext';
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
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function HomePage() {
  usePageMeta('/');
  const [dotsAligned, setDotsAligned] = useState(true);
  const { contentRevealAllowed } = useIntro();
  const reducedMotion = useReducedMotion();
  const showHeroContent = contentRevealAllowed || reducedMotion;

  return (
    <>
      {/* 01 HERO — Interactive Three.js DF Sculpture with Day/Night Adaptive Theme */}
      <Section
        id="home-hero"
        surface="hero-adaptive"
        withPattern
        className="pt-10 pb-16 sm:pt-14 sm:pb-24 min-h-[calc(100dvh-84px)] flex items-center"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div
              className={`lg:col-span-7 space-y-6 transition-[opacity,transform] duration-700 ease-[var(--ease-out)] ${
                showHeroContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-3">
                <TridiMark size={28} tone="auto" />
                <Eyebrow number="01" tone="auto">
                  Introduction · Digital Performance Consultancy
                </Eyebrow>
              </div>

              <SectionHeading as="h1" size="display" slanted tone="auto">
                SEE THE{' '}
                <GradientText>WHOLE FIELD.</GradientText>
              </SectionHeading>

              <SectionHeading as="h2" size="subheading" tone="auto">
                Performance in Context.
              </SectionHeading>

              <p className="max-w-[54ch] text-[length:var(--text-body)] leading-relaxed text-[var(--text-muted)]">
                Nothing performs in isolation. DF. is a Digital Performance &amp; Intelligence
                Consultancy that connects the signals others report separately.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <LinkButton to="/contact" variant="gradient" magnetic>
                  <span>Start a conversation</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 df-btn-arrow" />
                </LinkButton>
                <LinkButton to="/about" variant="secondary">
                  <span>See how we think</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 df-btn-arrow" />
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Hero3DSlot />
            </div>
          </div>
        </Container>
      </Section>

      {/* 02 THE PROBLEM — Typography-Led, T-Shape & L-Shape Framing */}
      <Section surface="off-white" reveal>
        <Container>
          <div className="df-frame-t border-b border-[var(--border-strong)] pt-8 pb-10">
            <Eyebrow number="02">The Fragmentation Problem</Eyebrow>
            <SectionHeading as="h2" size="h1" className="mt-4 max-w-4xl">
              Specialists optimize channels. Businesses inherit the gaps between them.
            </SectionHeading>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-[length:var(--text-body-lg)] leading-relaxed text-[var(--text-primary)]">
                The industry is highly specialized: one agency manages paid media, another SEO,
                another content, another websites, and another analytics.
              </p>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                Each produces valid insight inside its own silo, yet leadership is left with
                fragmented data, disconnected recommendations, and no clear view of what truly
                drives commercial performance.
              </p>

              <div className="pt-4">
                <svg
                  aria-label="Diagram showing disconnected channel metrics floating without an objective anchor"
                  role="img"
                  className="w-full max-w-md h-24 sm:h-28 border border-[var(--border-subtle)] bg-[var(--bg-tint)] p-3 text-[var(--text-primary)]"
                  viewBox="0 0 280 78"
                >
                  <text
                    x="12"
                    y="20"
                    fill="currentColor"
                    fillOpacity="0.72"
                    fontSize="12.5"
                    fontWeight="700"
                  >
                    SILOED CHANNEL REPORTS
                  </text>
                  <rect x="20" y="42" width="9" height="9" fill="currentColor" fillOpacity="0.55" />
                  <rect x="78" y="56" width="9" height="9" fill="currentColor" fillOpacity="0.55" />
                  <rect x="136" y="36" width="9" height="9" fill="currentColor" fillOpacity="0.55" />
                  <rect x="194" y="52" width="9" height="9" fill="currentColor" fillOpacity="0.55" />
                  <rect x="248" y="38" width="9" height="9" fill="currentColor" fillOpacity="0.55" />
                  <line
                    x1="32"
                    y1="46"
                    x2="72"
                    y2="58"
                    stroke="currentColor"
                    strokeOpacity="0.24"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="148"
                    y1="40"
                    x2="188"
                    y2="54"
                    stroke="currentColor"
                    strokeOpacity="0.24"
                    strokeDasharray="3 3"
                  />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-6 df-frame-l pl-4 sm:pl-8 pb-6 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--eyebrow-magenta)]">
                Claim, Then Reframe
              </p>
              <blockquote className="space-y-4">
                <p className="text-xl font-normal text-[var(--text-muted)]">
                  Most agencies ask: &ldquo;How do we improve the campaign?&rdquo;
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)]">
                  DF. asks: &ldquo;What is the business trying to achieve, and what across the
                  digital field is influencing it?&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </Container>
      </Section>

      {/* 03 NOTHING PERFORMS IN ISOLATION — Resolving Dots Interactive Visual */}
      <Section surface="tint" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-5">
              <Eyebrow number="03" accent="blue">
                The Alternative
              </Eyebrow>
              <SectionHeading as="h2" size="h2" slanted>
                Nothing Performs in Isolation.
              </SectionHeading>
              <p className="text-base leading-relaxed text-[var(--text-primary)]">
                Marketing, sales, brand, ecommerce, technology, customer experience, and analytics
                teams each see part of the picture. DF. connects the signals across the business
                ecosystem — aligning digital strategy with brand positioning, content, media, PR,
                customer insights, offline activities, and commercial goals.
              </p>
              <p className="text-base font-semibold text-[var(--text-primary)]">
                Outcome: understand not only what is performing, but why, what is influencing it,
                and what should happen next.
              </p>
            </div>

            {/* Interactive Scattered Dots -> One Fixed Point */}
            <div className="lg:col-span-6 df-card-surface df-ambient df-panel-hairline df-frame-l p-4 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Signal Alignment Model
                </span>
                <button
                  type="button"
                  aria-pressed={dotsAligned}
                  onClick={() => setDotsAligned((v) => !v)}
                  className="min-h-[44px] sm:min-h-[40px] px-4 py-1.5 border border-[var(--border-strong)] bg-[var(--bg-page)] text-xs font-bold uppercase tracking-[0.06em] text-[var(--text-primary)] hover:border-[var(--link-accent)] hover:text-[var(--link-accent)] df-slant-block df-interactive df-chip-wipe"
                >
                  <span className="relative z-10 df-unslant inline-block">
                    {dotsAligned ? 'Show Disconnected State' : 'Resolve to Business Objective'}
                  </span>
                </button>
              </div>

              <svg
                aria-label={
                  dotsAligned
                    ? 'Signals across brand, content, search, media, CX, and offline resolving to one fixed business objective dot'
                    : 'Scattered unaligned channel signals'
                }
                role="img"
                className="w-full aspect-[340/215] sm:h-60 sm:aspect-auto border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)]"
                viewBox="0 0 340 215"
              >
                {dotsAligned && (
                  <g
                    style={{ stroke: 'var(--link-accent)' }}
                    strokeOpacity="0.62"
                    strokeWidth="1.5"
                  >
                    <line x1="58" y1="34" x2="170" y2="108" />
                    <line x1="62" y1="174" x2="170" y2="108" />
                    <line x1="170" y1="26" x2="170" y2="108" />
                    <line x1="282" y1="34" x2="170" y2="108" />
                    <line x1="282" y1="174" x2="170" y2="108" />
                    <line x1="170" y1="182" x2="170" y2="108" />
                  </g>
                )}

                {[
                  { label: 'Brand', x: dotsAligned ? 58 : 38, y: dotsAligned ? 34 : 24 },
                  { label: 'Media', x: dotsAligned ? 62 : 46, y: dotsAligned ? 174 : 184 },
                  { label: 'Search', x: dotsAligned ? 170 : 142, y: dotsAligned ? 26 : 42 },
                  { label: 'Content', x: dotsAligned ? 282 : 292, y: dotsAligned ? 34 : 24 },
                  { label: 'CX & CRM', x: dotsAligned ? 282 : 288, y: dotsAligned ? 174 : 184 },
                  { label: 'Offline & PR', x: dotsAligned ? 170 : 210, y: dotsAligned ? 182 : 172 },
                ].map((pt) => (
                  <g key={pt.label} className="transition-all duration-500">
                    <rect
                      x={pt.x - 5}
                      y={pt.y - 5}
                      width="10"
                      height="10"
                      style={{ fill: dotsAligned ? 'var(--link-accent)' : 'currentColor' }}
                      fillOpacity={dotsAligned ? 1 : 0.45}
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 21}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="16"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {/* Fixed Objective Anchor Dot */}
                <rect x="161" y="99" width="18" height="18" style={{ fill: 'var(--magenta)' }} />
                <text
                  x="170"
                  y="136"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                  fontWeight="800"
                >
                  BUSINESS OBJECTIVE
                </text>
              </svg>
            </div>
          </div>
        </Container>
      </Section>

      {/* 04 DIGITAL ECOSYSTEM FRAMEWORK — Interactive */}
      <Section id="ecosystem-framework" surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="max-w-3xl space-y-4">
            <Eyebrow number="04">{ECOSYSTEM_INTRO.eyebrow}</Eyebrow>
            <SectionHeading as="h2" size="h1">
              {ECOSYSTEM_INTRO.headline}
            </SectionHeading>
            <p className="text-lg leading-relaxed text-[var(--text-muted)]">
              {ECOSYSTEM_INTRO.description}
            </p>
          </div>

          <EcosystemDiagram />
        </Container>
      </Section>

      {/* 05 THE DF. INTELLIGENCE FRAMEWORK™ — Dark Gradient Mesh */}
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

      {/* 06 FIVE PRACTICE AREAS — Constellation */}
      <Section surface="off-white" reveal>
        <Container className="space-y-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7 space-y-3">
              <Eyebrow number="05">Five Practice Areas</Eyebrow>
              <SectionHeading as="h2" size="h1">
                Intelligence at the centre. Four practices in motion.
              </SectionHeading>
            </div>
            <div className="lg:col-span-5">
              <p className="text-base font-semibold text-[var(--text-primary)]">
                Every other practice produces activity. Intelligence is what turns that activity
                into decisions.
              </p>
            </div>
          </div>

          <PracticeConstellation />
        </Container>
      </Section>

      {/* 07 DF. STUDIO TEASER — Split-Screen */}
      <Section surface="tint" reveal>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <Eyebrow number="06">DF. Studio</Eyebrow>
              <SectionHeading as="h2" size="h1" slanted>
                Content in Context.
              </SectionHeading>
              <div className="space-y-3">
                <p className="text-base text-[var(--text-muted)]">
                  Most studios ask what will look good.
                </p>
                <p className="text-xl font-bold text-[var(--text-primary)]">
                  DF. Studio asks what the content needs to achieve.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {STUDIO_DISCIPLINES.map((disc, idx) => (
                  <Tag key={disc.id} accent={idx % 2 === 0 ? 'violet' : 'magenta'}>
                    {disc.title}
                  </Tag>
                ))}
              </div>

              <div className="pt-2">
                <LinkButton to="/studio" variant="primary">
                  <span>Explore DF. Studio</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageSlot
                aspectRatio="4/3"
                shotDescription="Creative professionals collaborating in a real working environment, natural light"
                alt="DF. Studio creative team collaboration visual slot"
              />
              <ImageSlot
                aspectRatio="4/3"
                tone="dark"
                shotDescription="Modern architectural hospitality interior framed for commercial campaign film"
                alt="DF. Studio hospitality production visual slot"
                className="hidden sm:block"
              />
              <div className="hidden sm:block sm:col-span-2">
                <ImageSlot
                  aspectRatio="21/9"
                  shotDescription="Bilingual English and Arabic editorial art direction and campaign layouts"
                  alt="DF. Studio editorial and campaign production visual slot"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 08 INDUSTRIES AND HOSPITALITY */}
      <Section surface="off-white" reveal>
        <Container className="space-y-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <Eyebrow number="07">Nine Industries</Eyebrow>
              <SectionHeading as="h2" size="h2">
                Built for complex commercial ecosystems.
              </SectionHeading>
              <p className="text-base leading-relaxed text-[var(--text-muted)]">
                Digital marketing is our expertise. The entire digital field is our perspective.
              </p>
              <div className="pt-2">
                <Link
                  to="/industries"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--link-accent)] df-link-sweep"
                >
                  <span>Explore all nine industries</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                {INDUSTRIES.map((ind, idx) => (
                  <li key={ind.id} className="df-row">
                    <Link
                      to={ind.path}
                      className="relative z-10 flex min-h-[48px] items-center justify-between gap-4 py-3 px-3 text-base font-bold text-[var(--text-primary)] hover:text-[var(--link-accent)]"
                    >
                      <span className="flex items-center gap-4">
                        <span className="df-row-num text-xs font-semibold tabular-nums text-[var(--text-muted)]">
                          0{idx + 1}
                        </span>
                        <span className="df-row-title">{ind.name}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="df-row-arrow h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Large Visually Distinct Hospitality Feature Block */}
          <div className="df-mesh-hospitality border border-[var(--border-dark)] p-5 sm:p-12 grid gap-8 lg:grid-cols-12 lg:items-center">
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
                <LinkButton to="/hospitality" variant="gradient">
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

            <div className="hidden lg:block lg:col-span-5">
              <ImageSlot
                tone="dark"
                aspectRatio="4/3"
                shotDescription="Contemporary luxury hotel lobby and guest arrival experience at dusk"
                alt="Hospitality sector expertise visual slot"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 09 WHY DIGITAL FIELD + THE DF. VALUE */}
      <Section surface="tint" reveal>
        <Container className="space-y-12">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-3">
              <Eyebrow number="08">Why Digital Field.</Eyebrow>
              <SectionHeading as="h2" size="h2">
                One master proposition. One philosophy.
              </SectionHeading>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <p className="text-lg leading-relaxed text-[var(--text-primary)]">
                Strategy, technology, data, content, customer experience, and marketing working
                toward one business goal. DF. goes beyond managing channels to explain the broader
                factors influencing visibility, customer acquisition, revenue, and long-term growth.
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
                Performance in Context.
              </p>
            </div>
          </div>

          <ValueList />
        </Container>
      </Section>

      {/* 10 CONTACT / CONVERSION BAND */}
      <CtaBand />
    </>
  );
}

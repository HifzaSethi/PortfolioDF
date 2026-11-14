import { useState, type KeyboardEvent } from 'react';
import { ArrowRight, ListTree } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ECOSYSTEM_NODES } from '../../data/ecosystem';
import type { EcosystemNode } from '../../types/content';

interface EcosystemDiagramProps {
  compact?: boolean;
}

export function EcosystemDiagram({ compact = false }: EcosystemDiagramProps) {
  const [activeId, setActiveId] = useState<string>(ECOSYSTEM_NODES[0].id);
  const [showListView, setShowListView] = useState(false);

  const activeIndex = ECOSYSTEM_NODES.findIndex((n) => n.id === activeId);
  const activeNode: EcosystemNode = ECOSYSTEM_NODES[activeIndex] ?? ECOSYSTEM_NODES[0];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % ECOSYSTEM_NODES.length;
      setActiveId(ECOSYSTEM_NODES[next].id);
      document.getElementById(`eco-node-${ECOSYSTEM_NODES[next].id}`)?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (index - 1 + ECOSYSTEM_NODES.length) % ECOSYSTEM_NODES.length;
      setActiveId(ECOSYSTEM_NODES[prev].id);
      document.getElementById(`eco-node-${ECOSYSTEM_NODES[prev].id}`)?.focus();
    } else if (event.key === 'Escape') {
      setActiveId(ECOSYSTEM_NODES[0].id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <span className="inline-block h-2.5 w-2.5 bg-[var(--magenta)] df-slant-block" aria-hidden="true" />
          <span>Fixed Objective Anchor: Business Objectives</span>
        </div>

        <button
          type="button"
          onClick={() => setShowListView((v) => !v)}
          className="inline-flex min-h-[40px] items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--link-accent)] hover:text-[var(--link-accent)] cursor-pointer"
        >
          <ListTree aria-hidden="true" className="h-4 w-4" />
          <span>{showListView ? 'Interactive Chain View' : 'Accessible List View'}</span>
        </button>
      </div>

      {showListView ? (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ECOSYSTEM_NODES.map((node) => (
            <li
              key={node.id}
              className="df-card-surface p-4"
            >
              <p className="text-xs font-bold tabular-nums text-[var(--link-accent)]">
                {String(node.order).padStart(2, '0')}
              </p>
              <h3 className="mt-1 text-sm font-bold text-[var(--text-primary)]">{node.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{node.summary}</p>
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Desktop Slanted SVG + Connected Chain / Mobile Vertical Stepped Path */}
          <div className="lg:col-span-7">
            <div
              className="hidden md:block relative df-card-surface p-6"
              role="group"
              aria-label="Digital Ecosystem Framework 10-node chain"
            >
              {/* Connecting SVG lines using CSS variables */}
              <svg
                aria-hidden="true"
                className="w-full h-14 mb-4"
                viewBox="0 0 800 56"
                preserveAspectRatio="none"
              >
                <line
                  x1="36"
                  y1="42"
                  x2="764"
                  y2="14"
                  stroke="var(--text-primary)"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                />
                <line
                  x1="36"
                  y1="42"
                  x2={36 + (activeIndex / 9) * 728}
                  y2={42 - (activeIndex / 9) * 28}
                  stroke="var(--link-accent)"
                  strokeWidth="3"
                />
                {ECOSYSTEM_NODES.map((node, idx) => {
                  const cx = 36 + (idx / 9) * 728;
                  const cy = 42 - (idx / 9) * 28;
                  const isCurrent = node.id === activeNode.id;
                  const isAnchor = idx === 0;
                  return (
                    <rect
                      key={node.id}
                      x={cx - (isCurrent ? 6 : 4)}
                      y={cy - (isCurrent ? 6 : 4)}
                      width={isCurrent ? 12 : 8}
                      height={isCurrent ? 12 : 8}
                      fill={
                        isAnchor
                          ? 'var(--magenta)'
                          : isCurrent
                            ? 'var(--link-accent)'
                            : 'var(--text-primary)'
                      }
                      fillOpacity={isCurrent || isAnchor ? 1 : 0.38}
                    />
                  );
                })}
              </svg>

              {/* 10 Nodes arranged in 2 slanted rows of 5 */}
              <div className="grid grid-cols-5 gap-2.5">
                {ECOSYSTEM_NODES.map((node, index) => {
                  const isSelected = node.id === activeNode.id;
                  const isNeighbor = Math.abs(index - activeIndex) === 1 || index === 0;
                  return (
                    <button
                      key={node.id}
                      id={`eco-node-${node.id}`}
                      type="button"
                      onClick={() => setActiveId(node.id)}
                      onMouseEnter={() => setActiveId(node.id)}
                      onFocus={() => setActiveId(node.id)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      aria-pressed={isSelected}
                      className={`group text-left p-3 border transition-all duration-150 cursor-pointer min-h-[84px] flex flex-col justify-between ${
                        isSelected
                          ? 'border-[var(--magenta)] bg-[var(--bg-card-active)] text-[var(--text-on-card-active)] shadow-sm'
                          : isNeighbor
                            ? 'border-[var(--border-strong)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--link-accent)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-tint)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <span className="flex items-center justify-between text-[11px] font-bold tabular-nums">
                        <span
                          className={
                            isSelected ? 'text-[var(--violet)]' : 'text-[var(--link-accent)]'
                          }
                        >
                          {String(node.order).padStart(2, '0')}
                        </span>
                        {index === 0 && (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 bg-[var(--magenta)]"
                            title="Objective Anchor"
                          />
                        )}
                      </span>
                      <span className="mt-2 block text-xs font-bold leading-snug">
                        {node.shortTitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-[var(--text-muted)]">
                Use arrow keys, hover, or select any node to trace how signals move from Business
                Objectives to Commercial Performance.
              </p>
            </div>

            {/* Mobile Vertical Stepped Path */}
            <div className="md:hidden space-y-2">
              {ECOSYSTEM_NODES.map((node, index) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveId(node.id)}
                    aria-expanded={isSelected}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left border min-h-[48px] cursor-pointer ${
                      isSelected
                        ? 'border-[var(--magenta)] bg-[var(--bg-card-active)] text-[var(--text-on-card-active)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-bold tabular-nums text-[var(--eyebrow-magenta)]">
                        {String(node.order).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold">{node.title}</span>
                    </span>
                    <span className="text-xs opacity-75">{index === 0 ? 'Anchor' : 'Inspect'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel with architectural L-frame */}
          <div
            aria-live="polite"
            className={`lg:col-span-5 df-card-surface df-frame-l ${
              compact ? 'p-6' : 'p-7 sm:p-8'
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--link-accent)] tabular-nums">
                Node {String(activeNode.order).padStart(2, '0')} / 10
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {activeNode.order === 1
                  ? 'Objective Anchor'
                  : `Connected to ${ECOSYSTEM_NODES[activeNode.order - 2]?.shortTitle}`}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {activeNode.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--text-primary)]">
              {activeNode.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-[var(--border-subtle)] py-4">
              {activeNode.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--magenta)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
              {activeNode.closingLine}
            </p>

            {activeNode.linkTo && (
              <div className="mt-5">
                <Link
                  to={activeNode.linkTo.path}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--link-accent)] df-link-sweep"
                >
                  <span>{activeNode.linkTo.label}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

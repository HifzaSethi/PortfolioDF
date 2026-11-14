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
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          <span className="inline-block h-2.5 w-2.5 bg-[var(--magenta)]" aria-hidden="true" />
          <span>Fixed Objective Anchor: Business Objectives</span>
        </div>

        <button
          type="button"
          onClick={() => setShowListView((v) => !v)}
          className="inline-flex min-h-[40px] items-center gap-2 border border-[var(--border-light-strong)] px-3.5 py-1.5 text-xs font-semibold text-[var(--near-black)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)] cursor-pointer"
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
              className="border border-[var(--border-light)] bg-[var(--paper-elevated)] p-4"
            >
              <p className="text-xs font-bold tabular-nums text-[var(--electric-blue)]">
                {String(node.order).padStart(2, '0')}
              </p>
              <h3 className="mt-1 text-sm font-bold text-[var(--near-black)]">{node.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">{node.summary}</p>
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Desktop Slanted SVG + Connected Chain / Mobile Vertical Stepped Path */}
          <div className="lg:col-span-7">
            {/* Desktop interactive chain */}
            <div
              className="hidden md:block relative border border-[var(--border-light)] bg-[var(--paper-elevated)] p-6"
              role="group"
              aria-label="Digital Ecosystem Framework 10-node chain"
            >
              {/* Connecting SVG lines */}
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
                  stroke="#010102"
                  strokeOpacity="0.18"
                  strokeWidth="2"
                />
                <line
                  x1="36"
                  y1="42"
                  x2={36 + (activeIndex / 9) * 728}
                  y2={42 - (activeIndex / 9) * 28}
                  stroke="#0057FF"
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
                      fill={isAnchor ? '#E23389' : isCurrent ? '#0057FF' : '#010102'}
                      fillOpacity={isCurrent || isAnchor ? 1 : 0.35}
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
                          ? 'border-[var(--electric-blue)] bg-[var(--near-black)] text-[var(--off-white)] shadow-sm'
                          : isNeighbor
                            ? 'border-[var(--border-light-strong)] bg-[var(--off-white)] text-[var(--near-black)] hover:border-[var(--electric-blue)]'
                            : 'border-[var(--border-light)] bg-[var(--off-white)]/65 text-[var(--near-black)]/70 hover:text-[var(--near-black)] hover:border-[var(--border-light-strong)]'
                      }`}
                    >
                      <span className="flex items-center justify-between text-[11px] font-bold tabular-nums">
                        <span
                          className={
                            isSelected ? 'text-[var(--violet)]' : 'text-[var(--electric-blue)]'
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

              <p className="mt-4 text-xs text-[var(--ink-muted)]">
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
                        ? 'border-[var(--electric-blue)] bg-[var(--near-black)] text-[var(--off-white)]'
                        : 'border-[var(--border-light)] bg-[var(--paper-elevated)] text-[var(--near-black)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-bold tabular-nums text-[var(--magenta)]">
                        {String(node.order).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-bold">{node.title}</span>
                    </span>
                    <span className="text-xs opacity-70">{index === 0 ? 'Anchor' : 'Inspect'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div
            aria-live="polite"
            className={`lg:col-span-5 border border-[var(--border-light-strong)] bg-[var(--paper-elevated)] ${
              compact ? 'p-6' : 'p-7 sm:p-8'
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-light)] pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--electric-blue)] tabular-nums">
                Node {String(activeNode.order).padStart(2, '0')} / 10
              </span>
              <span className="text-xs font-semibold text-[var(--ink-muted)]">
                {activeNode.order === 1
                  ? 'Objective Anchor'
                  : `Connected to ${ECOSYSTEM_NODES[activeNode.order - 2]?.shortTitle}`}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-[var(--near-black)]">
              {activeNode.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--near-black)]">
              {activeNode.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-[var(--border-light)] py-4">
              {activeNode.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)]"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--magenta)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm font-semibold text-[var(--near-black)]">
              {activeNode.closingLine}
            </p>

            {activeNode.linkTo && (
              <div className="mt-5">
                <Link
                  to={activeNode.linkTo.path}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--electric-blue)] df-link-sweep"
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

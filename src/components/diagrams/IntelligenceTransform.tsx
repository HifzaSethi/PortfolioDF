import { useEffect, useRef, type MutableRefObject } from 'react';
import { INTELLIGENCE_STAGES } from '../../data/intelligence';
import { useTheme } from '../../hooks/useTheme';

export type TransformMode = 'scrub' | 'autoplay' | 'reduced';

interface IntelligenceTransformProps {
  mode: TransformMode;
  activeIndex: number;
  progressRef: MutableRefObject<number>;
  replayNonce: number;
  onAutoplayAdvance?: (progress: number) => void;
  onSelectStage: (index: number) => void;
  onReplay: () => void;
}

interface Particle {
  x1: number;
  y1: number;
  seed: number;
  clusterIdx: number;
  cAngle: number;
  cRad: number;
  orbitAngle: number;
  orbitRad: number;
  streamT: number;
  streamSpread: number;
  size: number;
  colorIdx: number;
}

const CONTEXT_CLUSTER_LABELS = [
  'PR coverage',
  'Search demand',
  'Content mix',
  'Seasonality',
  'Pricing',
  'Offline activity',
];

const METRIC_CHIPS: Array<{ label: string; sub?: string; x: number; y: number; phase: number }> = [
  { label: 'Clicks', x: 0.16, y: 0.25, phase: 0.3 },
  { label: 'Impressions', x: 0.76, y: 0.24, phase: 1.7 },
  { label: 'CPC', x: 0.24, y: 0.76, phase: 2.9 },
  { label: 'CTR ↑ 12%', sub: 'Illustrative example', x: 0.69, y: 0.73, phase: 4.1 },
];

const CAUSE_TAGS: Array<{ label: string; x: number; y: number }> = [
  { label: 'Demand shift', x: 0.25, y: 0.31 },
  { label: 'Channel assist', x: 0.67, y: 0.31 },
  { label: 'Conversion drivers', x: 0.27, y: 0.73 },
];

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildParticles(count: number): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const phi = (i * 2.399963) % (Math.PI * 2);
    const u1 = ((i * 37 + 11) % 97) / 97;
    const u2 = ((i * 53 + 23) % 89) / 89;
    const u3 = ((i * 71 + 19) % 83) / 83;
    list.push({
      x1: 0.08 + u1 * 0.84,
      y1: 0.14 + u2 * 0.72,
      seed: i * 1.17,
      clusterIdx: i % CONTEXT_CLUSTER_LABELS.length,
      cAngle: phi + u1 * 0.6,
      cRad: 0.018 + u3 * 0.055,
      orbitAngle: phi,
      orbitRad: 0.012 + Math.pow(u2, 0.75) * 0.09,
      streamT: (i / count + u3 * 0.12) % 1,
      streamSpread: (u1 - 0.5) * 2,
      size: 2.2 + (i % 4) * 1.05,
      colorIdx: i % 3,
    });
  }
  return list;
}

export function IntelligenceTransform({
  mode,
  activeIndex,
  progressRef,
  replayNonce,
  onAutoplayAdvance,
  onSelectStage,
  onReplay,
}: IntelligenceTransformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const autoplayDoneRef = useRef(false);
  const onAutoplayRef = useRef(onAutoplayAdvance);
  onAutoplayRef.current = onAutoplayAdvance;

  useEffect(() => {
    autoplayDoneRef.current = false;
  }, [replayNonce, mode]);

  useEffect(() => {
    if (mode === 'reduced') return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobileViewport = window.innerWidth < 768;
    const isLowPower =
      isMobileViewport || (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4);
    const particleCount = isMobileViewport ? 70 : 140;
    const particles = buildParticles(particleCount);
    const minFrameMs = isLowPower ? 1000 / 30 : 0;

    let inView = true;
    let width = Math.max(280, host.clientWidth);
    let height = Math.max(210, host.clientHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!host || !canvas) return;
      width = Math.max(280, host.clientWidth);
      height = Math.max(210, host.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resizeCanvas();

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
      },
      { threshold: 0.08 }
    );
    io.observe(host);

    const isInsideDarkContainer = () => Boolean(host.closest('.df-mesh-dark, .df-mesh-hospitality'));

    let rafId = 0;
    let lastTime = performance.now();
    let lastDrawTime = 0;
    let timeSec = 0;
    let disposed = false;

    const paletteColors = ['#B34FFF', '#E23389', '#0057FF'];
    const slantedSkew = -0.21256; // tan(-12deg)

    const drawSlantRect = (x: number, y: number, w: number, h: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, slantedSkew, 1, 0, 0);
      ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
      ctx.restore();
    };

    const drawChip = (
      cx: number,
      cy: number,
      label: string,
      sub: string | undefined,
      alpha: number,
      darkBg: boolean,
      accentStroke?: string
    ) => {
      if (alpha <= 0.02) return;
      ctx.save();
      ctx.globalAlpha = clamp01(alpha);
      ctx.font = '600 11px Sora, sans-serif';
      const tw = ctx.measureText(label).width;
      const pw = Math.max(58, tw + 22);
      const ph = sub ? 34 : 24;

      ctx.translate(cx, cy);
      ctx.transform(1, 0, slantedSkew, 1, 0, 0);
      ctx.fillStyle = darkBg ? 'rgba(1, 1, 2, 0.78)' : 'rgba(244, 241, 234, 0.88)';
      ctx.strokeStyle =
        accentStroke ?? (darkBg ? 'rgba(244, 241, 234, 0.28)' : 'rgba(1, 1, 2, 0.24)');
      ctx.lineWidth = 1;
      ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
      ctx.strokeRect(-pw * 0.5, -ph * 0.5, pw, ph);

      ctx.transform(1, 0, -slantedSkew, 1, 0, 0);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = darkBg ? '#F4F1EA' : '#010102';
      ctx.fillText(label, 0, sub ? -5 : 0);
      if (sub) {
        ctx.font = '500 8.5px Sora, sans-serif';
        ctx.fillStyle = darkBg ? 'rgba(244, 241, 234, 0.62)' : 'rgba(1, 1, 2, 0.62)';
        ctx.fillText(sub, 0, 8);
      }
      ctx.restore();
    };

    const clusterCenters = [
      { x: 0.18, y: 0.28 },
      { x: 0.44, y: 0.22 },
      { x: 0.73, y: 0.27 },
      { x: 0.23, y: 0.72 },
      { x: 0.52, y: 0.77 },
      { x: 0.80, y: 0.69 },
    ];

    const screenPtsX = new Float32Array(particleCount);
    const screenPtsY = new Float32Array(particleCount);

    const renderFrame = (now: number) => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(renderFrame);

      if (!inView || document.hidden) {
        lastTime = now;
        return;
      }

      if (minFrameMs > 0 && now - lastDrawTime < minFrameMs) {
        return;
      }
      lastDrawTime = now;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timeSec += dt;

      if (modeRef.current === 'autoplay' && !autoplayDoneRef.current) {
        const nextP = clamp01(progressRef.current + dt / 9);
        progressRef.current = nextP;
        onAutoplayRef.current?.(nextP);
        if (nextP >= 1) {
          autoplayDoneRef.current = true;
        }
      }

      const p = clamp01(progressRef.current);
      const darkBg = isInsideDarkContainer() || themeRef.current === 'night';

      // Stage weights with smooth overlapping transitions
      const wContext = smoothstep(0.18, 0.34, p);
      const wIntel = smoothstep(0.45, 0.62, p);
      const wAction = smoothstep(0.70, 0.86, p);

      const dotCx = width * 0.43;
      const dotCy = height * 0.50;
      const chartStartX = width * 0.63;
      const chartEndX = width * 0.90;
      const chartBaseY = height * 0.72;
      const chartTopY = height * 0.26;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Subtle architectural grid lines
      ctx.strokeStyle = darkBg ? 'rgba(244, 241, 234, 0.055)' : 'rgba(1, 1, 2, 0.06)';
      ctx.lineWidth = 1;
      for (let gx = width * 0.2; gx < width; gx += width * 0.2) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5);
      ctx.lineTo(width, height * 0.5);
      ctx.stroke();

      // Compute all particle coordinates across stages
      for (let i = 0; i < particleCount; i++) {
        const pt = particles[i];

        // 1. DATA: scattered jittering slanted squares
        const jitterX = Math.sin(timeSec * 2.1 + pt.seed) * 4.5 * (1 - wContext);
        const jitterY = Math.cos(timeSec * 1.9 + pt.seed * 1.3) * 4.5 * (1 - wContext);
        const xData = pt.x1 * width + jitterX;
        const yData = pt.y1 * height + jitterY;

        // 2. CONTEXT: 6 clusters with gentle orbital motion
        const cc = clusterCenters[pt.clusterIdx];
        const cTheta = pt.cAngle + timeSec * 0.35;
        const xCtx = cc.x * width + Math.cos(cTheta) * pt.cRad * width;
        const yCtx = cc.y * height + Math.sin(cTheta) * pt.cRad * height * 1.3;

        // 3. INTELLIGENCE: fused lattice resolving on the central DF dot
        const iTheta = pt.orbitAngle + timeSec * 0.45;
        const radScale = (1 - smoothstep(0.56, 0.72, p) * 0.62) * pt.orbitRad;
        const xIntel = dotCx + Math.cos(iTheta) * radScale * width;
        const yIntel = dotCy + Math.sin(iTheta) * radScale * height * 1.35;

        // 4. ACTION: particles streaming along the rising beam toward Commercial growth
        const streamPos = (pt.streamT + timeSec * 0.22) % 1;
        const targetBeamY = lerp(dotCy, lerp(chartBaseY - 12, chartTopY + 12, streamPos), streamPos);
        const xAct = lerp(dotCx + 14, chartEndX - 8, streamPos);
        const yAct = targetBeamY + pt.streamSpread * (4 + streamPos * 10);

        let px = lerp(xData, xCtx, wContext);
        let py = lerp(yData, yCtx, wContext);
        px = lerp(px, xIntel, wIntel);
        py = lerp(py, yIntel, wIntel);
        px = lerp(px, xAct, wAction);
        py = lerp(py, yAct, wAction);

        screenPtsX[i] = px;
        screenPtsY[i] = py;
      }

      // Draw proximity links in Context & Intelligence phases
      const linkWeight = wContext * (1 - wAction * 0.85);
      if (linkWeight > 0.04) {
        const threshold = lerp(74, 128, wIntel);
        const maxDistSq = threshold * threshold;
        ctx.lineWidth = lerp(0.8, 1.15, wIntel);

        for (let i = 0; i < particleCount; i += isMobileViewport ? 1 : 2) {
          const ax = screenPtsX[i];
          const ay = screenPtsY[i];
          for (let j = i + 1; j < Math.min(particleCount, i + 14); j++) {
            const dx = screenPtsX[j] - ax;
            const dy = screenPtsY[j] - ay;
            const dSq = dx * dx + dy * dy;
            if (dSq < maxDistSq && dSq > 4) {
              const proximity = 1 - Math.sqrt(dSq) / threshold;
              const alpha = proximity * lerp(0.24, 0.42, wIntel) * linkWeight;
              ctx.strokeStyle =
                i % 3 === 0
                  ? `rgba(179, 79, 255, ${alpha.toFixed(3)})`
                  : i % 3 === 1
                    ? `rgba(226, 51, 137, ${alpha.toFixed(3)})`
                    : darkBg
                      ? `rgba(0, 87, 255, ${(alpha * 1.15).toFixed(3)})`
                      : `rgba(1, 1, 2, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(screenPtsX[j], screenPtsY[j]);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Action slanted light beam & rising "Commercial growth" silhouette
      if (wAction > 0.02) {
        ctx.save();
        ctx.globalAlpha = wAction;
        if (darkBg) ctx.globalCompositeOperation = 'lighter';

        const beamGrad = ctx.createLinearGradient(dotCx, dotCy, chartEndX, chartTopY);
        beamGrad.addColorStop(0, 'rgba(226, 51, 137, 0.62)');
        beamGrad.addColorStop(0.55, 'rgba(179, 79, 255, 0.36)');
        beamGrad.addColorStop(1, 'rgba(0, 87, 255, 0.14)');
        ctx.fillStyle = beamGrad;

        ctx.beginPath();
        ctx.moveTo(dotCx + 6, dotCy - 6);
        ctx.lineTo(chartEndX, chartTopY - 10);
        ctx.lineTo(chartEndX, chartBaseY - 12);
        ctx.lineTo(dotCx + 6, dotCy + 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Rising step-chart silhouette (no fabricated numbers)
        ctx.save();
        ctx.globalAlpha = wAction;
        const barSteps = 6;
        const barW = (chartEndX - chartStartX) / barSteps - 6;
        for (let b = 0; b < barSteps; b++) {
          const frac = (b + 1) / barSteps;
          const bh = lerp(18, chartBaseY - chartTopY, Math.pow(frac, 1.15));
          const bx = chartStartX + b * ((chartEndX - chartStartX) / barSteps);
          const by = chartBaseY - bh * wAction;
          ctx.fillStyle =
            b === barSteps - 1
              ? '#0057FF'
              : b >= barSteps - 2
                ? 'rgba(226, 51, 137, 0.85)'
                : darkBg
                  ? 'rgba(179, 79, 255, 0.56)'
                  : 'rgba(179, 79, 255, 0.72)';
          ctx.save();
          ctx.translate(bx + barW * 0.5, by + (bh * wAction) * 0.5);
          ctx.transform(1, 0, slantedSkew * 0.5, 1, 0, 0);
          ctx.fillRect(-barW * 0.5, -(bh * wAction) * 0.5, barW, bh * wAction);
          ctx.restore();
        }

        // Baseline + Commercial growth label
        ctx.strokeStyle = darkBg ? 'rgba(244, 241, 234, 0.36)' : 'rgba(1, 1, 2, 0.36)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chartStartX - 6, chartBaseY + 2);
        ctx.lineTo(chartEndX + 4, chartBaseY + 2);
        ctx.stroke();

        ctx.font = '700 11px Sora, sans-serif';
        ctx.fillStyle = darkBg ? '#F4F1EA' : '#010102';
        ctx.textAlign = 'left';
        ctx.fillText('COMMERCIAL GROWTH', chartStartX, chartBaseY + 20);
        ctx.restore();
      }

      // Draw particles
      ctx.save();
      if (darkBg && wContext > 0.25) {
        ctx.globalCompositeOperation = 'lighter';
      }
      for (let i = 0; i < particleCount; i++) {
        const pt = particles[i];
        const px = screenPtsX[i];
        const py = screenPtsY[i];
        const colorWeight = wContext;
        const alpha = lerp(0.36 + (i % 4) * 0.06, 0.82, Math.max(wContext, wIntel));

        if (colorWeight < 0.08) {
          ctx.fillStyle = darkBg
            ? `rgba(244, 241, 234, ${alpha.toFixed(2)})`
            : `rgba(1, 1, 2, ${alpha.toFixed(2)})`;
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = paletteColors[pt.colorIdx];
        }
        drawSlantRect(px, py, pt.size, pt.size);
      }
      ctx.restore();

      // Stage 3 & 4 central slanted magenta DF. Dot resolution + lock pulse
      if (wIntel > 0.08) {
        const pulse = Math.sin(clamp01((p - 0.52) / 0.22) * Math.PI);
        const haloR = lerp(18, 66, wIntel) + pulse * 18;
        ctx.save();
        if (darkBg) ctx.globalCompositeOperation = 'lighter';
        const radGrad = ctx.createRadialGradient(dotCx, dotCy, 2, dotCx, dotCy, haloR);
        radGrad.addColorStop(0, `rgba(226, 51, 137, ${(0.78 * wIntel).toFixed(2)})`);
        radGrad.addColorStop(0.55, `rgba(179, 79, 255, ${(0.32 * wIntel).toFixed(2)})`);
        radGrad.addColorStop(1, 'rgba(179, 79, 255, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(dotCx, dotCy, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Central slanted DF square dot
        ctx.save();
        ctx.globalAlpha = wIntel;
        ctx.fillStyle = '#E23389';
        const dotSize = lerp(10, 18, wIntel) * (1 - wAction * 0.12);
        drawSlantRect(dotCx, dotCy, dotSize, dotSize);
        ctx.restore();
      }

      // Stage 1 metric chips (Clicks, Impressions, CPC, CTR ↑ 12% Illustrative example)
      const dataAlpha = 1 - smoothstep(0.18, 0.30, p);
      if (dataAlpha > 0.02) {
        for (const chip of METRIC_CHIPS) {
          const driftX = Math.sin(timeSec * 0.9 + chip.phase) * 7;
          const driftY = Math.cos(timeSec * 0.75 + chip.phase) * 5;
          drawChip(
            chip.x * width + driftX,
            chip.y * height + driftY,
            chip.label,
            chip.sub,
            dataAlpha,
            darkBg
          );
        }
      }

      // Stage 2 context cluster labels
      const ctxLabelAlpha = smoothstep(0.22, 0.32, p) * (1 - smoothstep(0.46, 0.56, p));
      if (ctxLabelAlpha > 0.02) {
        for (let c = 0; c < clusterCenters.length; c++) {
          const cc = clusterCenters[c];
          drawChip(
            cc.x * width,
            cc.y * height - 22,
            CONTEXT_CLUSTER_LABELS[c],
            undefined,
            ctxLabelAlpha,
            darkBg,
            paletteColors[c % 3]
          );
        }
      }

      // Stage 3 Intelligence cause tags
      const intelLabelAlpha = smoothstep(0.52, 0.62, p) * (1 - smoothstep(0.73, 0.82, p));
      if (intelLabelAlpha > 0.02) {
        for (let t = 0; t < CAUSE_TAGS.length; t++) {
          const tag = CAUSE_TAGS[t];
          drawChip(
            tag.x * width,
            tag.y * height,
            tag.label,
            undefined,
            intelLabelAlpha,
            darkBg,
            '#E23389'
          );
        }
      }

      ctx.restore();
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [mode, progressRef]);

  if (mode === 'reduced') {
    const activeStage = INTELLIGENCE_STAGES[activeIndex] ?? INTELLIGENCE_STAGES[0];
    return (
      <div
        className="df-glass-dark p-5 sm:p-6 space-y-4"
        aria-label="DF. Intelligence Framework visual progression"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-dark)] pb-3">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--magenta)]">
            Stage 0{activeIndex + 1} · {activeStage.label}
          </span>
          <span className="text-xs text-[var(--on-dark-muted)]">{activeStage.question}</span>
        </div>

        <div className="min-h-[156px] flex flex-col justify-center">
          {activeIndex === 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {METRIC_CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className="border border-[var(--border-dark-strong)] bg-[var(--near-black)]/70 px-3.5 py-2 df-slant-block"
                >
                  <div className="df-unslant">
                    <p className="text-sm font-bold text-[var(--off-white)]">{chip.label}</p>
                    {chip.sub && (
                      <p className="text-[10px] text-[var(--on-dark-subtle)]">{chip.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeIndex === 1 && (
            <div className="flex flex-wrap gap-2.5">
              {CONTEXT_CLUSTER_LABELS.map((label, idx) => (
                <span
                  key={label}
                  className="border border-[var(--border-dark-strong)] bg-[var(--near-black)]/70 px-3.5 py-2 text-xs font-bold text-[var(--off-white)] df-slant-block"
                  style={{
                    borderColor:
                      idx % 3 === 0
                        ? 'var(--violet)'
                        : idx % 3 === 1
                          ? 'var(--magenta)'
                          : 'var(--electric-blue)',
                  }}
                >
                  <span className="df-unslant block">{label}</span>
                </span>
              ))}
            </div>
          )}

          {activeIndex === 2 && (
            <div className="flex flex-wrap items-center gap-5">
              <span
                aria-hidden="true"
                className="h-7 w-7 bg-[var(--magenta)] df-slant-block shadow-[0_0_24px_var(--glow-magenta)]"
              />
              <div className="flex flex-wrap gap-2.5">
                {CAUSE_TAGS.map((tag) => (
                  <span
                    key={tag.label}
                    className="border border-[var(--magenta)] bg-[var(--magenta-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--off-white)]"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeIndex === 3 && (
            <div className="flex flex-wrap items-center gap-6">
              <span
                aria-hidden="true"
                className="h-6 w-6 bg-[var(--magenta)] df-slant-block"
              />
              <span
                aria-hidden="true"
                className="h-0.5 w-20 df-gradient-accent"
              />
              <div className="flex items-end gap-1.5 h-16" aria-hidden="true">
                {[24, 34, 44, 56, 64].map((h, idx) => (
                  <span
                    key={h}
                    className="w-3 bg-[var(--electric-blue)] df-slant-block"
                    style={{
                      height: `${h}%`,
                      opacity: 0.45 + idx * 0.13,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--off-white)]">
                Commercial growth
              </span>
            </div>
          )}
        </div>

        <p className="sr-only">
          Four transformation stages: Data shows disconnected metrics (Clicks, Impressions, CPC, CTR
          up 12 percent illustrative example); Context clusters surrounding influences; Intelligence
          resolves signals onto the core business objective dot; Action directs commercial growth.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={hostRef}
        className="relative df-glass-dark overflow-hidden h-[220px] sm:h-[250px] xl:h-[280px] border border-[var(--border-dark-strong)]"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="block h-full w-full"
        />

        {/* Quick visible stage jump buttons + Replay when in autoplay */}
        <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div
            className="flex flex-wrap gap-1.5 pointer-events-auto"
            role="group"
            aria-label="Jump to transformation stage"
          >
            {INTELLIGENCE_STAGES.map((stage, idx) => {
              const current = idx === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => onSelectStage(idx)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] border df-slant-block transition-colors ${
                    current
                      ? 'border-[var(--magenta)] bg-[var(--magenta)] text-[var(--near-black)]'
                      : 'border-[var(--border-dark-strong)] bg-[var(--near-black)]/75 text-[var(--off-white)]/85 hover:border-[var(--violet)]'
                  }`}
                >
                  <span className="df-unslant block">
                    0{idx + 1} {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

          {mode === 'autoplay' && (
            <button
              type="button"
              onClick={onReplay}
              className="pointer-events-auto px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] border border-[var(--border-dark-strong)] bg-[var(--near-black)]/80 text-[var(--off-white)] hover:border-[var(--electric-blue)] df-slant-block"
            >
              <span className="df-unslant block">Replay</span>
            </button>
          )}
        </div>

        <p className="sr-only">
          Interactive transformation visualization: Data shows scattered signals and metric chips
          including Clicks, Impressions, CPC, and CTR up 12 percent as an illustrative example;
          Context groups PR coverage, Search demand, Content mix, Seasonality, Pricing, and
          Offline activity into clusters; Intelligence fuses all signals onto the magenta DF dot;
          Action directs a slanted beam into rising Commercial growth.
        </p>
      </div>
    </div>
  );
}

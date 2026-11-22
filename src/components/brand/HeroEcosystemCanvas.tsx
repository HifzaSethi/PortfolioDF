import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ECOSYSTEM_NODES } from '../../data/ecosystem';
import type { DfTheme } from '../../hooks/useTheme';
import { buildDfDotMesh, createDfMaterials, detectSoftwareGl } from './dfMark3D';

interface HeroEcosystemCanvasProps {
  theme: DfTheme;
  reducedMotion?: boolean;
  onReady?: () => void;
  onWebGLError?: () => void;
  onSelectNode?: (id: string) => void;
}

const NODE_GROUP_COLORS_NIGHT = [
  0xb34fff, 0xb34fff, 0xb34fff, // 01-03 Objectives, Brand, Content -> Violet
  0x0057ff, 0x0057ff, 0x0057ff, 0x0057ff, // 04-07 Search, Media, Web, CX -> Electric Blue
  0xe23389, 0xe23389, 0xe23389, // 08-10 Data, Intelligence, Commercial -> Magenta
];

const NODE_GROUP_COLORS_DAY = [
  0x8422d6, 0x8422d6, 0x8422d6,
  0x0046cf, 0x0046cf, 0x0046cf, 0x0046cf,
  0xc01d6e, 0xc01d6e, 0xc01d6e,
];

function createHaloTexture(colorHex: string, softAlpha: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 60);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.35, colorHex.replace('1)', `${softAlpha})`));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSlantedShardGeometry(): THREE.ExtrudeGeometry {
  const w = 0.24;
  const h = 0.30;
  const skew = Math.tan(THREE.MathUtils.degToRad(12)) * h;
  const shape = new THREE.Shape();
  shape.moveTo(-w * 0.5 - skew * 0.5, -h * 0.5);
  shape.lineTo(w * 0.5 - skew * 0.5, -h * 0.5);
  shape.lineTo(w * 0.5 + skew * 0.5, h * 0.5);
  shape.lineTo(-w * 0.5 + skew * 0.5, h * 0.5);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 2,
  });
  geom.center();
  return geom;
}

export default function HeroEcosystemCanvas({
  theme,
  reducedMotion = false,
  onReady,
  onWebGLError,
  onSelectNode,
}: HeroEcosystemCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<DfTheme>(theme);
  const reducedRef = useRef<boolean>(reducedMotion);
  const onReadyRef = useRef(onReady);
  const onWebGLErrorRef = useRef(onWebGLError);
  const onSelectNodeRef = useRef(onSelectNode);

  themeRef.current = theme;
  reducedRef.current = reducedMotion;
  onReadyRef.current = onReady;
  onWebGLErrorRef.current = onWebGLError;
  onSelectNodeRef.current = onSelectNode;

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const activeIdxRef = useRef<number | null>(null);
  const keyboardIdxRef = useRef<number | null>(null);
  const projectedRef = useRef<Float32Array>(new Float32Array(ECOSYSTEM_NODES.length * 2));
  const containerSizeRef = useRef<{ w: number; h: number }>({ w: 480, h: 480 });
  const requestStaticRenderRef = useRef<(() => void) | null>(null);

  const syncTooltipPosition = useCallback((idx: number | null) => {
    const tip = tooltipRef.current;
    if (!tip) return;
    if (idx === null) {
      tip.style.opacity = '0';
      return;
    }
    const { w, h } = containerSizeRef.current;
    const px = projectedRef.current[idx * 2];
    const py = projectedRef.current[idx * 2 + 1];
    const clampedX = Math.max(88, Math.min(w - 88, px));
    const clampedY = Math.max(44, Math.min(h - 44, py - 24));
    tip.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
    tip.style.opacity = '1';
  }, []);

  const setHoveredOrFocused = useCallback(
    (idx: number | null) => {
      activeIdxRef.current = idx;
      setActiveIdx(idx);
      syncTooltipPosition(idx);
      if (reducedRef.current) {
        requestStaticRenderRef.current?.();
      }
    },
    [syncTooltipPosition]
  );

  const activateNodeByIndex = useCallback((idx: number) => {
    const node = ECOSYSTEM_NODES[idx];
    if (!node) return;
    onSelectNodeRef.current?.(node.id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onWebGLErrorRef.current?.();
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      renderer.dispose();
      onWebGLErrorRef.current?.();
      return;
    }

    const isSoftwareGl = detectSoftwareGl(gl);
    const isMobile = window.innerWidth < 768;
    const initialDpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const softwareScale = isSoftwareGl ? 0.5 : 1;

    renderer.setPixelRatio(initialDpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = themeRef.current === 'night' ? 1.28 : 1.15;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fogNight = new THREE.FogExp2(0x010102, 0.042);
    const fogDay = new THREE.FogExp2(0xf4f1ea, 0.028);
    scene.fog = themeRef.current === 'night' ? fogNight : fogDay;

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 280);
    containerSizeRef.current = { w: width, h: height };
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const baseZ = width < 420 ? 8.1 : 6.9;
    camera.position.set(0, 0.05, baseZ);

    renderer.setSize(
      Math.max(140, Math.round(width * softwareScale)),
      Math.max(140, Math.round(height * softwareScale)),
      false
    );

    const disposables: Array<{ dispose: () => void }> = [];

    let envTarget: THREE.WebGLRenderTarget | null = null;
    if (!isSoftwareGl) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envTarget = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envTarget.texture;
      roomEnv.dispose();
      pmrem.dispose();
      disposables.push(envTarget);
    } else {
      const hemi = new THREE.HemisphereLight(0xf4f1ea, 0x261038, 1.3);
      scene.add(hemi);
    }

    // Approved palette lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xf4f1ea, 1.8);
    keyLight.position.set(4.5, 5.2, 6);
    scene.add(keyLight);
    const violetRim = new THREE.PointLight(0xb34fff, 30, 18, 1.5);
    violetRim.position.set(-4.5, -2.5, 2.5);
    scene.add(violetRim);
    const magentaRim = new THREE.PointLight(0xe23389, 34, 18, 1.5);
    magentaRim.position.set(4.2, -1.8, 2.8);
    scene.add(magentaRim);
    const blueKicker = new THREE.DirectionalLight(0x0057ff, 1.6);
    blueKicker.position.set(-3.2, 4.2, -2.5);
    scene.add(blueKicker);

    const constellation = new THREE.Group();
    scene.add(constellation);

    // Central glossy magenta DF dot centerpiece
    const { dotMaterial } = createDfMaterials(themeRef.current, isSoftwareGl);
    disposables.push(dotMaterial);
    const { dotGroup, geometries: dotGeoms } = buildDfDotMesh(dotMaterial);
    disposables.push(...dotGeoms);
    dotGroup.scale.setScalar(1.58);
    constellation.add(dotGroup);

    const coreHaloTex = createHaloTexture('rgba(226, 51, 137, 1)', 0.48);
    const coreHaloMat = new THREE.SpriteMaterial({
      map: coreHaloTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const coreHalo = new THREE.Sprite(coreHaloMat);
    coreHalo.scale.set(2.1, 2.1, 1);
    constellation.add(coreHalo);
    disposables.push(coreHaloTex, coreHaloMat);

    // Node slanted shard geometry & group halo textures
    const shardGeom = createSlantedShardGeometry();
    disposables.push(shardGeom);

    const haloVioletTex = createHaloTexture('rgba(179, 79, 255, 1)', 0.44);
    const haloBlueTex = createHaloTexture('rgba(0, 87, 255, 1)', 0.44);
    const haloMagentaTex = createHaloTexture('rgba(226, 51, 137, 1)', 0.44);
    disposables.push(haloVioletTex, haloBlueTex, haloMagentaTex);

    interface NodeSceneItem {
      pivot: THREE.Group;
      mesh: THREE.Mesh;
      mat: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
      halo: THREE.Sprite;
      haloMat: THREE.SpriteMaterial;
      basePos: THREE.Vector3;
      phase: number;
      currentScale: number;
      currentOpacity: number;
    }

    const nodeItems: NodeSceneItem[] = [];
    const worldCenter = new THREE.Vector3(0, 0, 0);

    // 10 ecosystem nodes on a clean 3D loose spiral tapering inward toward the dot
    for (let i = 0; i < ECOSYSTEM_NODES.length; i++) {
      const frac = i / (ECOSYSTEM_NODES.length - 1);
      const angle = -Math.PI * 0.65 + frac * Math.PI * 3.15;
      const radius = 2.45 - frac * 1.05;
      const y = -1.18 + frac * 2.36;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.78;
      const basePos = new THREE.Vector3(x, y, z);

      const colorHex = NODE_GROUP_COLORS_NIGHT[i];
      const mat = isSoftwareGl
        ? new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: 0.28,
            metalness: 0.35,
            roughness: 0.28,
            transparent: true,
            opacity: 0.94,
          })
        : new THREE.MeshPhysicalMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: 0.24,
            metalness: 0.24,
            roughness: 0.12,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            transparent: true,
            opacity: 0.9,
          });
      disposables.push(mat);

      const mesh = new THREE.Mesh(shardGeom, mat);
      mesh.rotation.y = -angle * 0.35;

      const haloTex = i < 3 ? haloVioletTex : i < 7 ? haloBlueTex : haloMagentaTex;
      const haloMat = new THREE.SpriteMaterial({
        map: haloTex,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.scale.set(0.95, 0.95, 1);
      halo.position.z = -0.06;
      disposables.push(haloMat);

      const pivot = new THREE.Group();
      pivot.position.copy(basePos);
      pivot.add(halo);
      pivot.add(mesh);
      constellation.add(pivot);

      nodeItems.push({
        pivot,
        mesh,
        mat,
        halo,
        haloMat,
        basePos,
        phase: i * 0.87,
        currentScale: 1,
        currentOpacity: 0.94,
      });
    }

    // Arced chain links (i -> i+1 plus 9 -> core feedback) + fainter core links
    interface ChainLink {
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      fromIdx: number;
      toIdx: number; // -1 for core feedback
    }

    const chainLinks: ChainLink[] = [];
    for (let i = 0; i < nodeItems.length; i++) {
      const a = nodeItems[i].basePos;
      const isFeedback = i === nodeItems.length - 1;
      const b = isFeedback ? worldCenter : nodeItems[i + 1].basePos;
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      mid.addScaledVector(mid.clone().normalize(), isFeedback ? 0.32 : 0.42);

      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const pts = curve.getPoints(28);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: isFeedback ? 0xe23389 : 0xb34fff,
        transparent: true,
        opacity: isFeedback ? 0.36 : 0.28,
      });
      const line = new THREE.Line(geom, mat);
      constellation.add(line);
      disposables.push(geom, mat);

      chainLinks.push({
        curve,
        line,
        mat,
        fromIdx: i,
        toIdx: isFeedback ? -1 : i + 1,
      });
    }

    // Fainter links from each node to the core center
    const coreLinks: Array<{ curve: THREE.QuadraticBezierCurve3; mat: THREE.LineBasicMaterial }> = [];
    for (let i = 0; i < nodeItems.length; i++) {
      const a = nodeItems[i].basePos;
      const mid = a.clone().multiplyScalar(0.5);
      mid.y += 0.16;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, worldCenter);
      const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(16));
      const mat = new THREE.LineBasicMaterial({
        color: 0xf4f1ea,
        transparent: true,
        opacity: 0.12,
      });
      const line = new THREE.Line(geom, mat);
      constellation.add(line);
      disposables.push(geom, mat);
      coreLinks.push({ curve, mat });
    }

    // Traveling light pulses (InstancedMesh along curves)
    const pulseGeom = new THREE.OctahedronGeometry(0.055, 0);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(pulseGeom, pulseMat);

    interface PulseAgent {
      curveIdx: number;
      t: number;
      speed: number;
    }

    const pulseAgents: PulseAgent[] = [];
    for (let i = 0; i < chainLinks.length; i++) {
      pulseAgents.push({
        curveIdx: i,
        t: (i * 0.19) % 1,
        speed: 0.12 + (i % 4) * 0.022,
      });
    }
    for (let i = 0; i < 6; i++) {
      pulseAgents.push({
        curveIdx: 10 + i,
        t: (i * 0.27) % 1,
        speed: 0.14 + (i % 3) * 0.02,
      });
    }

    const pulseInstanced = new THREE.InstancedMesh(pulseGeom, pulseMat, pulseAgents.length);
    const cViolet = new THREE.Color(0xb34fff);
    const cBlue = new THREE.Color(0x0057ff);
    const cMagenta = new THREE.Color(0xe23389);
    for (let i = 0; i < pulseAgents.length; i++) {
      const col = i < 3 ? cViolet : i < 7 ? cBlue : cMagenta;
      pulseInstanced.setColorAt(i, col);
    }
    if (pulseInstanced.instanceColor) pulseInstanced.instanceColor.needsUpdate = true;
    constellation.add(pulseInstanced);

    // Sparse ambient dust (<= 52 points)
    let dustPoints: THREE.Points | null = null;
    const dustCount = 48;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (((i * 73) % 100) / 100 - 0.5) * 7.8;
      dustPositions[i * 3 + 1] = (((i * 41) % 100) / 100 - 0.5) * 6.4;
      dustPositions[i * 3 + 2] = -0.8 - ((i * 29) % 100) / 32;
      const c = i % 3 === 0 ? cViolet : i % 3 === 1 ? cMagenta : new THREE.Color(0xf4f1ea);
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeom.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    dustPoints = new THREE.Points(dustGeom, dustMat);
    scene.add(dustPoints);
    disposables.push(dustGeom, dustMat);

    // State & observers
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    let scrollProgress = 0;
    let isVisible = true;
    let contextLost = false;
    let disposed = false;
    let readyCalled = false;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0.4;
    let lastThemeApplied: DfTheme | null = null;

    let frameSamples = 0;
    let frameDeltaSumMs = 0;
    let adaptiveChecked = false;
    let lastSoftwareRenderMs = 0;

    const tempVec = new THREE.Vector3();
    const dummyObj = new THREE.Object3D();

    const applyThemeStyling = (activeTheme: DfTheme) => {
      if (!renderer || lastThemeApplied === activeTheme) return;
      lastThemeApplied = activeTheme;
      const isNight = activeTheme === 'night';

      scene.fog = isNight ? fogNight : fogDay;
      renderer.toneMappingExposure = isNight ? 1.28 : 1.15;
      ambientLight.intensity = isNight ? 0.42 : 0.85;
      keyLight.intensity = isNight ? 1.75 : 2.3;
      violetRim.intensity = isNight ? 32 : 16;
      magentaRim.intensity = isNight ? 36 : 18;
      blueKicker.intensity = isNight ? 1.7 : 1.15;

      dotMaterial.emissiveIntensity = isNight ? 0.62 : 0.28;
      coreHaloMat.blending = isNight ? THREE.AdditiveBlending : THREE.NormalBlending;
      coreHaloMat.opacity = isNight ? 0.72 : 0.36;

      pulseMat.blending = isNight ? THREE.AdditiveBlending : THREE.NormalBlending;
      pulseMat.opacity = isNight ? 0.92 : 0.78;
      dustMat.blending = isNight ? THREE.AdditiveBlending : THREE.NormalBlending;
      dustMat.opacity = isNight ? 0.48 : 0.22;

      const palette = isNight ? NODE_GROUP_COLORS_NIGHT : NODE_GROUP_COLORS_DAY;
      for (let i = 0; i < nodeItems.length; i++) {
        const item = nodeItems[i];
        item.mat.color.setHex(palette[i]);
        item.mat.emissive.setHex(palette[i]);
        item.mat.emissiveIntensity = isNight ? 0.26 : 0.14;
        item.haloMat.blending = isNight ? THREE.AdditiveBlending : THREE.NormalBlending;
      }

      for (const cl of chainLinks) {
        cl.mat.color.setHex(isNight ? (cl.toIdx === -1 ? 0xe23389 : 0xb34fff) : 0x010102);
      }
      for (const cl of coreLinks) {
        cl.mat.color.setHex(isNight ? 0xf4f1ea : 0x010102);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!renderer) return;
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 280);
        const h = Math.max(entry.contentRect.height, 260);
        containerSizeRef.current = { w, h };
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(
          Math.max(140, Math.round(w * softwareScale)),
          Math.max(140, Math.round(h * softwareScale)),
          false
        );
        if (reducedRef.current) {
          requestStaticRenderRef.current?.();
        }
      }
    });
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible) lastTime = performance.now();
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    const handleScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 600), 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      onWebGLErrorRef.current?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const stepAndRender = (dt: number, now: number, force = false) => {
      if (!renderer || contextLost || disposed) return;
      applyThemeStyling(themeRef.current);

      const isReduced = reducedRef.current;
      const isNight = themeRef.current === 'night';
      const active = activeIdxRef.current;

      if (!isReduced) {
        elapsed += dt;
        currentPointer.x += (targetPointer.x - currentPointer.x) * Math.min(dt * 5.5, 1);
        currentPointer.y += (targetPointer.y - currentPointer.y) * Math.min(dt * 5.5, 1);

        // Slow yaw (~0.035 rad/s), ±1.5% breathing, pointer parallax & scroll dolly
        constellation.rotation.y = elapsed * 0.035 + currentPointer.x * 0.34;
        constellation.rotation.x = currentPointer.y * 0.22;
        constellation.scale.setScalar(1 + Math.sin(elapsed * 0.85) * 0.015);
      } else {
        constellation.rotation.y = 0.14;
        constellation.rotation.x = 0.04;
        constellation.scale.setScalar(1);
      }

      const targetCamZ = (containerSizeRef.current.w < 420 ? 8.1 : 6.9) - scrollProgress * 0.55;
      camera.position.z = isReduced
        ? containerSizeRef.current.w < 420
          ? 8.1
          : 6.9
        : camera.position.z + (targetCamZ - camera.position.z) * Math.min(dt * 6, 1);
      camera.position.y = 0.05 - scrollProgress * 0.2;

      // Update nodes (drift + hover/focus highlight & dimming others to 55%)
      for (let i = 0; i < nodeItems.length; i++) {
        const item = nodeItems[i];
        const isTarget = active === i;
        const someActive = active !== null;

        if (!isReduced) {
          item.pivot.position.x = item.basePos.x + Math.sin(elapsed * 0.65 + item.phase) * 0.045;
          item.pivot.position.y = item.basePos.y + Math.cos(elapsed * 0.58 + item.phase * 1.2) * 0.055;
          item.pivot.position.z = item.basePos.z + Math.sin(elapsed * 0.52 + item.phase * 0.8) * 0.045;
        } else {
          item.pivot.position.copy(item.basePos);
        }

        const goalScale = isTarget ? 1.35 : someActive ? 0.94 : 1.0;
        const goalOpacity = someActive ? (isTarget ? 1.0 : 0.55) : 0.92;
        const blend = isReduced ? 1 : Math.min(dt * 9, 1);

        item.currentScale += (goalScale - item.currentScale) * blend;
        item.currentOpacity += (goalOpacity - item.currentOpacity) * blend;

        item.mesh.scale.setScalar(item.currentScale);
        item.mat.opacity = item.currentOpacity;
        item.haloMat.opacity = (isNight ? 0.56 : 0.28) * (isTarget ? 1.45 : someActive ? 0.55 : 1);
      }

      // Highlight connected chain links on hover/focus
      for (let i = 0; i < chainLinks.length; i++) {
        const cl = chainLinks[i];
        const connected = active !== null && (cl.fromIdx === active || cl.toIdx === active);
        const baseOp = isNight ? (cl.toIdx === -1 ? 0.34 : 0.26) : 0.32;
        cl.mat.opacity = active === null ? baseOp : connected ? 0.88 : baseOp * 0.55;
      }

      for (let i = 0; i < coreLinks.length; i++) {
        const baseOp = isNight ? 0.12 : 0.16;
        coreLinks[i].mat.opacity = active === null ? baseOp : active === i ? 0.62 : baseOp * 0.55;
      }

      // Update instanced traveling pulses
      pulseInstanced.visible = !isReduced;
      if (!isReduced) {
        for (let i = 0; i < pulseAgents.length; i++) {
          const agent = pulseAgents[i];
          const isChain = agent.curveIdx < 10;
          const curve = isChain
            ? chainLinks[agent.curveIdx].curve
            : coreLinks[agent.curveIdx - 10].curve;

          let speedMult = 1;
          if (active !== null) {
            if (isChain) {
              const cl = chainLinks[agent.curveIdx];
              if (cl.fromIdx === active || cl.toIdx === active) speedMult = 2.3;
            } else if (agent.curveIdx - 10 === active) {
              speedMult = 2.3;
            }
          }

          agent.t = (agent.t + dt * agent.speed * speedMult) % 1;
          curve.getPoint(agent.t, tempVec);
          dummyObj.position.copy(tempVec);
          dummyObj.scale.setScalar(speedMult > 1 ? 1.45 : 1.0);
          dummyObj.rotation.y = elapsed * 2.2 + i;
          dummyObj.updateMatrix();
          pulseInstanced.setMatrixAt(i, dummyObj.matrix);
        }
        pulseInstanced.instanceMatrix.needsUpdate = true;
      }

      if (isSoftwareGl && readyCalled && !force) {
        if (now - lastSoftwareRenderMs < 110) {
          return;
        }
      }
      if (isSoftwareGl) {
        lastSoftwareRenderMs = now;
      }

      renderer.render(scene, camera);

      // Screen-space projection for pointer hit test & tooltip positioning (zero Raycaster)
      const { w, h } = containerSizeRef.current;
      constellation.updateMatrixWorld(true);
      for (let i = 0; i < nodeItems.length; i++) {
        nodeItems[i].pivot.getWorldPosition(tempVec);
        tempVec.project(camera);
        projectedRef.current[i * 2] = (tempVec.x * 0.5 + 0.5) * w;
        projectedRef.current[i * 2 + 1] = (-tempVec.y * 0.5 + 0.5) * h;
      }

      if (active !== null) {
        syncTooltipPosition(active);
      }

      if (!readyCalled) {
        readyCalled = true;
        onReadyRef.current?.();
      }
    };

    requestStaticRenderRef.current = () => {
      stepAndRender(0, performance.now(), true);
    };

    // Initial render guarantees immediate non-blank visual
    stepAndRender(0, performance.now(), true);

    const animate = (now: number) => {
      if (disposed) return;
      if (reducedRef.current) return;
      rafId = window.requestAnimationFrame(animate);

      if (!isVisible || contextLost || document.hidden) {
        lastTime = now;
        return;
      }

      const rawDtMs = now - lastTime;
      lastTime = now;

      if (!adaptiveChecked && frameSamples < 60 && rawDtMs > 0 && rawDtMs < 200) {
        frameSamples += 1;
        frameDeltaSumMs += rawDtMs;
        if (frameSamples === 60) {
          adaptiveChecked = true;
          if (frameDeltaSumMs / 60 > 24 && renderer) {
            renderer.setPixelRatio(1);
            if (dustPoints) dustPoints.visible = false;
            coreHalo.visible = false;
            for (const item of nodeItems) item.halo.visible = false;
          }
        }
      }

      const dt = Math.min(rawDtMs / 1000, 0.05);
      stepAndRender(dt, now);
    };

    if (!reducedRef.current) {
      rafId = window.requestAnimationFrame(animate);
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      targetPointer.x = Math.max(-0.5, Math.min(0.5, lx / rect.width - 0.5));
      targetPointer.y = Math.max(-0.5, Math.min(0.5, ly / rect.height - 0.5));

      let bestIdx: number | null = null;
      let bestDist = 42;
      for (let i = 0; i < ECOSYSTEM_NODES.length; i++) {
        const px = projectedRef.current[i * 2];
        const py = projectedRef.current[i * 2 + 1];
        const d = Math.hypot(lx - px, ly - py);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }

      if (bestIdx !== activeIdxRef.current) {
        setHoveredOrFocused(bestIdx);
      }
    };

    const handlePointerLeave = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
      if (keyboardIdxRef.current === null && activeIdxRef.current !== null) {
        setHoveredOrFocused(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      let bestIdx = activeIdxRef.current;
      let bestDist = 48;
      for (let i = 0; i < ECOSYSTEM_NODES.length; i++) {
        const px = projectedRef.current[i * 2];
        const py = projectedRef.current[i * 2 + 1];
        const d = Math.hypot(lx - px, ly - py);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx !== null) {
        activateNodeByIndex(bestIdx);
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);

      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.dispose();
        renderer.domElement.remove();
      }

      for (const item of disposables) {
        item.dispose();
      }
    };
  }, [activateNodeByIndex, setHoveredOrFocused, syncTooltipPosition]);

  // Trigger a single re-render when theme toggles under reduced motion
  useEffect(() => {
    if (reducedMotion) {
      requestStaticRenderRef.current?.();
    }
  }, [theme, reducedMotion]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const count = ECOSYSTEM_NODES.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = keyboardIdxRef.current === null ? 0 : (keyboardIdxRef.current + 1) % count;
      keyboardIdxRef.current = next;
      setHoveredOrFocused(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev =
        keyboardIdxRef.current === null ? count - 1 : (keyboardIdxRef.current - 1 + count) % count;
      keyboardIdxRef.current = prev;
      setHoveredOrFocused(prev);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const idx = keyboardIdxRef.current ?? activeIdxRef.current ?? 0;
      activateNodeByIndex(idx);
    } else if (e.key === 'Escape') {
      keyboardIdxRef.current = null;
      setHoveredOrFocused(null);
    }
  };

  const activeNode = activeIdx !== null ? ECOSYSTEM_NODES[activeIdx] : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="group"
      aria-label="Interactive 3D Digital Ecosystem constellation. Use Left or Right arrow keys to inspect nodes and Enter to explore the Ecosystem Framework."
      onFocus={() => {
        if (keyboardIdxRef.current === null) {
          keyboardIdxRef.current = 0;
          setHoveredOrFocused(0);
        }
      }}
      onBlur={() => {
        keyboardIdxRef.current = null;
        setHoveredOrFocused(null);
      }}
      onKeyDown={handleKeyDown}
      className="relative h-full w-full min-h-[300px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-2"
    >
      {/* Projected HTML Tooltip */}
      <div
        ref={tooltipRef}
        aria-live="polite"
        className="pointer-events-none absolute left-0 top-0 z-20 px-3 py-1.5 df-slant-block border border-[var(--border-strong)] bg-[var(--bg-page)]/92 text-[var(--text-primary)] shadow-lg backdrop-blur-md transition-opacity duration-150"
        style={{ opacity: 0 }}
      >
        {activeNode && (
          <div className="df-unslant whitespace-nowrap">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--eyebrow-magenta)]">
              {String(activeNode.order).padStart(2, '0')} · {activeNode.shortTitle}
            </p>
            <p className="text-xs font-extrabold">{activeNode.title}</p>
          </div>
        )}
      </div>

    </div>
  );
}

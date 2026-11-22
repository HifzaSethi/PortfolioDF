import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildDfMarkGroup,
  createDfMaterials,
  detectSoftwareGl,
} from '../brand/dfMark3D';

interface IntroSceneProps {
  reducedMotion: boolean;
  isOpening: boolean;
  onReady: () => void;
  onFallback: () => void;
  onFirstInteract: () => void;
}

function smoothstep01(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 64, 6, 128, 64, 120);
    grad.addColorStop(0, 'rgba(179, 79, 255, 0.42)');
    grad.addColorStop(0.45, 'rgba(226, 51, 137, 0.22)');
    grad.addColorStop(1, 'rgba(1, 1, 2, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createAlphaFadeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.55, '#555555');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function IntroScene({
  reducedMotion,
  isOpening,
  onReady,
  onFallback,
  onFirstInteract,
}: IntroSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedRef = useRef(reducedMotion);
  const openingRef = useRef(isOpening);
  const onReadyRef = useRef(onReady);
  const onFallbackRef = useRef(onFallback);
  const onFirstInteractRef = useRef(onFirstInteract);

  reducedRef.current = reducedMotion;
  openingRef.current = isOpening;
  onReadyRef.current = onReady;
  onFallbackRef.current = onFallback;
  onFirstInteractRef.current = onFirstInteract;

  const interactionRef = useRef({
    yaw: -0.9,
    pitch: 0.08,
    velYaw: 0,
    velPitch: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    downTime: 0,
    lastInputTime: 0,
    idleWeight: 1,
    hasInteracted: false,
    entranceT: 0,
    openingElapsed: 0,
    pulseActive: false,
    pulseAngle: 0,
    pulseVel: 0,
    pulseElapsed: 0,
  });

  const markInteracted = () => {
    const s = interactionRef.current;
    s.lastInputTime = performance.now();
    s.idleWeight = 0;
    if (!s.hasInteracted) {
      s.hasInteracted = true;
      onFirstInteractRef.current();
    }
  };

  const triggerPulse = (dir: number) => {
    const s = interactionRef.current;
    if (s.pulseActive) return;
    markInteracted();
    s.pulseActive = true;
    s.pulseAngle = -dir * Math.PI * 2;
    s.pulseVel = 0;
    s.pulseElapsed = 0;
  };

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
      onFallbackRef.current();
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      renderer.dispose();
      onFallbackRef.current();
      return;
    }

    const isSoftwareGl = detectSoftwareGl(gl);
    const isMobileViewport = window.innerWidth < 768;
    const targetDpr = isSoftwareGl
      ? 1
      : Math.min(window.devicePixelRatio || 1, isMobileViewport ? 1.5 : 2);
    const softwareScale = isSoftwareGl ? 0.5 : 1;

    renderer.setPixelRatio(targetDpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 260);
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

    // Compute responsive Z so mark occupies ~45% width on desktop & ~78% width on portrait phone
    // and sits gracefully in the upper focal band above the wordmark/buttons
    const updateCameraLayout = (w: number, h: number) => {
      if (!renderer) return;
      const aspect = Math.max(0.35, w / h);
      const isPortrait = aspect < 0.85;
      const targetWidthRatio = isPortrait ? 0.78 : aspect < 1.25 ? 0.56 : 0.45;
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(17));
      const worldMarkW = 3.85;
      const worldMarkH = 2.1;

      const zForWidth = worldMarkW / (2 * tanHalfFov * aspect * targetWidthRatio);
      const maxHeightRatio = h < 500 ? 0.36 : 0.4;
      const zForHeight = worldMarkH / (2 * tanHalfFov * maxHeightRatio);
      const z = Math.max(7.6, zForWidth, zForHeight);

      camera.aspect = aspect;
      camera.position.set(0, 0.12, z);
      const visibleH = 2 * z * tanHalfFov;
      // Shift view target downward so the 3D mark stays cleanly above the HTML lockup
      camera.lookAt(0, -visibleH * (h < 520 ? 0.17 : 0.13), 0);
      camera.updateProjectionMatrix();

      renderer.setSize(
        Math.max(140, Math.round(w * softwareScale)),
        Math.max(130, Math.round(h * softwareScale)),
        false
      );
    };
    updateCameraLayout(width, height);

    let envTarget: THREE.WebGLRenderTarget | null = null;
    if (!isSoftwareGl) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envTarget = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envTarget.texture;
      roomEnv.dispose();
      pmrem.dispose();
    } else {
      const hemi = new THREE.HemisphereLight(0xf4f1ea, 0x261038, 1.35);
      scene.add(hemi);
    }

    // Brand-only lighting rig
    const ambientLight = new THREE.AmbientLight(0xffffff, isSoftwareGl ? 0.55 : 0.28);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f1ea, isSoftwareGl ? 2.1 : 1.65);
    keyLight.position.set(-4.5, 5.2, 6);
    scene.add(keyLight);

    const violetRim = new THREE.PointLight(0xb34fff, 34, 20, 1.5);
    violetRim.position.set(-4.4, -2.6, 2.2);
    scene.add(violetRim);

    const magentaRim = new THREE.PointLight(0xe23389, 36, 20, 1.5);
    magentaRim.position.set(4.4, -2.2, 2.4);
    scene.add(magentaRim);

    const blueKicker = new THREE.DirectionalLight(0x0057ff, 1.45);
    blueKicker.position.set(4.2, 4.2, -3.2);
    scene.add(blueKicker);

    const { chromeMaterial, dotMaterial } = createDfMaterials('night', isSoftwareGl);
    if ('envMapIntensity' in chromeMaterial) {
      chromeMaterial.envMapIntensity = 1.98;
    }
    const { markGroup, geometries } = buildDfMarkGroup(chromeMaterial, dotMaterial);

    const markPivot = new THREE.Group();
    markPivot.add(markGroup);
    scene.add(markPivot);

    // Contact glow shadow beneath mark
    const glowTexture = createGlowTexture();
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowGeom = new THREE.PlaneGeometry(5.6, 2.8);
    const glowPlane = new THREE.Mesh(glowGeom, glowMat);
    glowPlane.rotation.x = -Math.PI / 2.08;
    glowPlane.position.set(0, -1.52, -0.15);
    scene.add(glowPlane);

    const disposables: Array<{ dispose: () => void }> = [
      chromeMaterial,
      dotMaterial,
      glowTexture,
      glowMat,
      glowGeom,
      ...geometries,
    ];
    if (envTarget) disposables.push(envTarget);

    // Mirrored floor reflection & drifting dust (disabled on software GL or slow devices)
    let reflectionPivot: THREE.Group | null = null;
    let dustPoints: THREE.Points | null = null;
    let dustCount = 0;

    if (!isSoftwareGl && !reducedRef.current) {
      const alphaTex = createAlphaFadeTexture();
      const reflChromeMat = new THREE.MeshPhysicalMaterial({
        color: 0x0b0b12,
        metalness: 0.9,
        roughness: 0.25,
        transparent: true,
        opacity: 0.12,
        alphaMap: alphaTex,
        depthWrite: false,
      });
      const reflDotMat = new THREE.MeshPhysicalMaterial({
        color: 0xe23389,
        emissive: 0xe23389,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.14,
        alphaMap: alphaTex,
        depthWrite: false,
      });

      const reflBuilt = buildDfMarkGroup(reflChromeMat, reflDotMat);
      reflectionPivot = new THREE.Group();
      reflBuilt.markGroup.scale.y = -1;
      reflectionPivot.add(reflBuilt.markGroup);
      reflectionPivot.position.set(0, -2.62, 0);
      scene.add(reflectionPivot);

      disposables.push(alphaTex, reflChromeMat, reflDotMat, ...reflBuilt.geometries);

      // Subtle <= 52 brand dust particles
      dustCount = 52;
      const positions = new Float32Array(dustCount * 3);
      const colors = new Float32Array(dustCount * 3);
      const cViolet = new THREE.Color(0xb34fff);
      const cMagenta = new THREE.Color(0xe23389);
      const cWhite = new THREE.Color(0xf4f1ea);

      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] = (((i * 73) % 100) / 100 - 0.5) * 9.5;
        positions[i * 3 + 1] = (((i * 41) % 100) / 100 - 0.5) * 6.0;
        positions[i * 3 + 2] = -0.8 - ((i * 29) % 100) / 28;

        const c = i % 3 === 0 ? cViolet : i % 3 === 1 ? cMagenta : cWhite;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const dustGeom = new THREE.BufferGeometry();
      dustGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dustGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const dustMat = new THREE.PointsMaterial({
        size: 0.042,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      dustPoints = new THREE.Points(dustGeom, dustMat);
      scene.add(dustPoints);
      disposables.push(dustGeom, dustMat);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 280);
        const h = Math.max(entry.contentRect.height, 260);
        updateCameraLayout(w, h);
      }
    });
    resizeObserver.observe(container);

    let disposed = false;
    let contextLost = false;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let readyCalled = false;

    // Adaptive quality metrics (first 60 frames)
    let frameSamples = 0;
    let frameDeltaSumMs = 0;
    let adaptiveChecked = false;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      onFallbackRef.current();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    let frameCounter = 0;
    let lastSoftwareRenderMs = 0;

    const animateFrame = (now: number) => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(animateFrame);
      if (contextLost || document.hidden || !renderer) return;

      const rawDtMs = now - lastTime;
      lastTime = now;
      const dt = Math.min(rawDtMs / 1000, 0.05);
      elapsed += dt;
      frameCounter += 1;

      if (!adaptiveChecked && frameSamples < 60 && rawDtMs > 0 && rawDtMs < 200) {
        frameSamples += 1;
        frameDeltaSumMs += rawDtMs;
        if (frameSamples === 60) {
          adaptiveChecked = true;
          if (frameDeltaSumMs / 60 > 24) {
            renderer.setPixelRatio(1);
            if (reflectionPivot) reflectionPivot.visible = false;
            if (dustPoints) dustPoints.visible = false;
          }
        }
      }

      const s = interactionRef.current;

      // Initial entrance settle (200..900ms, rotation.y -0.9 -> 0) + one-time specular sweep
      if (!reducedRef.current) {
        if (elapsed <= 1.35) {
          if (elapsed <= 0.95) {
            const p = elapsed / 0.95;
            const ep = 1 - Math.pow(1 - p, 2);
            keyLight.position.x = -7.5 + ep * 15.0;
            keyLight.intensity = (isSoftwareGl ? 2.1 : 1.65) * (1 + Math.sin(p * Math.PI) * 0.42);
          } else {
            const settle = (elapsed - 0.95) / 0.4;
            keyLight.position.x = 7.5 + (-4.5 - 7.5) * smoothstep01(0, 1, settle);
            keyLight.intensity = isSoftwareGl ? 2.1 : 1.65;
          }
        } else {
          keyLight.position.x = -4.5;
          keyLight.intensity = isSoftwareGl ? 2.1 : 1.65;
        }
      }

      if (!s.hasInteracted && s.entranceT < 1 && !reducedRef.current) {
        s.entranceT = Math.min(1, s.entranceT + dt / 0.72);
        const eased = 1 - Math.pow(1 - s.entranceT, 3);
        s.yaw = -0.9 * (1 - eased);
        const entranceScale = 0.94 + 0.06 * eased;
        markPivot.scale.setScalar(entranceScale);
      } else if (!openingRef.current) {
        markPivot.scale.setScalar(1);
      }

      if (!reducedRef.current) {
        // Delayed smooth return to auto-revolve after 1500ms idle
        if (!s.isDragging) {
          const sinceInput = now - s.lastInputTime;
          if (s.lastInputTime > 0 && sinceInput > 1500) {
            s.idleWeight = Math.min(1, s.idleWeight + dt / 1.2);
            s.pitch += (0.08 - s.pitch) * (1 - Math.exp(-dt / 0.8));
          }

          // Inertia damping (0.94 per 16.7ms)
          const damp = Math.pow(0.94, dt * 60);
          s.yaw += s.velYaw * dt;
          s.pitch = Math.max(-0.6, Math.min(0.6, s.pitch + s.velPitch * dt));
          s.velYaw *= damp;
          s.velPitch *= damp;

          // Front-facing dwell auto-revolve
          const dwell = smoothstep01(0, 1, Math.abs(Math.sin(s.yaw / 2)));
          const autoSpeed = 0.27 * (0.35 + 0.65 * dwell) * s.idleWeight;
          if (s.entranceT >= 1 || s.hasInteracted) {
            s.yaw += autoSpeed * dt;
          }
        }

        // Critically damped spring 360 pulse spin + scale & rim boost
        let pulseScale = 1;
        let lightBoost = 1;
        if (s.pulseActive) {
          s.pulseElapsed += dt;
          const force = -90 * s.pulseAngle - 14 * s.pulseVel;
          s.pulseVel += force * dt;
          s.pulseAngle += s.pulseVel * dt;

          if (s.pulseElapsed < 0.4) {
            const k = s.pulseElapsed / 0.4;
            pulseScale = 1 + 0.05 * Math.sin(k * Math.PI);
          }
          if (s.pulseElapsed < 0.6) {
            const k = 1 - s.pulseElapsed / 0.6;
            lightBoost = 1 + 0.8 * k * k;
          }
          if (
            s.pulseElapsed > 0.35 &&
            Math.abs(s.pulseAngle) < 0.005 &&
            Math.abs(s.pulseVel) < 0.03
          ) {
            s.pulseAngle = 0;
            s.pulseVel = 0;
            s.pulseActive = false;
          }
        }

        violetRim.intensity = 34 * lightBoost;
        magentaRim.intensity = 36 * lightBoost;

        const pitchSway = Math.sin(elapsed * 0.85) * 0.06 * s.idleWeight;
        const floatBob = Math.sin(elapsed * 0.9) * 0.055;

        markPivot.position.y = floatBob;
        markPivot.rotation.y = s.yaw + s.pulseAngle;
        markPivot.rotation.x = s.pitch + pitchSway;
        if (!openingRef.current && (s.entranceT >= 1 || s.hasInteracted)) {
          markPivot.scale.setScalar(pulseScale);
        }

        if (reflectionPivot && reflectionPivot.visible) {
          reflectionPivot.rotation.y = markPivot.rotation.y;
          reflectionPivot.rotation.x = -markPivot.rotation.x * 0.5;
          reflectionPivot.position.y = -2.62 - floatBob * 0.5;
        }

        if (dustPoints && dustPoints.visible) {
          const posAttr = dustPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          for (let i = 0; i < dustCount; i++) {
            arr[i * 3 + 1] += dt * (0.04 + (i % 5) * 0.008);
            if (arr[i * 3 + 1] > 3.0) {
              arr[i * 3 + 1] = -3.0;
            }
          }
          posAttr.needsUpdate = true;
        }
      } else {
        // Calm static mark under reduced motion (still manually rotatable)
        markPivot.rotation.y = s.hasInteracted ? s.yaw : 0;
        markPivot.rotation.x = s.pitch;
        markPivot.scale.setScalar(1);
        if (readyCalled && !s.isDragging && !openingRef.current && frameCounter % 12 !== 0) {
          return;
        }
      }

      // Opening camera push (0 -> 600ms)
      if (openingRef.current) {
        s.openingElapsed = Math.min(0.6, s.openingElapsed + dt);
        const t = Math.min(1, s.openingElapsed / 0.55);
        const pushScale = 1 + 0.12 * t;
        markPivot.scale.setScalar(pushScale);
        renderer.domElement.style.opacity = String(Math.max(0, 1 - t));
      }

      if (isSoftwareGl && readyCalled) {
        if (openingRef.current) {
          return;
        }
        const minInterval = s.isDragging ? 50 : 120;
        if (now - lastSoftwareRenderMs < minInterval) {
          return;
        }
        lastSoftwareRenderMs = now;
      }

      renderer.render(scene, camera);

      if (!readyCalled) {
        readyCalled = true;
        onReadyRef.current();
      }
    };

    rafId = window.requestAnimationFrame(animateFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();

      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.dispose();
        renderer.domElement.remove();
      }

      for (const item of disposables) {
        item.dispose();
      }
    };
  }, []);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const s = interactionRef.current;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      markInteracted();
      s.yaw -= 0.28;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      markInteracted();
      s.yaw += 0.28;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      markInteracted();
      s.pitch = Math.max(-0.6, s.pitch - 0.14);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      markInteracted();
      s.pitch = Math.min(0.6, s.pitch + 0.14);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!reducedRef.current) triggerPulse(1);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="img"
      aria-label="Interactive 3D Digital Field logo"
      aria-describedby="intro-canvas-hint"
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => {
        const s = interactionRef.current;
        e.currentTarget.setPointerCapture(e.pointerId);
        s.isDragging = true;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        s.startX = e.clientX;
        s.startY = e.clientY;
        s.downTime = performance.now();
        s.velYaw = 0;
        s.velPitch = 0;
        markInteracted();
      }}
      onPointerMove={(e) => {
        const s = interactionRef.current;
        if (!s.isDragging) return;
        const dx = e.clientX - s.lastX;
        const dy = e.clientY - s.lastY;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        const dyaw = dx * 0.0105;
        const dpitch = dy * 0.006;
        s.yaw += dyaw;
        s.pitch = Math.max(-0.6, Math.min(0.6, s.pitch + dpitch));
        s.velYaw = dyaw * 46;
        s.velPitch = dpitch * 46;
      }}
      onPointerUp={(e) => {
        const s = interactionRef.current;
        if (!s.isDragging) return;
        s.isDragging = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        const dist = Math.hypot(e.clientX - s.startX, e.clientY - s.startY);
        if (dist < 6 && performance.now() - s.downTime < 250 && !reducedRef.current) {
          const rect = e.currentTarget.getBoundingClientRect();
          const dir = e.clientX >= rect.left + rect.width / 2 ? 1 : -1;
          triggerPulse(dir);
        }
      }}
      onPointerCancel={() => {
        interactionRef.current.isDragging = false;
      }}
      className="h-full w-full cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[var(--electric-blue)] focus-visible:outline-offset-[-4px]"
      style={{ touchAction: 'none' }}
    />
  );
}

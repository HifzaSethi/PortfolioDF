import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import dfMark3dRaw from '../../assets/brand/df-mark-3d.svg?raw';
import type { DfTheme } from '../../hooks/useTheme';

interface Hero3DCanvasProps {
  theme: DfTheme;
  onReady?: () => void;
  onWebGLError?: () => void;
}

function flipExtrudedGeometryY(geometry: THREE.BufferGeometry, scale: number): void {
  geometry.scale(scale, -scale, scale);

  // Reverse triangle winding order after negative Y scale so all normals face outward cleanly
  if (geometry.index) {
    const arr = geometry.index.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i + 1];
      arr[i + 1] = arr[i + 2];
      arr[i + 2] = tmp;
    }
    geometry.index.needsUpdate = true;
  } else {
    const pos = geometry.getAttribute('position');
    if (pos) {
      const a = pos.array as Float32Array;
      for (let i = 0; i < a.length; i += 9) {
        for (let k = 0; k < 3; k++) {
          const tmp = a[i + 3 + k];
          a[i + 3 + k] = a[i + 6 + k];
          a[i + 6 + k] = tmp;
        }
      }
      pos.needsUpdate = true;
    }
    const uv = geometry.getAttribute('uv');
    if (uv) {
      const u = uv.array as Float32Array;
      for (let i = 0; i < u.length; i += 6) {
        for (let k = 0; k < 2; k++) {
          const tmp = u[i + 2 + k];
          u[i + 2 + k] = u[i + 4 + k];
          u[i + 4 + k] = tmp;
        }
      }
      uv.needsUpdate = true;
    }
  }

  geometry.computeVertexNormals();
}

export default function Hero3DCanvas({ theme, onReady, onWebGLError }: Hero3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<DfTheme>(theme);
  themeRef.current = theme;

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
      onWebGLError?.();
      return;
    }

    const gl = renderer.getContext();
    if (!gl) {
      renderer.dispose();
      onWebGLError?.();
      return;
    }

    // Detect software WebGL (SwiftShader / llvmpipe) to throttle appropriately
    const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
    const glRendererStr = debugExt ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer/i.test(glRendererStr);

    const maxDpr = isSoftwareGl ? 1 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = themeRef.current === 'night' ? 1.28 : 1.16;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    renderer.setSize(width, height, false);

    // Environment reflections for black-chrome finish
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // Lighting rig (Key + Violet Rim + Magenta Rim + Electric Blue Accent)
    const ambientLight = new THREE.AmbientLight(0xffffff, themeRef.current === 'night' ? 0.35 : 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f1ea, themeRef.current === 'night' ? 1.5 : 2.3);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const violetRim = new THREE.PointLight(0xb34fff, themeRef.current === 'night' ? 32 : 20, 18, 1.5);
    violetRim.position.set(-4.2, -2.5, 2.5);
    scene.add(violetRim);

    const magentaRim = new THREE.PointLight(0xe23389, themeRef.current === 'night' ? 34 : 22, 18, 1.5);
    magentaRim.position.set(4.2, -2.0, 2.8);
    scene.add(magentaRim);

    const blueKicker = new THREE.DirectionalLight(0x0057ff, themeRef.current === 'night' ? 1.8 : 1.3);
    blueKicker.position.set(-3, 4.5, -2.5);
    scene.add(blueKicker);

    // Materials
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(themeRef.current === 'night' ? 0x0b0b12 : 0x0d0d15),
      metalness: 0.94,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      envMapIntensity: themeRef.current === 'night' ? 2.1 : 1.7,
    });

    const dotMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xe23389),
      emissive: new THREE.Color(0xe23389),
      emissiveIntensity: themeRef.current === 'night' ? 0.42 : 0.16,
      metalness: 0.42,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.6,
    });

    // Extrude exact DF mark SVG
    const loader = new SVGLoader();
    const svgData = loader.parse(dfMark3dRaw);
    const markGroup = new THREE.Group();
    const markPivot = new THREE.Group();

    const disposables: Array<{ dispose: () => void }> = [
      chromeMaterial,
      dotMaterial,
      envTarget,
    ];

    // 419 SVG units -> ~3.8 world units wide
    const svgScale = 3.85 / 419;

    const extrudeBodySettings: THREE.ExtrudeGeometryOptions = {
      depth: 52,
      bevelEnabled: true,
      bevelThickness: 4.5,
      bevelSize: 3.4,
      bevelSegments: 4,
      curveSegments: 20,
    };

    const extrudeDotSettings: THREE.ExtrudeGeometryOptions = {
      depth: 58,
      bevelEnabled: true,
      bevelThickness: 4.5,
      bevelSize: 3.4,
      bevelSegments: 4,
      curveSegments: 12,
    };

    for (const path of svgData.paths) {
      const node = (path.userData as { node?: Element } | undefined)?.node;
      const pathId = node?.getAttribute?.('id') ?? '';
      const isDot = pathId === 'df-dot';
      const shapes = path.toShapes();
      if (shapes.length === 0) continue;

      const geom = new THREE.ExtrudeGeometry(
        shapes,
        isDot ? extrudeDotSettings : extrudeBodySettings
      );
      flipExtrudedGeometryY(geom, svgScale);
      disposables.push(geom);

      const mesh = new THREE.Mesh(geom, isDot ? dotMaterial : chromeMaterial);
      if (isDot) {
        mesh.position.z += 0.03;
      }
      markGroup.add(mesh);
    }

    // Center the assembled mark preserving exact spatial relation between DF body and magenta dot
    const box = new THREE.Box3().setFromObject(markGroup);
    const center = new THREE.Vector3();
    box.getCenter(center);
    markGroup.position.sub(center);

    markPivot.add(markGroup);
    scene.add(markPivot);

    // Floating brand triangles in depth behind centerpiece
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0.16);
    triangleShape.lineTo(-0.14, -0.11);
    triangleShape.lineTo(0.14, -0.11);
    triangleShape.closePath();

    const triGeom = new THREE.ExtrudeGeometry(triangleShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
    triGeom.center();
    disposables.push(triGeom);

    const triColors = [0xb34fff, 0xe23389, 0x0057ff, 0xf4f1ea];
    const triMaterials = triColors.map((hex, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: i < 3 ? hex : 0x000000,
        emissiveIntensity: i < 3 ? 0.25 : 0,
        metalness: 0.45,
        roughness: 0.25,
        clearcoat: 0.8,
        transparent: true,
        opacity: i === 3 ? 0.55 : 0.82,
      });
      disposables.push(mat);
      return mat;
    });

    interface FloatingTri {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      speed: number;
      phase: number;
      rotSpeed: THREE.Vector3;
    }

    const triGroup = new THREE.Group();
    const tris: FloatingTri[] = [];
    const triCount = isSoftwareGl ? 14 : 26;

    for (let i = 0; i < triCount; i++) {
      const mat = triMaterials[i % triMaterials.length];
      const mesh = new THREE.Mesh(triGeom, mat);
      const scaleFactor = 0.35 + ((i * 37) % 100) / 110;
      mesh.scale.setScalar(scaleFactor);

      // Spread behind and around mark without crowding center camera ray
      const angle = (i / triCount) * Math.PI * 2 + (i % 3) * 0.4;
      const radius = 2.0 + ((i * 53) % 100) / 36;
      const x = Math.cos(angle) * radius * 1.15;
      const y = Math.sin(angle) * radius * 0.65;
      const z = -1.2 - ((i * 29) % 100) / 32;

      mesh.position.set(x, y, z);
      mesh.rotation.set(i * 0.6, i * 0.9, i * 0.3);
      triGroup.add(mesh);

      tris.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        speed: 0.45 + ((i * 19) % 10) * 0.05,
        phase: i * 0.72,
        rotSpeed: new THREE.Vector3(
          0.18 + (i % 4) * 0.06,
          0.22 + (i % 3) * 0.07,
          0.12 + (i % 5) * 0.05
        ),
      });
    }
    scene.add(triGroup);

    // ResizeObserver for crisp layout adaptation
    const resizeObserver = new ResizeObserver((entries) => {
      if (!renderer) return;
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 280);
        const h = Math.max(entry.contentRect.height, 260);
        camera.aspect = w / h;
        // Pull camera slightly back on narrow viewports so DF mark never clips horizontally
        camera.position.z = w < 440 ? 8.3 : 7.0;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        renderer.setSize(w, h, false);
      }
    });
    resizeObserver.observe(container);

    // Pointer parallax & scroll tracking
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };
    let scrollProgress = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPointer.x = Math.max(-0.5, Math.min(0.5, nx));
      targetPointer.y = Math.max(-0.5, Math.min(0.5, ny));
    };

    const handlePointerLeave = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
    };

    const handleScroll = () => {
      scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 600), 1.2);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Visibility / off-screen pause
    let isVisible = true;
    let contextLost = false;
    let disposed = false;
    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let lastThemeApplied: DfTheme | null = null;
    let readyCalled = false;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
          }
        }
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    const applyThemeLighting = (activeTheme: DfTheme) => {
      if (!renderer || lastThemeApplied === activeTheme) return;
      lastThemeApplied = activeTheme;
      const isNight = activeTheme === 'night';

      renderer.toneMappingExposure = isNight ? 1.28 : 1.15;
      ambientLight.intensity = isNight ? 0.38 : 0.78;
      keyLight.intensity = isNight ? 1.55 : 2.35;
      violetRim.intensity = isNight ? 34 : 20;
      magentaRim.intensity = isNight ? 36 : 22;
      blueKicker.intensity = isNight ? 1.85 : 1.25;
      chromeMaterial.color.setHex(isNight ? 0x0a0a10 : 0x0d0d16);
      chromeMaterial.envMapIntensity = isNight ? 2.15 : 1.75;
      dotMaterial.emissiveIntensity = isNight ? 0.44 : 0.16;

      // In Day mode contrast dark triangles slightly against #F4F1EA background
      triMaterials[3].color.setHex(isNight ? 0xf4f1ea : 0x010102);
      triMaterials[3].opacity = isNight ? 0.52 : 0.28;
    };

    const animate = (now: number) => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(animate);

      if (!isVisible || contextLost || document.hidden || !renderer) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      applyThemeLighting(themeRef.current);

      // Smooth pointer parallax damping
      currentPointer.x += (targetPointer.x - currentPointer.x) * Math.min(dt * 6, 1);
      currentPointer.y += (targetPointer.y - currentPointer.y) * Math.min(dt * 6, 1);

      // Slow floating rotation + parallax + subtle scroll-linked drift
      const floatBob = Math.sin(elapsed * 0.9) * 0.085;
      const idleYaw = Math.sin(elapsed * 0.48) * 0.24;
      const idlePitch = Math.cos(elapsed * 0.36) * 0.075;

      markPivot.position.y = floatBob - scrollProgress * 0.45;
      markPivot.rotation.y = idleYaw + currentPointer.x * 0.68 + scrollProgress * 0.28;
      markPivot.rotation.x = idlePitch + currentPointer.y * 0.42 - scrollProgress * 0.12;
      markPivot.rotation.z = Math.sin(elapsed * 0.3) * 0.025;

      // Floating triangle swarm
      triGroup.rotation.y = currentPointer.x * 0.22;
      triGroup.rotation.x = currentPointer.y * 0.16;
      for (const item of tris) {
        item.mesh.position.y =
          item.basePos.y + Math.sin(elapsed * item.speed + item.phase) * 0.18 - scrollProgress * 0.22;
        item.mesh.rotation.x += item.rotSpeed.x * dt;
        item.mesh.rotation.y += item.rotSpeed.y * dt;
        item.mesh.rotation.z += item.rotSpeed.z * dt;
      }

      if (isSoftwareGl && Math.floor(elapsed * 60) % 2 === 1) {
        return;
      }

      renderer.render(scene, camera);

      if (!readyCalled) {
        readyCalled = true;
        onReady?.();
      }
    };

    applyThemeLighting(themeRef.current);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);

      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        renderer.dispose();
        renderer.domElement.remove();
      }

      for (const item of disposables) {
        item.dispose();
      }
    };
  }, [onReady, onWebGLError]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[280px]"
      aria-hidden="true"
    />
  );
}

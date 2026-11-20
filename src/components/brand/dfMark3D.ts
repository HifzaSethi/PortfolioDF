import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import dfMark3dRaw from '../../assets/brand/df-mark-3d.svg?raw';
import type { DfTheme } from '../../hooks/useTheme';

// 419 SVG units -> ~3.85 world units wide
const SVG_WORLD_SCALE = 3.85 / 419;

export const EXTRUDE_BODY_SETTINGS: THREE.ExtrudeGeometryOptions = {
  depth: 52,
  bevelEnabled: true,
  bevelThickness: 4.5,
  bevelSize: 3.4,
  bevelSegments: 4,
  curveSegments: 20,
};

export const EXTRUDE_DOT_SETTINGS: THREE.ExtrudeGeometryOptions = {
  depth: 58,
  bevelEnabled: true,
  bevelThickness: 4.5,
  bevelSize: 3.4,
  bevelSegments: 4,
  curveSegments: 12,
};

export function detectSoftwareGl(
  gl: WebGLRenderingContext | WebGL2RenderingContext
): boolean {
  const debugExt = gl.getExtension('WEBGL_debug_renderer_info');
  const unmasked = debugExt
    ? String(gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL))
    : '';
  const standard = String(gl.getParameter(gl.RENDERER) ?? '');
  return /SwiftShader|llvmpipe|softpipe|Software/i.test(`${unmasked} ${standard}`);
}

export function flipExtrudedGeometryY(
  geometry: THREE.BufferGeometry,
  scale: number
): void {
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

export interface DfMarkMaterials {
  chromeMaterial: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
  dotMaterial: THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
}

export function createDfMaterials(
  theme: DfTheme = 'night',
  softwareGl = false
): DfMarkMaterials {
  const isNight = theme === 'night';

  if (softwareGl) {
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isNight ? 0x141320 : 0x161622),
      metalness: 0.72,
      roughness: 0.24,
    });
    const dotMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe23389),
      emissive: new THREE.Color(0xe23389),
      emissiveIntensity: isNight ? 0.52 : 0.24,
      metalness: 0.35,
      roughness: 0.22,
    });
    return { chromeMaterial, dotMaterial };
  }

  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(isNight ? 0x0b0b12 : 0x0d0d15),
    metalness: 0.94,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    reflectivity: 1.0,
    envMapIntensity: isNight ? 2.1 : 1.7,
  });

  const dotMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xe23389),
    emissive: new THREE.Color(0xe23389),
    emissiveIntensity: isNight ? 0.42 : 0.16,
    metalness: 0.42,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.6,
  });

  return { chromeMaterial, dotMaterial };
}

export interface DfMarkBuildResult {
  markGroup: THREE.Group;
  geometries: THREE.BufferGeometry[];
  size: THREE.Vector3;
}

export function buildDfMarkGroup(
  chromeMaterial: THREE.Material,
  dotMaterial: THREE.Material
): DfMarkBuildResult {
  const loader = new SVGLoader();
  const svgData = loader.parse(dfMark3dRaw);
  const markGroup = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];

  for (const path of svgData.paths) {
    const node = (path.userData as { node?: Element } | undefined)?.node;
    const pathId = node?.getAttribute?.('id') ?? '';
    const isDot = pathId === 'df-dot';
    const shapes = path.toShapes();
    if (shapes.length === 0) continue;

    const geom = new THREE.ExtrudeGeometry(
      shapes,
      isDot ? EXTRUDE_DOT_SETTINGS : EXTRUDE_BODY_SETTINGS
    );
    flipExtrudedGeometryY(geom, SVG_WORLD_SCALE);
    geometries.push(geom);

    const mesh = new THREE.Mesh(geom, isDot ? dotMaterial : chromeMaterial);
    if (isDot) {
      mesh.position.z += 0.03;
    }
    markGroup.add(mesh);
  }

  // Center the assembled mark preserving exact spatial relation between DF body and magenta dot
  const box = new THREE.Box3().setFromObject(markGroup);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);
  markGroup.position.sub(center);

  return { markGroup, geometries, size };
}

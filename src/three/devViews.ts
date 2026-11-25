/**
 * DEV ONLY: camera presets for scripts/render_views.mjs (photo-vs-model comparison).
 * Installed from engine.ts behind `import.meta.env.DEV`, so production builds never include it.
 *
 * window.__engine.setView({ preset: 'front' | 'side' | 'three_quarter' | 'foot' | 'top' })
 * window.__engine.setView({ az: 35, el: 20, target: 'pylon0' | 'main' | 'unit' })
 *   az: degrees off the bridge's perpendicular (0 = side-on, 90 = along the axis from the start end)
 *   el: degrees above the horizontal (negative = from below)
 */
import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { BridgeGeometry } from '../lib/bridge3d';
import type { BridgeEngine } from './engine';

export type ViewPreset = 'front' | 'side' | 'three_quarter' | 'foot' | 'top';
export interface ViewSpec {
  preset?: ViewPreset;
  az?: number;
  el?: number;
  target?: 'pylon0' | 'main' | 'unit';
}

/** The engine internals this module needs (all private in the engine class). */
interface Internals {
  g: BridgeGeometry | null;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  root: THREE.Group;
  panBox: THREE.Box3;
  home: [THREE.Vector3, THREE.Vector3];
  fitDistance: number;
  tween: unknown;
  requestRender: () => void;
  setOptions: BridgeEngine['setOptions'];
}

const DEG = Math.PI / 180;
const BASE_FOV = 35;

export function installDevViews(engine: BridgeEngine) {
  const e = engine as unknown as Internals;
  const deckOriginal = new Map<THREE.Mesh, THREE.Material>();

  const translucentDeck = (on: boolean) => {
    e.root.traverse((n) => {
      const mesh = n as THREE.Mesh;
      if (!mesh.isMesh || !mesh.userData.deck) return;
      if (on && !deckOriginal.has(mesh)) {
        deckOriginal.set(mesh, mesh.material as THREE.Material);
        const m = (mesh.material as THREE.Material).clone();
        m.transparent = true;
        m.opacity = 0.22;
        m.depthWrite = false;
        mesh.material = m;
      } else if (!on && deckOriginal.has(mesh)) {
        (mesh.material as THREE.Material).dispose();
        mesh.material = deckOriginal.get(mesh)!;
        deckOriginal.delete(mesh);
      }
    });
  };

  const place = (pos: THREE.Vector3, target: THREE.Vector3, fov = BASE_FOV) => {
    e.tween = null;
    e.camera.fov = fov;
    e.camera.near = 0.5;
    e.camera.far = 1e6;
    e.camera.updateProjectionMatrix();
    e.controls.minDistance = 0;
    e.controls.maxDistance = Infinity;
    e.controls.minPolarAngle = 0;
    e.controls.maxPolarAngle = Math.PI;
    e.panBox.set(new THREE.Vector3(-1e7, -1e7, -1e7), new THREE.Vector3(1e7, 1e7, 1e7));
    e.camera.position.copy(pos);
    e.controls.target.copy(target);
    e.controls.update();
    e.requestRender();
  };

  /** world position of a station point (plan curve + crest + the root's centring offset) */
  const W = (g: BridgeGeometry, x: number, y: number, z: number) => new THREE.Vector3(...g.plan(x, y, z)).add(e.root.position);
  /** unit vector for azimuth (off the perpendicular +z, toward +x) and elevation */
  const dirOf = (azDeg: number, elDeg: number) =>
    new THREE.Vector3(Math.sin(azDeg * DEG) * Math.cos(elDeg * DEG), Math.sin(elDeg * DEG), Math.cos(azDeg * DEG) * Math.cos(elDeg * DEG));
  /** distance at which a vertical extent h fills ~85% of the view height */
  const distFor = (h: number, fov = BASE_FOV) => h / 0.85 / 2 / Math.tan((fov * DEG) / 2);

  function setView(spec: ViewSpec) {
    const g = e.g;
    if (!g) throw new Error('no bridge loaded');
    const E = g.deckElevation;
    const p0 = g.pylons[0];
    const H = p0.heightAboveDeck;
    const top = E + H;
    const mainSeg = g.spans.find((s) => s.main) ?? g.spans[0];
    const mainMid = (mainSeg.x0 + mainSeg.x1) / 2;
    // stand on the main-span side of pylon 0 (looking back at it)
    const towardMain = Math.sign(mainMid - p0.x) || 1;
    translucentDeck(false);

    switch (spec.preset) {
      case 'three_quarter': {
        place(e.home[0].clone(), e.home[1].clone());
        return;
      }
      case 'front': {
        // along the bridge axis from the main-span middle; translucent deck shows footing → tip
        translucentDeck(true);
        const target = W(g, p0.x, top / 2, 0);
        const pos = W(g, mainMid, top / 2, 0.01);
        const d = pos.distanceTo(target);
        place(pos, target, Math.min(80, (2 * Math.atan((top * 0.6) / d)) / DEG));
        return;
      }
      case 'side': {
        // true elevation of the stayed unit, perpendicular to the bridge
        const target = W(g, g.totalLength / 2, top / 2, 0);
        const aspect = e.camera.aspect || 1.5;
        const hfov = 2 * Math.atan(Math.tan((BASE_FOV * DEG) / 2) * aspect);
        const d = Math.max((g.totalLength * 1.08) / 2 / Math.tan(hfov / 2), distFor(top));
        place(target.clone().add(new THREE.Vector3(0, 0, d)), target);
        return;
      }
      case 'foot': {
        // ~30° off the axis, slightly below deck level, framing the footing up to ~1.3 × deck height
        const target = W(g, p0.x, 0.6 * E, 0);
        // perspective: the near leg is closer than the pylon axis, so allow extra distance
        const d = 1.6 * distFor(1.3 * E) + g.deckWidth;
        const dir = new THREE.Vector3(towardMain * Math.cos(30 * DEG), 0, Math.sin(30 * DEG));
        const pos = target.clone().addScaledVector(dir, d);
        pos.y = 0.8 * E;
        place(pos, target);
        return;
      }
      case 'top': {
        // pylon head close-up: the top ~35% of the height above deck
        const target = W(g, p0.x, E + 0.82 * H, 0);
        const d = distFor(0.4 * H) + g.deckWidth / 2;
        place(target.clone().addScaledVector(dirOf(35 * towardMain, 12), d), target);
        return;
      }
      default: {
        // custom: az/el around a target
        const az = spec.az ?? 35;
        const el = spec.el ?? 20;
        const t = spec.target ?? 'unit';
        let target: THREE.Vector3;
        let d: number;
        if (t === 'pylon0') {
          target = W(g, p0.x, top / 2, 0);
          d = distFor(top * 1.15);
        } else if (t === 'main') {
          target = W(g, mainMid, E, 0);
          d = distFor(mainSeg.length * 0.55);
        } else {
          target = e.home[1].clone();
          d = e.fitDistance;
        }
        place(target.clone().addScaledVector(dirOf(az, el), d), target);
      }
    }
  }

  const api = engine as unknown as { setView: typeof setView; setLabels: (on: boolean) => void };
  api.setView = setView;
  api.setLabels = (on: boolean) => e.setOptions({ labels: on });
}

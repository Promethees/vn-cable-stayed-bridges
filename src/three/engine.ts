/**
 * Three.js engine for the schematic bridge model (docs/design-3d.md §2–§6).
 * Loaded only through dynamic import() when the 3D tab is opened, so `three` never lands
 * in the main bundle.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { heightDimension, stayLightness, type Box, type BridgeGeometry, type Member, type SweepMesh } from '../lib/bridge3d';

export interface EngineStrings {
  meters: (v: number) => string;
  clearance: (h?: number, w?: number) => string;
  heightLabel: (v: string) => string;
  aboveDeck: string;
  total: string;
}

export interface EngineOptions {
  strings: EngineStrings;
  labels: boolean;
  fullscreen: boolean;
  reducedMotion: boolean;
  onContextLost: () => void;
}

const DEG = Math.PI / 180;

/** Reads a CSS colour token; supports #hex, rgb() and rgba() (alpha returned separately). */
function cssColor(name: string, fallback: string): { color: THREE.Color; alpha: number } {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const m = raw.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a] = m[1].split(',').map((s) => parseFloat(s));
    return { color: new THREE.Color(r / 255, g / 255, b / 255), alpha: a ?? 1 };
  }
  try {
    return { color: new THREE.Color(raw), alpha: 1 };
  } catch {
    return { color: new THREE.Color(fallback), alpha: 1 };
  }
}
const cssNum = (name: string, fallback: number) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;

/** Pre-muted named colours: the study-model look keeps colours soft. */
const NAMED: Record<string, string> = {
  white: '#E9EAE6',
  grey: '#A9B0B2',
  red: '#B65A4E',
  orange: '#C98A4B',
  yellow: '#D6B551',
  green: '#6E9A72',
  blue: '#5E87A8',
  purple: '#8A6F9E',
  brown: '#8C6A50',
  black: '#3A3F42',
};

/** Named colour or hex → a muted THREE.Color (saturation ≤ 0.45, lightness 0.35–0.88). */
export function mutedColour(value: string): THREE.Color {
  const named = NAMED[value.toLowerCase()];
  const c = new THREE.Color(named ?? value);
  if (named) return c;
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  return c.setHSL(hsl.h, Math.min(hsl.s, 0.45), Math.min(0.88, Math.max(0.35, hsl.l)));
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export class BridgeEngine {
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 1, 10000);
  private controls: OrbitControls;
  private root = new THREE.Group();
  private dims = new THREE.Group();
  private host: HTMLElement;
  private g: BridgeGeometry | null = null;
  private opts: EngineOptions;
  private raf = 0;
  private tween: { from: [THREE.Vector3, THREE.Vector3]; to: [THREE.Vector3, THREE.Vector3]; t0: number } | null = null;
  private fitDistance = 1000;
  private home: [THREE.Vector3, THREE.Vector3] = [new THREE.Vector3(), new THREE.Vector3()];
  private panBox = new THREE.Box3();
  private dimSide = 1;
  private labelEls: { el: HTMLElement; priority: number; span?: [number, number]; pylon?: number; obj?: CSS2DObject; line?: THREE.Object3D }[] = [];
  private resizeObs: ResizeObserver;
  private disposed = false;
  private mats: Record<string, THREE.Material> = {};
  /** per-bridge materials for model3d colours (disposed with the model) */
  private extraMats: THREE.Material[] = [];
  private hemi: THREE.HemisphereLight;
  private sun: THREE.DirectionalLight;

  constructor(host: HTMLElement, opts: EngineOptions) {
    this.host = host;
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.domElement.className = 'm3d-canvas';
    this.renderer.domElement.addEventListener('webglcontextlost', this.onContextLost);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.className = 'm3d-labels';

    this.hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    this.sun = new THREE.DirectionalLight(0xffffff, 1);
    // azimuth 135°, elevation 50°
    this.sun.position.set(Math.cos(50 * DEG) * Math.sin(135 * DEG), Math.sin(50 * DEG), Math.cos(50 * DEG) * Math.cos(135 * DEG)).multiplyScalar(1000);
    this.scene.add(this.hemi, this.sun, this.root);
    this.root.add(this.dims);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !opts.reducedMotion;
    this.controls.dampingFactor = 0.08;
    this.controls.minPolarAngle = 10 * DEG;
    this.controls.maxPolarAngle = 84 * DEG;
    this.controls.screenSpacePanning = true;
    this.controls.autoRotateSpeed = 0.1; // ≈ 0.6°/s at 60 fps
    this.controls.addEventListener('change', this.requestRender);
    this.controls.addEventListener('start', this.cancelTween);

    this.makeMaterials();
    if (import.meta.env.DEV) {
      (window as unknown as { __engine: BridgeEngine }).__engine = this;
      // dev-only camera presets for scripts/render_views.mjs; the import is dead code in production builds
      void import('./devViews').then((m) => m.installDevViews(this));
    }
    this.resizeObs = new ResizeObserver(() => this.resize());
    this.mount(host);
  }

  // ---------- lifecycle ----------

  /** Re-parents the single canvas (card ↔ full-screen dialog) instead of creating a second context. */
  mount(host: HTMLElement) {
    this.resizeObs.disconnect();
    this.host = host;
    host.appendChild(this.renderer.domElement);
    host.appendChild(this.labelRenderer.domElement);
    this.resizeObs.observe(host);
    this.resize();
  }

  setOptions(o: Partial<EngineOptions>) {
    const fsChanged = o.fullscreen !== undefined && o.fullscreen !== this.opts.fullscreen;
    this.opts = { ...this.opts, ...o };
    if (fsChanged) this.buildCables();
    this.labelRenderer.domElement.style.display = this.opts.labels ? '' : 'none';
    this.dims.visible = this.opts.labels;
    this.requestRender();
  }

  setGeometry(g: BridgeGeometry) {
    this.clearModel();
    this.g = g;
    this.build(g);
    this.fit(true);
    this.applyTheme();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.controls.removeEventListener('change', this.requestRender);
    this.controls.removeEventListener('start', this.cancelTween);
    this.controls.dispose();
    this.clearModel();
    Object.values(this.mats).forEach((m) => m.dispose());
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
    this.labelRenderer.domElement.remove();
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.opts.onContextLost();
  };

  // ---------- materials / theme ----------

  private makeMaterials() {
    // double-sided so swept custom pylons never show back-face holes
    const lambert = () => new THREE.MeshLambertMaterial({ flatShading: true, side: THREE.DoubleSide });
    this.mats = {
      water: new THREE.MeshLambertMaterial(),
      ground: lambert(),
      concrete: lambert(),
      steel: lambert(),
      traveller: lambert(),
      edge: new THREE.LineBasicMaterial({ transparent: true }),
      edgeGhost: new THREE.LineDashedMaterial({ dashSize: 4, gapSize: 3, transparent: true }),
      cable: new THREE.LineBasicMaterial(),
      cableGhost: new THREE.LineDashedMaterial({ dashSize: 4, gapSize: 3 }),
      dim: new THREE.LineBasicMaterial({ transparent: true }),
      dimDashed: new THREE.LineDashedMaterial({ dashSize: 3, gapSize: 2.5, transparent: true }),
      clearance: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
      clearanceEdge: new THREE.LineDashedMaterial({ dashSize: 5, gapSize: 4, transparent: true, opacity: 0.9 }),
    };
  }

  /** Reads every --m3d-* token and updates materials in place (§2 theme). */
  applyTheme() {
    const c = (n: string, f: string) => cssColor(n, f);
    const sky = c('--m3d-sky-bottom', '#F3F5F4').color;
    this.scene.fog = this.g ? new THREE.Fog(sky, 1.2 * this.fitDistance, 3 * this.fitDistance) : null;
    this.hemi.color.copy(c('--m3d-sky-top', '#DDE7EB').color);
    this.hemi.groundColor.copy(c('--m3d-water', '#BCD3DA').color);
    this.hemi.intensity = cssNum('--m3d-hemi-intensity', 1.1);
    this.sun.intensity = cssNum('--m3d-sun-intensity', 1.4);
    const M = this.mats as Record<string, THREE.MeshLambertMaterial & THREE.LineBasicMaterial>;
    M.water.color.copy(c('--m3d-water', '#BCD3DA').color);
    M.ground.color.copy(c('--m3d-ground', '#D9DFDA').color);
    M.concrete.color.copy(c('--m3d-concrete', '#D6DBDA').color);
    M.steel.color.copy(c('--m3d-steel', '#96AAB3').color);
    M.traveller.color.copy(c('--m3d-traveller', '#E8A600').color);
    const edge = c('--m3d-edge', 'rgba(18,48,61,0.45)');
    M.edge.color.copy(edge.color);
    M.edge.opacity = edge.alpha;
    const ghost = c('--m3d-ghost', '#56666E');
    M.edgeGhost.color.copy(ghost.color);
    M.edgeGhost.opacity = 0.9;
    M.cable.color.copy(c('--m3d-cable', '#0E6A87').color);
    M.cableGhost.color.copy(ghost.color);
    M.dim.color.copy(c('--m3d-dim-line', '#56666E').color);
    (this.mats.dimDashed as THREE.LineDashedMaterial).color.copy(c('--m3d-dim-line', '#56666E').color);
    (this.mats.clearance as THREE.MeshBasicMaterial).color.copy(c('--m3d-cable', '#0E6A87').color);
    (this.mats.clearanceEdge as THREE.LineDashedMaterial).color.copy(c('--m3d-cable', '#0E6A87').color);
    const planned = this.g?.status === 'planned';
    const ghostOpacity = cssNum('--m3d-ghost-opacity', 0.12);
    if (this.g) this.buildCables(); // picks up the theme's cable colour
    for (const mat of [M.concrete, M.steel, M.traveller, ...this.extraMats.filter((x) => x instanceof THREE.MeshLambertMaterial)]) {
      mat.transparent = planned;
      mat.opacity = planned ? ghostOpacity : 1;
      mat.depthWrite = !planned;
      mat.needsUpdate = true;
    }
    this.requestRender();
  }

  // ---------- scene building ----------

  private clearModel() {
    this.extraMats.forEach((m) => m.dispose());
    this.extraMats = [];
    this.labelEls.forEach(({ el }) => el.remove());
    this.labelEls = [];
    const disposeTree = (o: THREE.Object3D) => {
      o.traverse((n) => {
        if (n instanceof CSS2DObject) n.element.remove();
        const geo = (n as THREE.Mesh).geometry;
        if (geo) geo.dispose();
      });
    };
    this.cableGroup.traverse((n) => (n as THREE.LineSegments).geometry?.dispose());
    this.cableGroup.clear();
    this.cableMats.forEach((m) => m.dispose());
    this.cableMats = [];
    for (const child of [...this.root.children]) {
      if (child === this.dims || child === this.cableGroup) continue;
      disposeTree(child);
      this.root.remove(child);
    }
    disposeTree(this.dims);
    this.dims.clear();
  }

  private addMesh(geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = this.root) {
    const mesh = new THREE.Mesh(geo, mat);
    const planned = this.g?.status === 'planned';
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), planned ? this.mats.edgeGhost : this.mats.edge);
    if (planned) edges.computeLineDistances();
    mesh.add(edges);
    parent.add(mesh);
    return mesh;
  }

  private box(b: Box, mat: THREE.Material, parent: THREE.Object3D = this.root) {
    const m = this.addMesh(new THREE.BoxGeometry(b.s[0], b.s[1], b.s[2]), mat, parent);
    m.position.set(...b.c);
    // Euler XYZ applies z (pitch) first, then y (yaw)
    m.rotation.set(0, b.yaw ?? 0, b.pitch ?? 0);
    return m;
  }

  /** a per-bridge clone of a base material in a muted version of the given colour */
  private tinted(base: THREE.Material, colour: string) {
    const mat = (base as THREE.MeshLambertMaterial).clone();
    mat.color = mutedColour(colour);
    this.extraMats.push(mat);
    return mat;
  }

  private sweep(sw: SweepMesh, mat: THREE.Material) {
    return this.sweepMesh(sw, mat);
  }

  private sweepMesh(sw: SweepMesh, mat: THREE.Material) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(sw.positions, 3));
    geo.setIndex(sw.indices);
    geo.computeVertexNormals();
    return this.addMesh(geo, mat);
  }

  private member(mb: Member, mat: THREE.Material) {
    const a = new THREE.Vector3(...mb.a);
    const b = new THREE.Vector3(...mb.b);
    const len = a.distanceTo(b);
    const m = this.addMesh(new THREE.BoxGeometry(mb.size, len, mb.size), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m;
  }

  private build(g: BridgeGeometry) {
    const M = this.mats;
    // centre the unit's plan bounds on the origin
    this.root.position.set(-(g.bounds.min[0] + g.bounds.max[0]) / 2, 0, -(g.bounds.min[2] + g.bounds.max[2]) / 2);
    const deckMat = g.deckType === 'steel' || g.deckType === 'composite' ? M.steel : M.concrete;
    const E = g.deckElevation;

    // water (3 × total length square) and banks
    const size = 3 * Math.max(g.totalLength, 400);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(size, size), M.water);
    water.rotation.x = -Math.PI / 2;
    water.position.set((g.bounds.min[0] + g.bounds.max[0]) / 2, 0, (g.bounds.min[2] + g.bounds.max[2]) / 2);
    this.root.add(water);
    g.banks.forEach((b) => this.box(b, M.ground));
    g.approaches.forEach((b) => this.box(b, deckMat));
    const pylonMat = g.colours.pylon ? this.tinted(M.concrete, g.colours.pylon) : M.concrete;
    const mainDeckMat = g.colours.deck ? this.tinted(deckMat, g.colours.deck) : deckMat;
    if (g.deckMeshes.length) {
      // smooth shading: flat shading would band a gently curved deck
      const smooth = (mainDeckMat as THREE.MeshLambertMaterial).clone();
      smooth.flatShading = false;
      this.extraMats.push(smooth);
      g.deckMeshes.forEach((dm) => (this.sweep(dm, smooth).userData.deck = true));
    }
    else g.deckPieces.forEach((b) => (this.box(b, mainDeckMat).userData.deck = true));
    g.deckMembers.forEach((mb) => (this.member(mb, mainDeckMat).userData.deck = true));
    g.piers.forEach((b) => this.box(b, M.concrete));
    g.pylons.forEach((p) => {
      p.members.forEach((mb) => this.member(mb, pylonMat));
      p.sweeps.forEach((sw) => this.sweep(sw, pylonMat));
      // footings read as plain concrete even when the pylon is coloured
      p.caps.forEach((sw) => this.sweep(sw, M.concrete));
    });
    g.travellers.forEach((b) => this.box(b, M.traveller));
    void E;

    this.buildCables();

    this.buildDims();
  }

  private cableGroup = new THREE.Group();

  /**
   * Stay cables as 1px LineSegments; back-stays may have their own colour. In the small card viewport a dense
   * fan (Cần Thơ: 23 per side) merges into a solid sheet, so at most CARD_MAX_PER_SIDE are drawn per side
   * (always keeping the outermost) at slightly reduced opacity; full screen shows every stay.
   */
  private buildCables() {
    const g = this.g;
    if (!g) return;
    this.cableGroup.traverse((n) => (n as THREE.LineSegments).geometry?.dispose());
    this.cableGroup.clear();
    this.cableMats.forEach((m) => m.dispose());
    this.cableMats = [];
    this.root.add(this.cableGroup);
    const M = this.mats;
    const planned = g.status === 'planned';
    const CARD_MAX_PER_SIDE = 12;
    const thin = !this.opts.fullscreen && g.cablesPerSide > CARD_MAX_PER_SIDE;
    const step = thin ? Math.ceil(g.cablesPerSide / CARD_MAX_PER_SIDE) : 1;
    const shown = g.cables.filter((c) => c.j % step === 0 || c.j === g.cablesPerSide - 1);
    const opacity = this.opts.fullscreen ? 1 : 0.8;
    const lineMat = (colour?: string) => {
      const base = planned ? M.cableGhost : M.cable;
      const mat = (base as THREE.LineBasicMaterial).clone();
      if (colour && !planned) {
        // keep light stays (white) visible against the sky in either theme
        const c = mutedColour(colour);
        const hsl = { h: 0, s: 0, l: 0 };
        // HSL in sRGB (what the eye sees); three's default working space is linear
        c.getHSL(hsl, THREE.SRGBColorSpace);
        mat.color = c.setHSL(hsl.h, hsl.s, stayLightness(hsl.l, this.darkTheme()), THREE.SRGBColorSpace);
      }
      mat.transparent = opacity < 1;
      mat.opacity = opacity;
      this.cableMats.push(mat);
      return mat;
    };
    for (const back of [false, true]) {
      const list = shown.filter((c) => c.back === back);
      if (!list.length) continue;
      const pos = new Float32Array(list.length * 6);
      list.forEach((c, i) => pos.set([...c.top, ...c.deck], i * 6));
      const cg = new THREE.BufferGeometry();
      cg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const lines = new THREE.LineSegments(cg, lineMat(back ? g.colours.backStay : g.colours.stay));
      if (planned) lines.computeLineDistances();
      this.cableGroup.add(lines);
    }
  }
  private cableMats: THREE.Material[] = [];

  /** dark theme = dark sky token (the theme may come from prefers-color-scheme or data-theme) */
  private darkTheme() {
    const sky = cssColor('--m3d-sky-bottom', '#F3F5F4').color;
    const hsl = { h: 0, s: 0, l: 0 };
    sky.getHSL(hsl, THREE.SRGBColorSpace);
    return hsl.l < 0.5;
  }

  /** Dimension lines + CSS2D labels on the camera-facing side (§5). */
  private buildDims() {
    const g = this.g;
    if (!g) return;
    this.labelEls.forEach(({ el }) => el.remove());
    this.labelEls = [];
    this.dims.traverse((n) => (n as THREE.Mesh).geometry?.dispose());
    this.dims.clear();
    const S = this.opts.strings;
    const E = g.deckElevation;
    const z = this.dimSide * (g.deckWidth / 2 + 10);
    const P = (x: number, y: number, zz: number) => g.plan(x, y, zz);
    const pts: number[] = [];
    // dimension line along the deck (follows the plan curve)
    const steps = g.planRadius ? 40 : 1;
    for (let i = 0; i < steps; i++)
      pts.push(...P((g.totalLength * i) / steps, E, z), ...P((g.totalLength * (i + 1)) / steps, E, z));
    for (const s of g.spans) pts.push(...P(s.x0, E, z - 3), ...P(s.x0, E, z + 3));
    pts.push(...P(g.totalLength, E, z - 3), ...P(g.totalLength, E, z + 3));

    g.spans.forEach((s, i) => {
      const el = document.createElement('span');
      el.className = `m3d-label${s.main ? ' is-main' : ''}`;
      el.textContent = S.meters(s.length);
      const o = new CSS2DObject(el);
      o.position.set(...P((s.x0 + s.x1) / 2, E, z));
      this.dims.add(o);
      this.labelEls.push({ el, priority: s.main ? 0 : 2, span: [s.x0, s.x1] });
      void i;
    });

    // pylon heights: a dashed vertical dimension beside each pylon's tip. Each line is its own object and is
    // shown only together with its label, so a decluttered label never leaves an orphan line (which read as
    // a pole next to custom pylons).
    const sameHeight = new Set(g.pylons.map((p) => Math.round(p.labelHeight))).size === 1;
    g.pylons.forEach((p) => {
      const { x, y0, y1 } = heightDimension(g, p);
      const lp = [...P(x, y0, z), ...P(x, y1, z), ...P(x - 3, y1, z), ...P(x + 3, y1, z), ...P(x - 3, y0, z), ...P(x + 3, y0, z)];
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
      const line = new THREE.LineSegments(lg, this.mats.dimDashed);
      line.computeLineDistances();
      this.dims.add(line);
      const el = document.createElement('span');
      el.className = 'm3d-label is-height';
      el.innerHTML = `<b>${S.heightLabel(S.meters(p.labelHeight))}</b><small>${p.labelRef === 'total' ? S.total : S.aboveDeck}</small>`;
      const o = new CSS2DObject(el);
      o.position.set(...P(x, (y0 + y1) / 2, z));
      o.center.set(-0.08, 0.5);
      this.dims.add(o);
      this.labelEls.push({ el, priority: 1, pylon: sameHeight ? p.index : -1, obj: o, line });
    });

    // navigation clearance envelope (tĩnh không): translucent box + dashed outline + label
    if (g.clearance) {
      const c = g.clearance;
      const box = this.box(c.box, this.mats.clearance, this.dims);
      const edges = box.children[0] as THREE.LineSegments;
      edges.material = this.mats.clearanceEdge;
      edges.computeLineDistances();
      if (c.givenHeight || c.givenWidth) {
        const el = document.createElement('span');
        el.className = 'm3d-label is-clearance';
        el.textContent = S.clearance(c.givenHeight, c.givenWidth);
        const o = new CSS2DObject(el);
        // at the waterline on the camera-facing edge of the envelope, clear of the deck labels
        o.position.set(...g.plan((c.x0 + c.x1) / 2, 0, this.dimSide * (g.deckWidth / 2 + 10)));
        o.center.set(0.5, -0.15);
        this.dims.add(o);
        this.labelEls.push({ el, priority: 0.5 });
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    this.dims.add(new THREE.LineSegments(geo, this.mats.dim));
    this.dims.visible = this.opts.labels;
  }

  // ---------- camera ----------

  private resize() {
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.labelRenderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.g) this.fit(false);
    this.requestRender();
  }

  /** Default 3/4 view: azimuth 35° off the perpendicular, elevation 20°, unit + 10% fits the width (§4). */
  private fit(jump: boolean) {
    const g = this.g;
    if (!g) return;
    const top = Math.max(...g.pylons.map((p) => g.deckElevation + p.heightAboveDeck));
    const target = new THREE.Vector3(0, top / 2, 0);
    const az = 35 * DEG;
    const el = 20 * DEG;
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    // real extreme points of the stayed unit (deck ends at both edges, pylon tops), centred like the root
    const off = this.root.position;
    const E = g.deckElevation;
    const hw = g.deckWidth / 2;
    const corners: THREE.Vector3[] = [];
    for (const x of [0, g.totalLength]) for (const z of [-hw, hw]) corners.push(new THREE.Vector3(...g.plan(x, E, z)).add(off));
    for (const p of g.pylons) corners.push(new THREE.Vector3(...g.plan(p.x, E + p.heightAboveDeck, 0)).add(off));
    // find the distance at which every corner projects inside the viewport (binary search)
    const probe = this.camera.clone();
    probe.near = 0.1;
    probe.far = 1e7;
    probe.updateProjectionMatrix();
    const fits = (d: number) => {
      probe.position.copy(target).addScaledVector(dir, d);
      probe.lookAt(target);
      probe.updateMatrixWorld();
      return corners.every((c) => {
        const p = c.clone().project(probe);
        // the unit fills ~85% of the viewport width (design feedback: model looked small)
        return Math.abs(p.x) <= 0.85 && Math.abs(p.y) <= 0.8 && p.z > -1 && p.z < 1;
      });
    };
    let lo = 10;
    let hi = 20 * g.totalLength + 1000;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid;
      else lo = mid;
    }
    const dist = hi;
    this.fitDistance = dist;
    const pos = target.clone().addScaledVector(dir, dist);
    this.home = [pos, target];
    this.camera.near = 1;
    this.camera.far = 10 * dist;
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = Math.max(60, 0.12 * g.totalLength);
    this.controls.maxDistance = 2.2 * dist;
    const half = new THREE.Vector3(g.totalLength / 2, top, g.deckWidth / 2 + 20).multiplyScalar(1.2);
    this.panBox.set(new THREE.Vector3(-half.x, 0, -half.z), new THREE.Vector3(half.x, half.y, half.z));
    if (jump) {
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.controls.update();
    }
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.near = 1.2 * dist;
      this.scene.fog.far = 3 * dist;
    }
  }

  reset() {
    const [pos, target] = this.home;
    if (this.opts.reducedMotion) {
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.controls.update();
      this.requestRender();
      return;
    }
    this.tween = { from: [this.camera.position.clone(), this.controls.target.clone()], to: [pos.clone(), target.clone()], t0: performance.now() };
    this.requestRender();
  }

  private cancelTween = () => {
    this.tween = null;
  };

  /** Keyboard orbit: degrees of azimuth / polar change. */
  orbit(dAzDeg: number, dPolDeg: number) {
    const off = this.camera.position.clone().sub(this.controls.target);
    const s = new THREE.Spherical().setFromVector3(off);
    s.theta += dAzDeg * DEG;
    s.phi = THREE.MathUtils.clamp(s.phi + dPolDeg * DEG, this.controls.minPolarAngle, this.controls.maxPolarAngle);
    this.camera.position.copy(this.controls.target).add(new THREE.Vector3().setFromSpherical(s));
    this.controls.update();
  }

  zoom(factor: number) {
    const off = this.camera.position.clone().sub(this.controls.target);
    const len = THREE.MathUtils.clamp(off.length() * factor, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(off.setLength(len));
    this.controls.update();
  }

  pan(dx: number, dy: number) {
    const d = this.camera.position.distanceTo(this.controls.target) * 0.05;
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0).multiplyScalar(dx * d);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1).multiplyScalar(dy * d);
    const delta = right.add(up);
    this.camera.position.add(delta);
    this.controls.target.add(delta);
    this.controls.update();
  }

  setAutoRotate(on: boolean) {
    this.controls.autoRotate = on && !this.opts.reducedMotion;
    this.requestRender();
  }

  // ---------- render loop (on demand) ----------

  requestRender = () => {
    if (this.raf || this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private frame = () => {
    this.raf = 0;
    if (this.disposed) return;
    let animating = false;
    if (this.tween) {
      const t = Math.min(1, (performance.now() - this.tween.t0) / 500);
      const e = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(this.tween.from[0], this.tween.to[0], e);
      this.controls.target.lerpVectors(this.tween.from[1], this.tween.to[1], e);
      if (t >= 1) this.tween = null;
      animating = true;
    }
    // clamp the pan target to the bridge box + 20%
    const clamped = this.controls.target.clone().clamp(this.panBox.min, this.panBox.max);
    if (!clamped.equals(this.controls.target)) {
      this.camera.position.add(clamped.clone().sub(this.controls.target));
      this.controls.target.copy(clamped);
    }
    const moving = this.controls.update();
    // flip dimension lines to the camera-facing side
    const side = this.camera.position.z - this.controls.target.z >= 0 ? 1 : -1;
    if (side !== this.dimSide && this.g) {
      this.dimSide = side;
      this.buildDims();
    }
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    this.declutter();
    if (animating || moving || this.controls.autoRotate) this.requestRender();
  };

  /** Hides short-span labels and overlapping labels by priority (§5). */
  private declutter() {
    if (!this.opts.labels || !this.g) return;
    const minPx = this.opts.fullscreen ? 40 : 56;
    const w = this.host.clientWidth;
    const E = this.g.deckElevation;
    const z = this.dimSide * (this.g.deckWidth / 2 + 10);
    const g = this.g;
    const proj = (x: number) => new THREE.Vector3(...g.plan(x, E, z)).add(this.root.position).project(this.camera);
    // nearest pylon to the camera (for "same height → label one")
    let nearest = -1;
    let best = Infinity;
    this.g.pylons.forEach((p) => {
      const d = this.camera.position.distanceTo(new THREE.Vector3(...g.plan(p.x, E, 0)).add(this.root.position));
      if (d < best) {
        best = d;
        nearest = p.index;
      }
    });
    const host = this.host.getBoundingClientRect();
    const shown: DOMRect[] = [];
    const ordered = [...this.labelEls].sort((a, b) => a.priority - b.priority);
    for (const l of ordered) {
      let visible = true;
      if (l.span) visible = (Math.abs(proj(l.span[1]).x - proj(l.span[0]).x) * w) / 2 >= minPx || l.priority === 0;
      if (l.pylon !== undefined && l.pylon >= 0 && l.pylon !== nearest) visible = false;
      if (visible && l.obj) {
        // keep height labels inside the viewport: flip to the left of their line near the right edge
        const r = l.el.getBoundingClientRect();
        if (r.right > host.right - 4 && l.obj.center.x < 0) {
          l.obj.center.x = 1.08;
          this.requestRender();
        } else if (r.left < host.left + 4 && l.obj.center.x > 0) {
          l.obj.center.x = -0.08;
          this.requestRender();
        }
      }
      if (visible) {
        const r = l.el.getBoundingClientRect();
        if (shown.some((s) => !(r.right < s.left || r.left > s.right || r.bottom < s.top || r.top > s.bottom))) visible = false;
        else shown.push(r);
      }
      l.el.style.opacity = visible ? '1' : '0';
      if (l.line) l.line.visible = visible;
    }
  }
}

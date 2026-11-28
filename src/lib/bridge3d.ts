/**
 * Pure geometry for the schematic 3D bridge model (docs/design-3d.md §2–§3). No Three.js here,
 * so it is unit-testable.
 *
 * Coordinates are metres, no vertical exaggeration: x along the bridge (0 = start of the first
 * stay-cabled span), y up (water surface at y = 0), z across (0 = centreline).
 */
import type { CablePattern, Model3D, NavClearance, PylonShape, Status } from '../types';
import { arcAtY, catmullRom, panelMesh, pointAt, polyline, sweepRect, type SweepMesh } from './sweep';

export type { SweepMesh };

export type Vec3 = [number, number, number];

/** A straight structural member, rendered as a box from a to b with a square section. */
export interface Member {
  a: Vec3;
  b: Vec3;
  size: number;
  /** vertical depth of the section, when it differs from size (crossbeam_depth_m) */
  depth?: number;
  /** G12: per-member colour (pylon_custom strut colour); falls back to pylon_colour */
  colour?: string;
}

/** A swept pylon mesh (custom leg or G13 panel) with its optional G12 colour (falls back to pylon_colour). */
export type PylonSweep = SweepMesh & { colour?: string };

export interface SpanSeg {
  x0: number;
  x1: number;
  length: number;
  /** bounded by two pylons, or the longer span next to a single pylon */
  main: boolean;
}

export interface Pylon {
  index: number;
  x: number;
  /** interior support index: between spans[support] and spans[support + 1] */
  support: number;
  heightAboveDeck: number;
  /** label value: above deck, or water-to-top when the data gives total height */
  labelHeight: number;
  labelRef: 'above_deck' | 'total';
  members: Member[];
  /** swept meshes for custom (pylon_custom) pylons: one per leg (in leg order), then one per G13 panel */
  sweeps: PylonSweep[];
  custom: boolean;
  /** pile caps / footings (pylon_custom.pile_cap), drawn in plain concrete */
  caps: SweepMesh[];
}

export interface Cable {
  pylon: number;
  side: -1 | 1;
  plane: number;
  /** stay on a back span (toward the unit end), for back_stay_colour */
  back: boolean;
  /** index along the fan, 0 = nearest the pylon (used to thin dense fans for display) */
  j: number;
  top: Vec3;
  deck: Vec3;
}

export interface Box {
  /** centre */
  c: Vec3;
  /** full size along x, y, z (before rotation) */
  s: Vec3;
  /** rotation about y (plan curve), radians */
  yaw?: number;
  /** rotation about z (slope), radians; applied before yaw */
  pitch?: number;
}

export interface Clearance {
  /** station range of the channel (straight coordinates) */
  x0: number;
  x1: number;
  height: number;
  width: number;
  /** which values came from the data (the others are derived for drawing only) */
  givenHeight?: number;
  givenWidth?: number;
  box: Box;
  /** label anchor (top centre of the envelope) */
  labelAt: Vec3;
}

export interface BridgeGeometry {
  spans: SpanSeg[];
  totalLength: number;
  mainSpan: number;
  deckElevation: number;
  deckDepth: number;
  deckWidth: number;
  /** built deck ranges along the station axis (a single range when complete) */
  deckSegments: { x0: number; x1: number }[];
  /** deck boxes in world coordinates (many short pieces when curved in plan) */
  deckPieces: Box[];
  /** continuous deck meshes when the deck is curved in plan or cambered (used instead of the pieces) */
  deckMeshes: SweepMesh[];
  /** truss girder web (verticals + diagonals on both faces), world coordinates; empty for a box girder */
  deckMembers: Member[];
  deckSection: 'box' | 'truss';
  /** form travellers at cantilever tips (under construction only) */
  travellers: Box[];
  approaches: Box[];
  banks: Box[];
  pylons: Pylon[];
  piers: Box[];
  cables: Cable[];
  cablesPerSide: number;
  planes: 1 | 2;
  pattern: CablePattern;
  shape: PylonShape;
  extradosed: boolean;
  status: Status;
  deckType: Model3D['deck_type'];
  /** horizontal deck curve radius (undefined = straight) */
  planRadius?: number;
  /** maps straight station coordinates (x along the deck, y, z lateral) to world coordinates */
  plan: (x: number, y: number, z: number) => Vec3;
  /** heading (yaw) of the deck at station x */
  yawAt: (x: number) => number;
  clearance?: Clearance;
  /** auxiliary pier positions along the unit (station x) */
  auxiliaryPiers: number[];
  /** deck surface height at station x (includes the crest) */
  deckY: (x: number) => number;
  /** vivid: G14 colour_mode "vivid" (hex colours keep their sRGB saturation); absent = muted */
  colours: { pylon?: string; stay?: string; backStay?: string; deck?: string; vivid?: true };
  /** world bounds of the stay-cabled unit (no approaches) */
  bounds: { min: Vec3; max: Vec3 };
  /** values derived because the data did not give them */
  derived: string[];
  warnings: string[];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

/** Deck elevation above water (§2). */
export const deckElevation = (mainSpan: number) => clamp(0.1 * mainSpan, 12, 45);

/**
 * Pylon positions (§2): (a) count = interior supports → all of them; (b) ends of the largest spans;
 * (c) rank interior supports by the sum of their adjacent spans (with a warning).
 */
export function choosePylonSupports(spans: number[], k: number, warn?: (msg: string) => void): number[] {
  const n = spans.length - 1;
  if (n <= 0 || k <= 0) return [];
  if (k >= n) {
    if (k > n) warn?.(`model3d: ${k} pylons but only ${n} interior supports`);
    return Array.from({ length: n }, (_, i) => i);
  }
  const order = spans.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v || a.i - b.i);
  const set = new Set<number>();
  for (const { i } of order) {
    if (i - 1 >= 0) set.add(i - 1); // support left of span i
    if (i <= n - 1) set.add(i); // support right of span i
    if (set.size === k) return [...set].sort((a, b) => a - b);
    if (set.size > k) break;
  }
  warn?.(`model3d: could not place ${k} pylons at the ends of the largest spans; ranking supports instead`);
  return Array.from({ length: n }, (_, s) => ({ s, w: spans[s] + spans[s + 1] }))
    .sort((a, b) => b.w - a.w || a.s - b.s)
    .slice(0, k)
    .map((x) => x.s)
    .sort((a, b) => a - b);
}

/**
 * Stay-cable line lightness (HSL, 0–1) clamped so 1px stays stay visible against the sky: at most 0.70 in the
 * light theme (white stays read as light grey), at least 0.45 in the dark theme.
 */
export const stayLightness = (l: number, dark: boolean) => (dark ? Math.max(0.45, l) : Math.min(0.7, l));

/**
 * Pile-cap prism in a local frame: x ∈ ±L/2, z ∈ ±W/2, y ∈ [y0, y1]. With `rounded`, the plan is a stadium whose
 * semicircular ends (diameter L) sit on the ±z ends (W is clamped to at least L).
 */
export function pileCapMesh(L: number, W: number, y0: number, y1: number, rounded = false, seg = 12): SweepMesh {
  const r = L / 2;
  const outline: [number, number][] = []; // (x, z), one closed loop in plan
  if (rounded) {
    const c = Math.max(0, W / 2 - r);
    // -z end: x from +r to -r around (0, -c); +z end: x from -r to +r around (0, c)
    for (let k = 0; k <= seg; k++) {
      const t = (Math.PI * k) / seg;
      outline.push([r * Math.cos(t), -c - r * Math.sin(t)]);
    }
    for (let k = 0; k <= seg; k++) {
      const t = Math.PI + (Math.PI * k) / seg;
      outline.push([r * Math.cos(t), c - r * Math.sin(t)]);
    }
  } else
    outline.push([-r, -W / 2], [r, -W / 2], [r, W / 2], [-r, W / 2]);
  const n = outline.length;
  const positions: number[] = [];
  for (const y of [y0, y1]) for (const [x, z] of outline) positions.push(x, y, z);
  positions.push(0, y0, 0, 0, y1, 0); // centres for the fan-triangulated bottom / top
  const indices: number[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    indices.push(i, j, n + j, i, n + j, n + i);
    indices.push(2 * n, j, i); // bottom
    indices.push(2 * n + 1, n + i, n + j); // top
  }
  return { positions, indices };
}

/** Default stays per pylon per side per plane (§2). */
export const defaultCablesPerSide = (reach: number) => clamp(Math.round(reach / 12), 6, 24);

interface ShapeOut {
  members: Member[];
  /** z of the pylon-side anchor for a plane at height y (absolute) */
  anchorZ: (plane: number, y: number) => number;
}

/**
 * Pylon members for a shape. Legs sit at the cable-plane positions (±hw); y0 = foot (water),
 * yd = deck, yt = top. Leg section ≈ 1/25 of the total pylon height.
 */
function buildPylon(shape: PylonShape, x: number, hw: number, yd: number, yt: number, planes: 1 | 2): ShapeOut {
  const leg = clamp(yt / 25, 1.5, 8);
  const P = (y: number, z: number): Vec3 => [x, y, z];
  const m = (a: Vec3, b: Vec3, size = leg): Member => ({ a, b, size });
  const sideZ = (plane: number, z: number) => (planes === 1 ? 0 : plane === 0 ? -z : z);
  // z of a straight leg from (yA, zA) to (yB, zB) at height y
  const lerpZ = (y: number, yA: number, zA: number, yB: number, zB: number) => zA + ((zB - zA) * (y - yA)) / (yB - yA);
  const under = yd - 3; // under-deck crossbeam height

  switch (shape) {
    case 'single':
      return { members: [m(P(0, 0), P(yt, 0), leg * 1.3)], anchorZ: () => 0 };
    case 'A':
    case 'inverted_V': {
      // straight legs to the apex, passing just outside the deck edges at deck level
      const zf = (hw + leg / 2) / (1 - yd / yt);
      const ms = [m(P(0, -zf), P(yt, 0)), m(P(0, zf), P(yt, 0))];
      if (shape === 'A') {
        const z = lerpZ(under, 0, zf, yt, 0);
        ms.push(m(P(under, -z), P(under, z), leg * 0.8));
      }
      return { members: ms, anchorZ: (pl, y) => sideZ(pl, Math.max(leg * 0.4, lerpZ(y, 0, zf, yt, 0))) };
    }
    case 'inverted_Y': {
      // diamond foot: legs start close together at the footing, splay out to just outside the deck
      // edges at deck level, then lean in to meet at 60% of the height above deck (single mast above)
      const zFoot = 0.45 * hw;
      const zDeck = hw + leg / 2;
      const yj = yd + 0.6 * (yt - yd);
      return {
        members: [
          m(P(0, -zFoot), P(yd, -zDeck)),
          m(P(0, zFoot), P(yd, zDeck)),
          m(P(yd, -zDeck), P(yj, 0)),
          m(P(yd, zDeck), P(yj, 0)),
          m(P(yj, 0), P(yt, 0), leg * 1.2),
        ],
        anchorZ: (pl, y) => (y >= yj ? sideZ(pl, leg * 0.4) : sideZ(pl, lerpZ(y, yd, zDeck, yj, 0))),
      };
    }
    case 'diamond': {
      // lower half converges toward the footing; widest just outside the deck edges; upper half to the apex
      const zFoot = 0.25 * hw;
      const zDeck = hw + leg / 2;
      const ms = [
        m(P(0, -zFoot), P(yd, -zDeck)),
        m(P(0, zFoot), P(yd, zDeck)),
        m(P(yd, -zDeck), P(yt, 0)),
        m(P(yd, zDeck), P(yt, 0)),
      ];
      return { members: ms, anchorZ: (pl, y) => sideZ(pl, Math.max(leg * 0.4, lerpZ(y, yd, zDeck, yt, 0))) };
    }
    case 'other': {
      // unknown / bespoke form (arch, V, twisted …): a neutral tapered shape, never a crash.
      // 1 plane → tapered single mast; 2 planes → tapered portal with a head beam.
      const mid = yd + 0.5 * (yt - yd);
      if (planes === 1)
        return {
          members: [m(P(0, 0), P(mid, 0), leg * 1.5), m(P(mid, 0), P(yt, 0), leg * 1.0)],
          anchorZ: () => 0,
        };
      return {
        members: [
          m(P(0, -hw), P(mid, -hw), leg * 1.2),
          m(P(mid, -hw), P(yt, -hw), leg * 0.8),
          m(P(0, hw), P(mid, hw), leg * 1.2),
          m(P(mid, hw), P(yt, hw), leg * 0.8),
          m(P(under, -hw), P(under, hw), leg * 0.8),
          m(P(yt, -hw), P(yt, hw), leg * 0.8),
        ],
        anchorZ: (pl) => sideZ(pl, hw),
      };
    }
    case 'H':
    default:
      return {
        members: [
          m(P(0, -hw), P(yt, -hw)),
          m(P(0, hw), P(yt, hw)),
          m(P(under, -hw), P(under, hw), leg * 0.8),
          m(P(yd + 0.85 * (yt - yd), -hw), P(yd + 0.85 * (yt - yd), hw), leg * 0.8),
        ],
        anchorZ: (pl) => sideZ(pl, hw),
      };
  }
}

/** Builds the geometry; returns null for unusable data (§2: no partial model). */
export function buildBridgeGeometry(
  m: Model3D,
  status: Status = 'completed',
  opts: { navClearance?: NavClearance } = {},
): BridgeGeometry | null {
  const derived: string[] = [];
  const warnings: string[] = [];
  const spans = (m.spans_m ?? []).filter((s) => Number.isFinite(s) && s > 0);
  if (spans.length < 2 || !(m.deck_width_m > 0)) return null;

  const extradosed = !!m.extradosed;
  const totalLength = sum(spans);
  const W = m.deck_width_m;
  const hw = W / 2;
  const planes = m.cable_planes === 1 ? 1 : 2;

  let k = m.pylon_heights_m.length;
  if (k === 0) {
    // derive: pylons at the ends of the spans >= 75% of the largest
    const maxS = Math.max(...spans);
    const set = new Set<number>();
    spans.forEach((s, i) => {
      if (s >= 0.75 * maxS) {
        if (i > 0) set.add(i - 1);
        if (i < spans.length - 1) set.add(i);
      }
    });
    k = Math.max(1, set.size);
    derived.push('pylon count');
  }
  const supports = choosePylonSupports(spans, k, (w) => warnings.push(w));
  if (!supports.length) return null;

  const edges = spans.reduce<number[]>((acc, s) => [...acc, acc[acc.length - 1] + s], [0]);
  const main = spans.map(() => false);
  if (supports.length >= 2) for (let s = supports[0] + 1; s <= supports[supports.length - 1]; s++) main[s] = true;
  else main[spans[supports[0]] >= spans[supports[0] + 1] ? supports[0] : supports[0] + 1] = true;
  const mainSpan = Math.max(...spans.filter((_, i) => main[i]));

  const truss = m.deck_section === 'truss';
  const deckDepth =
    m.deck_depth_m && m.deck_depth_m > 0 ? m.deck_depth_m : truss ? 12 : clamp(mainSpan / 120, 2, 4.5) * (extradosed ? 1.8 : 1);
  // the navigation clearance (if given) must fit under the deck
  const navH = opts.navClearance?.height_m;
  const navMin = navH ? navH + deckDepth + 1 : 0;
  const givenE = m.deck_elevation_m && m.deck_elevation_m > 0 ? m.deck_elevation_m : undefined;
  // vertical curve: the deck rises by deck_crest_m at mid-unit (parabola, 0 at the unit ends).
  const centre = totalLength / 2;
  const crest = m.deck_crest_m ?? 0;
  const crestAt = (x: number) => (crest && x > 0 && x < totalLength ? crest * (1 - ((x - centre) / centre) ** 2) : 0);
  // the clearance is checked at the centre of the widest main span (the envelope's station), where the crest adds height
  const mi = spans.reduce((best, s, i) => (main[i] && s > (main[best] ? spans[best] : -1) ? i : best), main.indexOf(true));
  const crestMain = crestAt((edges[mi] + edges[mi + 1]) / 2);
  const E = Math.max(givenE ?? deckElevation(mainSpan), navMin - crestMain);
  if (givenE !== undefined && givenE + crestMain < navMin) warnings.push('deck_elevation_m below navigation clearance');
  const isPylonSupport = new Set(supports);

  // reach of the stays on each side of a support (§2)
  /** next pylon support in a direction, or undefined when the stays run to the unit end */
  const nextPylon = (support: number, side: -1 | 1) => {
    for (let s2 = support + side; s2 >= 0 && s2 < spans.length - 1; s2 += side) if (isPylonSupport.has(s2)) return s2;
    return undefined;
  };
  // stays reach mid-way to the next pylon, or 95% of the way to the unit end (across auxiliary piers)
  const reach = (support: number, side: -1 | 1) => {
    const x = edges[support + 1];
    const n = nextPylon(support, side);
    if (n !== undefined) return Math.abs(edges[n + 1] - x) / 2;
    return 0.95 * (side < 0 ? x : totalLength - x);
  };
  /** true when this side of the pylon is a back span (toward the unit end, not a main span) */
  const isBackSide = (support: number, side: -1 | 1) =>
    nextPylon(support, side) === undefined && !main[side < 0 ? support : support + 1];

  // auxiliary piers: explicit positions plus interior supports that carry no pylon
  const auxiliaryPiers = [
    ...new Set(
      [
        ...(m.auxiliary_piers_m ?? []),
        ...edges.slice(1, -1).filter((_, s2) => !isPylonSupport.has(s2)),
      ]
        .filter((a) => a > 0 && a < totalLength)
        .map((a) => Math.round(a * 1000) / 1000),
    ),
  ].sort((a, b) => a - b);
  const AUX_SNAP = 4;

  // ---- custom pylons (pylon_custom): swept legs in the pylon-local frame ----
  const custom = m.pylon_custom;
  // per-pylon heights for a shared custom geometry: scale each pylon's above-deck y by h_i / max(h)
  const hs = m.pylon_heights_m;
  const hMax = hs.length ? Math.max(...hs) : 0;
  const pylonScale = (index: number) =>
    custom && hs.length > 1 && new Set(hs).size > 1 && hMax > 0 ? (hs[index] ?? hMax) / hMax : 1;
  /** +1 when local +x (toward the main span) points along +station */
  const towardMain = (support: number, x: number) =>
    main[support + 1] && !main[support] ? 1 : main[support] && !main[support + 1] ? -1 : x <= centre ? 1 : -1;
  const customLegs = (support: number, x: number, index: number) => {
    if (!custom) return null;
    const dir = custom.mirror_for_other_pylons === false && index > 0 ? towardMain(supports[0], edges[supports[0] + 1]) : towardMain(support, x);
    const f = pylonScale(index);
    const toStation = ([lx, ly, lz]: Vec3): Vec3 => [x + dir * lx, E + (ly > 0 ? ly * f : ly), lz];
    // legs whose tips meet (within 1.5 m) form a crown
    const tips = custom.legs.map((l) => l.centerline[l.centerline.length - 1]);
    const merging = custom.legs.map((_, i) =>
      tips.some((t, j) => j !== i && Math.hypot(t[0] - tips[i][0], t[1] - tips[i][1], t[2] - tips[i][2]) < 1.5),
    );
    const crown = custom.crown ?? 'pointed';
    const crownMembers: Member[] = [];
    const flatCuts: Vec3[] = [];
    const legs = custom.legs.map((leg, li) => {
      let pts = leg.centerline.map(toStation);
      const A = pts[pts.length - 1];
      const P = pts[pts.length - 2];
      let phantom: Vec3 | undefined;
      if (merging[li] && crown === 'rounded') {
        // rounded crown: a shoulder point just below the apex plus a horizontal end tangent
        // (phantom mirrored across the apex) turn the meeting legs into a smooth arch
        const dz = P[2] - A[2];
        const r = Math.max(1.5, 0.45 * Math.abs(dz));
        const shoulder: Vec3 = [A[0] + (P[0] - A[0]) * 0.15, A[1] - 0.35 * r, A[2] + Math.sign(dz || 1) * r];
        pts = [...pts.slice(0, -1), shoulder, A];
        phantom = [shoulder[0], shoulder[1], 2 * A[2] - shoulder[2]];
      }
      let pl = polyline(catmullRom(pts, 12, phantom));
      if (merging[li] && crown === 'flat') {
        // flat crown: stop the leg below the apex; a head beam joins the cut ends
        const cutY = A[1] - 0.08 * (A[1] - pts[0][1]);
        const sCut = arcAtY(pl, cutY);
        const kept = pl.pts.filter((_, k) => pl.s[k] < sCut);
        const end = pointAt(pl, sCut);
        pl = polyline([...kept, end]);
        flatCuts.push(end);
      }
      const mesh = sweepRect(
        pl,
        leg.width_base_m,
        leg.width_top_m,
        leg.depth_base_m ?? leg.width_base_m,
        leg.depth_top_m ?? leg.width_top_m,
        leg.twist_deg ?? 0,
      );
      return { pl, mesh: (leg.colour ? { ...mesh, colour: leg.colour } : mesh) as PylonSweep, w0: leg.width_base_m, w1: leg.width_top_m };
    });
    for (let k = 0; k + 1 < flatCuts.length; k++)
      crownMembers.push({ a: flatCuts[k], b: flatCuts[k + 1], size: Math.max(1.5, legs[0].w1) });
    const struts: Member[] = (custom.struts ?? []).map((st) =>
      st.colour ? { a: toStation(st.a), b: toStation(st.b), size: st.width, colour: st.colour } : { a: toStation(st.a), b: toStation(st.b), size: st.width },
    );
    // G13: flat infill panels between a top and a bottom (z, y) curve, extruded along local x
    const panels: PylonSweep[] = (custom.panels ?? []).map((pn) => {
      const xm = pn.x_m ?? 0;
      const mesh = panelMesh(pn.top, pn.bottom, xm - pn.depth_m / 2, xm + pn.depth_m / 2);
      const pos = mesh.positions;
      for (let k = 0; k < pos.length; k += 3) {
        const v = toStation([pos[k], pos[k + 1], pos[k + 2]]);
        pos[k] = v[0];
        pos[k + 1] = v[1];
        pos[k + 2] = v[2];
      }
      return pn.colour ? { ...mesh, colour: pn.colour } : mesh;
    });
    const caps: SweepMesh[] = [];
    if (custom.pile_cap) {
      const pc = custom.pile_cap;
      const mesh = pileCapMesh(pc.length_x_m, pc.width_z_m, pc.top_y_m - pc.thickness_m, pc.top_y_m, !!pc.rounded_ends);
      const pos = mesh.positions.slice();
      for (let k = 0; k < pos.length; k += 3) {
        const v = toStation([pos[k], pos[k + 1], pos[k + 2]]);
        pos[k] = v[0];
        pos[k + 1] = v[1];
        pos[k + 2] = v[2];
      }
      caps.push({ positions: pos, indices: mesh.indices });
    }
    return Object.assign(legs, { extra: [...crownMembers, ...struts], caps, panels });
  };

  const pylons: Pylon[] = supports.map((support, i) => {
    const x = edges[support + 1];
    const legs = customLegs(support, x, i);
    if (legs) {
      const tip = Math.max(...legs.flatMap((l) => l.pl.pts.map((p) => p[1]))) - E;
      // crossbeams between consecutive legs at the given heights (local y above deck)
      const members: Member[] = [];
      for (const y0 of custom!.crossbeams_y_m ?? [])
        for (let k = 0; k + 1 < legs.length; k++) {
          const y = y0 > 0 ? y0 * pylonScale(i) : y0;
          const a = pointAt(legs[k].pl, arcAtY(legs[k].pl, E + y));
          const b = pointAt(legs[k + 1].pl, arcAtY(legs[k + 1].pl, E + y));
          const size = Math.max(1.5, legs[k].w1 * 0.8);
          members.push(custom!.crossbeam_depth_m ? { a, b, size, depth: custom!.crossbeam_depth_m } : { a, b, size });
        }
      members.push(...legs.extra);
      // the label follows the data's reference: water-to-tip of the drawn pylon when heights are given as total
      const total = m.pylon_height_ref === 'total';
      return {
        index: i,
        x,
        support,
        heightAboveDeck: tip,
        // the plan mapping lifts everything above E by the crest at the pylon, so the drawn tip includes it
        labelHeight: total ? tip + E + crestAt(x) : tip,
        labelRef: total ? ('total' as const) : ('above_deck' as const),
        members,
        sweeps: [...legs.map((l) => l.mesh), ...legs.panels],
        custom: true,
        caps: legs.caps,
      };
    }
    const adjMain = Math.max(main[support] ? spans[support] : 0, main[support + 1] ? spans[support + 1] : 0) || mainSpan;
    const given = m.pylon_heights_m[i] ?? m.pylon_heights_m[m.pylon_heights_m.length - 1];
    let above: number;
    if (given === undefined) {
      above = (extradosed ? 0.1 : 0.22) * adjMain;
      if (!derived.includes('pylon height')) derived.push('pylon height');
    } else if (m.pylon_height_ref === 'total') above = Math.max(given - E - crestAt(x), 0.3 * given);
    else above = given;
    const shape = buildPylon(m.pylon_shape, x, hw, E, E + above, planes);
    return {
      index: i,
      x,
      support,
      heightAboveDeck: above,
      labelHeight: given !== undefined && m.pylon_height_ref === 'total' ? given : above,
      labelRef: given !== undefined && m.pylon_height_ref === 'total' ? ('total' as const) : ('above_deck' as const),
      members: shape.members,
      sweeps: [],
      custom: false,
      caps: [],
    };
  });
  const shapes = pylons.map((p) => buildPylon(m.pylon_shape, p.x, hw, E, E + p.heightAboveDeck, planes));
  const legCurves = pylons.map((p, i) => customLegs(p.support, p.x, i));

  // piers at the abutments and at every auxiliary pier (built in world coordinates further down)
  const pierT = clamp(mainSpan / 100, 2, 5);
  const pierXs = [0, ...auxiliaryPiers, totalLength];

  // deck: complete, or balanced cantilevers to 60% of each reach (under construction). G16: deck_closed keeps the
  // full deck (all closures done) on a bridge that is not yet open; only the geometry changes, not the status.
  let deckSegments: { x0: number; x1: number }[] = [{ x0: 0, x1: totalLength }];
  const travellerBoxes: Box[] = [];
  if (status === 'under_construction' && m.deck_closed !== true) {
    deckSegments = pylons.map((p) => ({
      x0: p.x - 0.6 * reach(p.support, -1),
      x1: p.x + 0.6 * reach(p.support, 1),
    }));
    for (const seg of deckSegments)
      for (const x of [seg.x0, seg.x1]) travellerBoxes.push({ c: [x, E + 2.5, 0], s: [6, 5, Math.max(4, W * 0.9)] });
  }
  const onBuiltDeck = (x: number) => deckSegments.some((s) => x >= s.x0 - 1e-6 && x <= s.x1 + 1e-6);

  // cables
  const pattern = m.cable_pattern;
  let perSide = m.cables_per_side;
  if (!perSide) {
    const mainReach = Math.max(...pylons.map((p) => Math.max(reach(p.support, -1), reach(p.support, 1))));
    perSide = defaultCablesPerSide(Math.min(mainReach, mainSpan / 2));
    derived.push('cables per side');
  }
  const deckZ = (plane: number, n: number = planes) => (n === 1 ? 0 : plane === 0 ? -hw : hw);
  // back stays split into two planes (cable_planes = 1, back_stay_planes = 2: Trần Thị Lý)
  const splitBack = planes === 1 && m.back_stay_planes === 2;
  // G11: back sides may have their own stay count and a fixed deck-anchor range (Trần Thị Lý: 15 per plane, all
  // converging on 181–195 m behind the pylon at abutment S1). Without the fields nothing changes.
  const backCount = m.back_stay_count ?? perSide;
  let backDeck: [number, number] | undefined = m.back_stay_deck_m ? [m.back_stay_deck_m[0], m.back_stay_deck_m[1]] : undefined;
  if (backDeck && pattern === 'harp') {
    warnings.push('back_stay_deck_m ignored for harp stays');
    backDeck = undefined;
  } else if (backDeck && backDeck[0] > backDeck[1]) {
    warnings.push('back_stay_deck_m: from > to, swapped');
    backDeck = [backDeck[1], backDeck[0]];
  }
  // G15: the same fixed deck range for the main sides (main span, or toward the next pylon). Without it nothing changes.
  let mainDeck: [number, number] | undefined = m.main_stay_deck_m ? [m.main_stay_deck_m[0], m.main_stay_deck_m[1]] : undefined;
  if (mainDeck && pattern === 'harp') {
    warnings.push('main_stay_deck_m ignored for harp stays');
    mainDeck = undefined;
  } else if (mainDeck && mainDeck[0] > mainDeck[1]) {
    warnings.push('main_stay_deck_m: from > to, swapped');
    mainDeck = [mainDeck[1], mainDeck[0]];
  }
  let mainDeckClamped = false;

  /** anchor zone, leg curve and face offset serving a cable plane of a custom pylon */
  // per-side anchor zones (G8): when any zone names a side, stays on the main / back side use only the zones for
  // that side (zones without a side serve both), and anchor on the leg's actual z even on a single-plane bridge
  const sideZones = !!custom?.anchor_zone.some((z) => z.side);
  const customZone = (pi: number, plane: number, back = false, nPl: number = planes) => {
    const legs = legCurves[pi]!;
    let zones = custom!.anchor_zone;
    if (sideZones) {
      const want = back ? 'back' : 'main';
      const mine = zones.filter((z) => (z.side ?? want) === want);
      if (mine.length) zones = mine;
    }
    let zone = zones[0];
    let zOffset = 0;
    if (nPl === 2) {
      const sideSign = plane === 0 ? -1 : 1;
      const match = zones.find((z) => {
        const pts = legs[z.leg].pl.pts;
        return Math.sign(pts.reduce((a, p) => a + p[2], 0) / pts.length || 0) === sideSign;
      });
      if (match) zone = match;
      else {
        zone = zones[plane % zones.length];
        // one leg serving both planes: anchor on its two faces
        if (new Set(zones.map((z) => z.leg)).size === 1) zOffset = (sideSign * legs[zone.leg].w1) / 2;
      }
    }
    const f = pylonScale(pi);
    return { leg: legs[zone.leg], from: zone.y_from_m * f, to: zone.y_to_m * f, zOffset };
  };
  /** anchor z: single-plane bridges anchor on the centreline unless the zone was chosen by side (G8) */
  const anchorZ = (p: Vec3, zOffset: number) => (planes === 1 && !sideZones ? 0 : p[2] + zOffset);
  /** custom pylon anchor at local height y above deck (on the zone's leg) */
  const customAnchorAtY = (pi: number, plane: number, y: number, back?: boolean, nPl?: number): Vec3 => {
    const { leg, zOffset } = customZone(pi, plane, back, nPl);
    const p = pointAt(leg.pl, arcAtY(leg.pl, E + y));
    return [p[0], p[1], anchorZ(p, zOffset)];
  };
  /** custom pylon anchor distributed by arc length along the anchor zone (t = 0 lowest) */
  const customAnchor = (pi: number, plane: number, t: number, back?: boolean, nPl?: number): Vec3 => {
    const { leg, from, to, zOffset } = customZone(pi, plane, back, nPl);
    const s0 = arcAtY(leg.pl, E + from);
    const s1 = arcAtY(leg.pl, E + to);
    const p = pointAt(leg.pl, s0 + (s1 - s0) * t);
    return [p[0], p[1], anchorZ(p, zOffset)];
  };
  /** half the section width of a custom pylon's anchor leg at height y (for back stays split to both faces) */
  const customHalfWidth = (pi: number, y: number) => {
    const { leg } = customZone(pi, 0);
    const fr = leg.pl.length ? arcAtY(leg.pl, y) / leg.pl.length : 1;
    return (leg.w0 + (leg.w1 - leg.w0) * fr) / 2;
  };

  const cablesStation: Cable[] = [];
  pylons.forEach((p, pi) => {
    const yd = E;
    const H = p.heightAboveDeck;
    const [lo, hi] = pattern === 'fan' ? [0.97, 0.97] : pattern === 'semi_fan' ? [0.75, 0.97] : [0.3, 0.97];
    const builtInHalf = clamp((E + H) / 25, 1.5, 8) * 0.65;
    for (const side of [-1, 1] as const) {
      const r = reach(p.support, side);
      const back = isBackSide(p.support, side);
      const [f0, f1] = extradosed ? [0.15, 0.5] : [0.08, 1];
      const nPlanes = splitBack && back ? 2 : planes;
      for (let plane = 0; plane < nPlanes; plane++) {
        // per-side zones pick their own leg per plane; otherwise a split back side anchors on the faces of plane 0's leg
        const bySide = p.custom && sideZones;
        const anchorPlane = bySide || nPlanes === planes ? plane : 0;
        const zN = bySide ? nPlanes : planes;
        /** pylon-side anchor at local height y above deck (harp), or by fan index t */
        const atY = (y: number): Vec3 =>
          p.custom ? customAnchorAtY(pi, anchorPlane, y, back, zN) : [p.x, yd + y, shapes[pi].anchorZ(anchorPlane, yd + y)];
        // harp: anchor heights linear from yLow to yTop; deck stations proportional to the height above deck, so
        // every stay on this side has the same slope (parallel). yLow = yTop·f0/f1 unless the anchor zone / 15%
        // floor is higher, in which case the deck stations start further out instead of bunching the stays.
        let harp: { yLow: number; yTop: number; k: number } | undefined;
        if (pattern === 'harp') {
          const zone = p.custom ? customZone(pi, anchorPlane, back, zN) : undefined;
          const yTop = zone ? zone.to : H * hi;
          const yLow = Math.min(yTop, Math.max(zone ? zone.from : 0.15 * H, (yTop * f0) / f1));
          const outer = atY(yTop);
          const run = Math.abs(p.x + side * r * f1 - outer[0]);
          harp = { yLow, yTop, k: run / Math.max(1e-6, outer[1] - yd) };
        }
        const n = back ? backCount : perSide;
        for (let j = 0; j < n; j++) {
          const t = n === 1 ? 1 : j / (n - 1); // 0 = nearest the pylon
          let top: Vec3;
          let x: number;
          if (harp) {
            top = atY(harp.yLow + (harp.yTop - harp.yLow) * t);
            x = top[0] + side * harp.k * (top[1] - yd);
          } else if (back && backDeck) {
            // G11: fixed back-side deck range, measured from the pylon station toward the unit end
            const toEnd = side < 0 ? p.x : totalLength - p.x;
            const lim = (d: number) => clamp(d, 1, Math.max(1, toEnd - 1));
            const d0 = lim(backDeck[0]);
            x = p.x + side * (d0 + (lim(backDeck[1]) - d0) * t);
            top = p.custom ? customAnchor(pi, anchorPlane, t, back, zN) : atY(H * (lo + (hi - lo) * t));
          } else if (!back && mainDeck) {
            // G15: fixed main-side deck range, measured from the pylon station toward the main span (≤ reach − 1)
            const lim = (d: number) => {
              const c = clamp(d, 1, Math.max(1, r - 1));
              if (c !== d) mainDeckClamped = true;
              return c;
            };
            const d0 = lim(mainDeck[0]);
            x = p.x + side * (d0 + (lim(mainDeck[1]) - d0) * t);
            top = p.custom ? customAnchor(pi, anchorPlane, t, back, zN) : atY(H * (lo + (hi - lo) * t));
          } else {
            x = p.x + side * r * (f0 + (f1 - f0) * t);
            // back-span anchors close to an auxiliary pier sit on it (the pier takes the back-stay force)
            if (back) {
              const near = auxiliaryPiers.find((a) => Math.abs(a - x) < AUX_SNAP && Math.sign(a - p.x) === side);
              if (near !== undefined) x = near;
            }
            // outer stays anchor highest (no crossing); fan: all at one point
            top = p.custom ? customAnchor(pi, anchorPlane, t, back, zN) : atY(H * (lo + (hi - lo) * t));
          }
          if (!onBuiltDeck(x)) continue;
          if (nPlanes !== planes && !bySide) {
            // split back stays leave the mast from its two faces
            const half = p.custom ? customHalfWidth(pi, top[1]) : builtInHalf;
            top = [top[0], top[1], top[2] + (plane === 0 ? -half : half)];
          }
          cablesStation.push({ pylon: pi, side, plane, top, deck: [x, yd, deckZ(plane, nPlanes)], back, j });
        }
      }
    }
  });

  if (mainDeckClamped) warnings.push('main_stay_deck_m clamped to the stay reach (half-way to the next pylon)');

  // approaches + banks: shortened for context (the stayed unit is the subject)
  const A = Math.min(m.approach_length_m ?? 0.15 * totalLength, 0.2 * totalLength);
  if (m.approach_length_m === undefined) derived.push('approach length');
  const bankH = 4;
  const bankL = A + 80;

  // navigation clearance envelope under the main span(s), centred on the widest main span
  let clearanceStation: Omit<Clearance, 'box' | 'labelAt'> | undefined;
  const nav = opts.navClearance;
  if (nav && (nav.height_m || nav.width_m)) {
    const c = (edges[mi] + edges[mi + 1]) / 2;
    const width = Math.min(nav.width_m ?? 0.6 * spans[mi], spans[mi] * 0.95);
    const height = nav.height_m ?? E - deckDepth - 1;
    clearanceStation = { x0: c - width / 2, x1: c + width / 2, height, width, givenHeight: nav.height_m, givenWidth: nav.width_m };
  }

  // ---- plan curvature: map straight station coordinates onto a horizontal arc ----
  const R = m.deck_plan_radius_m && m.deck_plan_radius_m > totalLength / Math.PI ? m.deck_plan_radius_m : undefined;
  // vertical curve (crest, crestAt above): folded into the mapping, scaled by height so the footings stay
  // in the water and the deck follows it.
  const crestSlope = (x: number) => (crest && x > 0 && x < totalLength ? (-2 * crest * (x - centre)) / centre ** 2 : 0);
  const plan = (x: number, y: number, z: number): Vec3 => {
    const yy = y + crestAt(x) * Math.min(1, Math.max(0, y / E));
    if (!R) return [x, yy, z];
    const th = (x - centre) / R;
    return [centre + (R - z) * Math.sin(th), yy, R - (R - z) * Math.cos(th)];
  };
  /** deck surface height at station x */
  const deckY = (x: number) => E + crestAt(x);
  const yawAt = (x: number) => (R ? -(x - centre) / R : 0);
  const mapV = (v: Vec3) => plan(v[0], v[1], v[2]);
  const mapBox = (b: Box): Box => ({ ...b, c: mapV(b.c), yaw: (b.yaw ?? 0) + yawAt(b.c[0]) });

  const deckPieces: Box[] = [];
  const deckMembers: Member[] = [];
  const pieceLen = R || crest ? 20 : Infinity;
  // truss: top and bottom chord slabs, deckDepth apart (stays anchor at the top chord edges)
  const CHORD = 0.6;
  const layers: [number, number][] = truss ? [[0, CHORD], [deckDepth - CHORD, CHORD]] : [[0, deckDepth]]; // [depth below deck top, thickness]
  for (const seg of deckSegments) {
    const n = Math.max(1, Math.ceil((seg.x1 - seg.x0) / pieceLen));
    const L = (seg.x1 - seg.x0) / n;
    for (let k = 0; k < n; k++) {
      const x = seg.x0 + (k + 0.5) * L;
      for (const [below, th] of layers) {
        // a hair longer than the arc piece so curved joints close
        const piece = mapBox({ c: [x, E - below - th / 2, 0], s: [L + (R || crest ? 0.3 : 0), th, W] });
        piece.c[1] = deckY(x) - below - th / 2;
        if (crest) piece.pitch = Math.atan(crestSlope(x));
        deckPieces.push(piece);
      }
    }
    if (truss) {
      // Warren web on both faces: verticals at every node, diagonals alternating, panels ≈ deckDepth long
      const panels = Math.max(1, Math.round((seg.x1 - seg.x0) / deckDepth));
      const pl = (seg.x1 - seg.x0) / panels;
      // straight-deck heights: the plan mapping adds the crest (if any) itself
      const yT = E - CHORD;
      const yB = E - deckDepth + CHORD;
      const size = clamp(deckDepth / 14, 0.5, 1.2);
      for (const z of [-hw + size / 2, hw - size / 2])
        for (let k = 0; k <= panels; k++) {
          const xa = seg.x0 + k * pl;
          deckMembers.push({ a: [xa, yB, z], b: [xa, yT, z], size });
          if (k < panels) {
            const xb = xa + pl;
            deckMembers.push(k % 2 ? { a: [xa, yT, z], b: [xb, yB, z], size } : { a: [xa, yB, z], b: [xb, yT, z], size });
          }
        }
    }
  }
  // continuous deck meshes for curved / cambered decks (box pieces would show an outline every 20 m)
  const deckMeshes: SweepMesh[] = [];
  if ((R || crest) && !truss)
    for (const seg of deckSegments) {
      const n = Math.max(2, Math.ceil((seg.x1 - seg.x0) / 10));
      const positions: number[] = [];
      const indices: number[] = [];
      for (let k = 0; k <= n; k++) {
        const x = seg.x0 + ((seg.x1 - seg.x0) * k) / n;
        const yTop = deckY(x);
        // ring: bottom-left, bottom-right, top-right, top-left (z from -hw to +hw)
        for (const [y, z] of [
          [yTop - deckDepth, -hw],
          [yTop - deckDepth, hw],
          [yTop, hw],
          [yTop, -hw],
        ] as const) {
          const p = plan(x, E, z);
          positions.push(p[0], y, p[2]);
        }
      }
      for (let i = 0; i < n; i++)
        for (let k = 0; k < 4; k++) {
          const a0 = i * 4 + k;
          const b0 = i * 4 + ((k + 1) % 4);
          indices.push(a0, b0, (i + 1) * 4 + ((k + 1) % 4), a0, (i + 1) * 4 + ((k + 1) % 4), (i + 1) * 4 + k);
        }
      const last = n * 4;
      indices.push(0, 2, 1, 0, 3, 2, last, last + 1, last + 2, last, last + 2, last + 3);
      deckMeshes.push({ positions, indices });
    }
  const pitch = Math.atan2(E - bankH, A);
  const apD = truss ? 3 : deckDepth;
  const approaches: Box[] = [
    mapBox({ c: [-A / 2, (E + bankH) / 2 - apD / 2, 0], s: [Math.hypot(A, E - bankH), apD, W], pitch }),
    mapBox({ c: [totalLength + A / 2, (E + bankH) / 2 - apD / 2, 0], s: [Math.hypot(A, E - bankH), apD, W], pitch: -pitch }),
  ];
  const piers: Box[] = pierXs.map((px) => {
    const h = deckY(px) - deckDepth;
    const c = plan(px, 0, 0);
    return { c: [c[0], h / 2, c[2]], s: [pierT, h, 0.6 * W], yaw: yawAt(px) };
  });
  const banks: Box[] = [
    mapBox({ c: [-bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] }),
    mapBox({ c: [totalLength + bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] }),
  ];
  for (const p of pylons) {
    p.members = p.members.map((mb) => ({ ...mb, a: mapV(mb.a), b: mapV(mb.b) }));
    const mapMesh = (sw: SweepMesh): SweepMesh => {
      const pos = sw.positions.slice();
      for (let i = 0; i < pos.length; i += 3) {
        const v = plan(pos[i], pos[i + 1], pos[i + 2]);
        pos[i] = v[0];
        pos[i + 1] = v[1];
        pos[i + 2] = v[2];
      }
      return { ...sw, positions: pos };
    };
    p.sweeps = p.sweeps.map(mapMesh);
    p.caps = p.caps.map(mapMesh);
  }
  const cables = cablesStation.map((c) => ({ ...c, top: mapV(c.top), deck: mapV(c.deck) }));
  const clearance: Clearance | undefined = clearanceStation && {
    ...clearanceStation,
    box: (() => {
      const mid = (clearanceStation.x0 + clearanceStation.x1) / 2;
      const c = plan(mid, 0, 0);
      return { c: [c[0], clearanceStation.height / 2, c[2]] as Vec3, s: [clearanceStation.width, clearanceStation.height, W + 20] as Vec3, yaw: yawAt(mid) };
    })(),
    // mid-height inside the envelope, clear of the main-span label on the deck
    labelAt: plan((clearanceStation.x0 + clearanceStation.x1) / 2, clearanceStation.height * 0.45, 0),
  };

  // world bounds of the unit
  const pts: Vec3[] = [plan(0, 0, -hw), plan(0, 0, hw), plan(totalLength, 0, -hw), plan(totalLength, 0, hw), plan(centre, 0, -hw), plan(centre, 0, hw)];
  for (const p of pylons) {
    pts.push(plan(p.x, E + p.heightAboveDeck, 0));
    for (const sw of [...p.sweeps, ...p.caps]) for (let i = 0; i < sw.positions.length; i += 3) pts.push([sw.positions[i], sw.positions[i + 1], sw.positions[i + 2]]);
  }
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const p of pts)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], p[k]);
      max[k] = Math.max(max[k], p[k]);
    }
  min[1] = 0;

  return {
    spans: spans.map((length, i) => ({ x0: edges[i], x1: edges[i + 1], length, main: main[i] })),
    totalLength,
    mainSpan,
    deckElevation: E,
    deckDepth,
    deckWidth: W,
    deckSegments,
    deckPieces,
    deckMeshes,
    deckMembers: deckMembers.map((mb) => ({ ...mb, a: mapV(mb.a), b: mapV(mb.b) })),
    deckSection: truss ? 'truss' : 'box',
    travellers: travellerBoxes.map(mapBox),
    approaches,
    banks,
    pylons,
    piers,
    auxiliaryPiers,
    deckY,
    colours: {
      pylon: m.pylon_colour,
      stay: m.stay_colour,
      backStay: m.back_stay_colour ?? m.stay_colour,
      deck: m.deck_colour,
      ...(m.colour_mode === 'vivid' ? { vivid: true as const } : {}),
    },
    cables,
    cablesPerSide: perSide,
    planes,
    pattern,
    shape: m.pylon_shape,
    extradosed,
    status,
    deckType: m.deck_type,
    planRadius: R,
    plan,
    yawAt,
    clearance,
    bounds: { min, max },
    derived,
    warnings,
  };
}

/**
 * Where to draw a pylon's height dimension (station coordinates, before the plan mapping):
 * at the station of the pylon's actual tip (custom pylons lean or curve away from their base station),
 * offset along the bridge by a small gap so the line never reads as part of the pylon.
 */
export function heightDimension(g: BridgeGeometry, p: Pylon): { x: number; y0: number; y1: number } {
  const E = g.deckElevation;
  let tipX = p.x;
  if (p.custom && p.sweeps.length) {
    let best = -Infinity;
    for (const sw of p.sweeps)
      for (let i = 0; i < sw.positions.length; i += 3)
        if (sw.positions[i + 1] > best) {
          best = sw.positions[i + 1];
          tipX = sw.positions[i];
        }
    // sweeps are already mapped to world; for a curved plan the x difference is negligible at a pylon
  }
  const gap = Math.max(8, g.deckWidth * 0.4);
  return { x: tipX + gap, y0: p.labelRef === 'total' ? 0 : E, y1: E + p.heightAboveDeck };
}

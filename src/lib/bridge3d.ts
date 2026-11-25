/**
 * Pure geometry for the schematic 3D bridge model (docs/design-3d.md §2–§3). No Three.js here,
 * so it is unit-testable.
 *
 * Coordinates are metres, no vertical exaggeration: x along the bridge (0 = start of the first
 * stay-cabled span), y up (water surface at y = 0), z across (0 = centreline).
 */
import type { CablePattern, Model3D, PylonShape, Status } from '../types';

export type Vec3 = [number, number, number];

/** A straight structural member, rendered as a box from a to b with a square section. */
export interface Member {
  a: Vec3;
  b: Vec3;
  size: number;
}

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
}

export interface Cable {
  pylon: number;
  side: -1 | 1;
  plane: number;
  top: Vec3;
  deck: Vec3;
}

export interface Box {
  /** centre */
  c: Vec3;
  /** full size along x, y, z */
  s: Vec3;
}

export interface Slab {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface BridgeGeometry {
  spans: SpanSeg[];
  totalLength: number;
  mainSpan: number;
  deckElevation: number;
  deckDepth: number;
  deckWidth: number;
  /** built deck pieces along x (a single piece when complete) */
  deckSegments: { x0: number; x1: number }[];
  /** form travellers at cantilever tips (under construction only) */
  travellers: Box[];
  approaches: Slab[];
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
      const ms = [m(P(0, -hw), P(yt, 0)), m(P(0, hw), P(yt, 0))];
      if (shape === 'A') {
        const z = lerpZ(under, 0, hw, yt, 0);
        ms.push(m(P(under, -z), P(under, z), leg * 0.8));
      }
      return { members: ms, anchorZ: (pl, y) => sideZ(pl, Math.max(leg * 0.4, lerpZ(y, 0, hw, yt, 0))) };
    }
    case 'inverted_Y': {
      const yj = yd + 0.6 * (yt - yd); // legs meet at 60% of the height above deck
      return {
        members: [m(P(0, -hw), P(yj, 0)), m(P(0, hw), P(yj, 0)), m(P(yj, 0), P(yt, 0), leg * 1.2)],
        anchorZ: (pl, y) => (y >= yj ? sideZ(pl, leg * 0.4) : sideZ(pl, lerpZ(y, 0, hw, yj, 0))),
      };
    }
    case 'diamond': {
      // splay out from the footing to the deck edges, then converge to the apex
      const ms = [m(P(0, 0), P(yd, -hw)), m(P(0, 0), P(yd, hw)), m(P(yd, -hw), P(yt, 0)), m(P(yd, hw), P(yt, 0))];
      return { members: ms, anchorZ: (pl, y) => sideZ(pl, Math.max(leg * 0.4, lerpZ(y, yd, hw, yt, 0))) };
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
export function buildBridgeGeometry(m: Model3D, status: Status = 'completed'): BridgeGeometry | null {
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

  const E = deckElevation(mainSpan);
  const deckDepth = clamp(mainSpan / 120, 2, 4.5) * (extradosed ? 1.8 : 1);
  const isPylonSupport = new Set(supports);

  // reach of the stays on each side of a support (§2)
  const reach = (support: number, side: -1 | 1) => {
    const spanIdx = side < 0 ? support : support + 1;
    const neighbour = side < 0 ? support - 1 : support + 1;
    return isPylonSupport.has(neighbour) ? spans[spanIdx] / 2 : 0.95 * spans[spanIdx];
  };

  const pylons: Pylon[] = supports.map((support, i) => {
    const adjMain = Math.max(main[support] ? spans[support] : 0, main[support + 1] ? spans[support + 1] : 0) || mainSpan;
    const given = m.pylon_heights_m[i] ?? m.pylon_heights_m[m.pylon_heights_m.length - 1];
    let above: number;
    if (given === undefined) {
      above = (extradosed ? 0.1 : 0.22) * adjMain;
      if (!derived.includes('pylon height')) derived.push('pylon height');
    } else if (m.pylon_height_ref === 'total') above = Math.max(given - E, 0.3 * given);
    else above = given;
    const x = edges[support + 1];
    const shape = buildPylon(m.pylon_shape, x, hw, E, E + above, planes);
    return {
      index: i,
      x,
      support,
      heightAboveDeck: above,
      labelHeight: given !== undefined && m.pylon_height_ref === 'total' ? given : above,
      labelRef: given !== undefined && m.pylon_height_ref === 'total' ? 'total' : 'above_deck',
      members: shape.members,
    };
  });
  const shapes = pylons.map((p) => buildPylon(m.pylon_shape, p.x, hw, E, E + p.heightAboveDeck, planes));

  // piers at abutments and non-pylon supports: box columns 0.6 × deck width across
  const pierT = clamp(mainSpan / 100, 2, 5);
  const piers: Box[] = [];
  for (let s = -1; s < spans.length; s++) {
    if (isPylonSupport.has(s)) continue;
    const h = E - deckDepth;
    piers.push({ c: [edges[s + 1], h / 2, 0], s: [pierT, h, 0.6 * W] });
  }

  // deck: complete, or balanced cantilevers to 60% of each reach (under construction)
  let deckSegments: { x0: number; x1: number }[] = [{ x0: 0, x1: totalLength }];
  const travellers: Box[] = [];
  if (status === 'under_construction') {
    deckSegments = pylons.map((p) => ({
      x0: p.x - 0.6 * reach(p.support, -1),
      x1: p.x + 0.6 * reach(p.support, 1),
    }));
    for (const seg of deckSegments)
      for (const x of [seg.x0, seg.x1]) travellers.push({ c: [x, E + 2.5, 0], s: [6, 5, Math.max(4, W * 0.9)] });
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
  const deckZ = (plane: number) => (planes === 1 ? 0 : plane === 0 ? -hw : hw);
  const cables: Cable[] = [];
  pylons.forEach((p, pi) => {
    const yd = E;
    const H = p.heightAboveDeck;
    const [lo, hi] =
      pattern === 'fan' ? [0.97, 0.97] : pattern === 'semi_fan' ? [0.75, 0.97] : [0.3, 0.97];
    for (const side of [-1, 1] as const) {
      const r = reach(p.support, side);
      const [f0, f1] = extradosed ? [0.15, 0.5] : [0.08, 1];
      for (let plane = 0; plane < planes; plane++) {
        for (let j = 0; j < perSide; j++) {
          const t = perSide === 1 ? 1 : j / (perSide - 1); // 0 = nearest the pylon
          const x = p.x + side * r * (f0 + (f1 - f0) * t);
          if (!onBuiltDeck(x)) continue;
          // outer stays anchor highest (no crossing); fan: all at one point
          const y = yd + H * (lo + (hi - lo) * t);
          cables.push({ pylon: pi, side, plane, top: [p.x, y, shapes[pi].anchorZ(plane, y)], deck: [x, yd, deckZ(plane)] });
        }
      }
    }
  });

  // approaches + banks (§2): approach slab slopes from deck level down to bank height
  const A = m.approach_length_m ?? 0.3 * totalLength;
  if (m.approach_length_m === undefined) derived.push('approach length');
  const bankH = 4;
  const approaches: Slab[] = [
    { x0: -A, x1: 0, y0: bankH, y1: E },
    { x0: totalLength, x1: totalLength + A, y0: E, y1: bankH },
  ];
  const bankL = A + 200;
  const banks: Box[] = [
    { c: [-bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] },
    { c: [totalLength + bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] },
  ];

  const top = Math.max(...pylons.map((p) => E + p.heightAboveDeck));
  return {
    spans: spans.map((length, i) => ({ x0: edges[i], x1: edges[i + 1], length, main: main[i] })),
    totalLength,
    mainSpan,
    deckElevation: E,
    deckDepth,
    deckWidth: W,
    deckSegments,
    travellers,
    approaches,
    banks,
    pylons,
    piers,
    cables,
    cablesPerSide: perSide,
    planes,
    pattern,
    shape: m.pylon_shape,
    extradosed,
    status,
    deckType: m.deck_type,
    bounds: { min: [0, 0, -hw], max: [totalLength, top, hw] },
    derived,
    warnings,
  };
}

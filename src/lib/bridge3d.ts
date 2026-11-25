/**
 * Pure geometry for the schematic 3D bridge model (docs/design-3d.md §2–§3). No Three.js here,
 * so it is unit-testable.
 *
 * Coordinates are metres, no vertical exaggeration: x along the bridge (0 = start of the first
 * stay-cabled span), y up (water surface at y = 0), z across (0 = centreline).
 */
import type { CablePattern, Model3D, NavClearance, PylonShape, Status } from '../types';
import { arcAtY, catmullRom, pointAt, polyline, sweepRect, type SweepMesh } from './sweep';

export type { SweepMesh };

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
  /** swept meshes for custom (pylon_custom) pylons */
  sweeps: SweepMesh[];
  custom: boolean;
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

  const deckDepth = clamp(mainSpan / 120, 2, 4.5) * (extradosed ? 1.8 : 1);
  // the navigation clearance (if given) must fit under the deck
  const navH = opts.navClearance?.height_m;
  const E = Math.max(deckElevation(mainSpan), navH ? navH + deckDepth + 1 : 0);
  const isPylonSupport = new Set(supports);

  // reach of the stays on each side of a support (§2)
  const reach = (support: number, side: -1 | 1) => {
    const spanIdx = side < 0 ? support : support + 1;
    const neighbour = side < 0 ? support - 1 : support + 1;
    return isPylonSupport.has(neighbour) ? spans[spanIdx] / 2 : 0.95 * spans[spanIdx];
  };

  // ---- custom pylons (pylon_custom): swept legs in the pylon-local frame ----
  const custom = m.pylon_custom;
  const centre = totalLength / 2;
  /** +1 when local +x (toward the main span) points along +station */
  const towardMain = (support: number, x: number) =>
    main[support + 1] && !main[support] ? 1 : main[support] && !main[support + 1] ? -1 : x <= centre ? 1 : -1;
  const customLegs = (support: number, x: number, index: number) => {
    if (!custom) return null;
    const dir = custom.mirror_for_other_pylons === false && index > 0 ? towardMain(supports[0], edges[supports[0] + 1]) : towardMain(support, x);
    const toStation = ([lx, ly, lz]: Vec3): Vec3 => [x + dir * lx, E + ly, lz];
    return custom.legs.map((leg) => {
      const pl = polyline(catmullRom(leg.centerline.map(toStation), 12));
      const mesh = sweepRect(
        pl,
        leg.width_base_m,
        leg.width_top_m,
        leg.depth_base_m ?? leg.width_base_m,
        leg.depth_top_m ?? leg.width_top_m,
      );
      return { pl, mesh, w0: leg.width_base_m, w1: leg.width_top_m };
    });
  };

  const pylons: Pylon[] = supports.map((support, i) => {
    const x = edges[support + 1];
    const legs = customLegs(support, x, i);
    if (legs) {
      const tip = Math.max(...legs.flatMap((l) => l.pl.pts.map((p) => p[1]))) - E;
      // crossbeams between consecutive legs at the given heights (local y above deck)
      const members: Member[] = [];
      for (const y of custom!.crossbeams_y_m ?? [])
        for (let k = 0; k + 1 < legs.length; k++) {
          const a = pointAt(legs[k].pl, arcAtY(legs[k].pl, E + y));
          const b = pointAt(legs[k + 1].pl, arcAtY(legs[k + 1].pl, E + y));
          members.push({ a, b, size: Math.max(1.5, legs[k].w1 * 0.8) });
        }
      return { index: i, x, support, heightAboveDeck: tip, labelHeight: tip, labelRef: 'above_deck' as const, members, sweeps: legs.map((l) => l.mesh), custom: true };
    }
    const adjMain = Math.max(main[support] ? spans[support] : 0, main[support + 1] ? spans[support + 1] : 0) || mainSpan;
    const given = m.pylon_heights_m[i] ?? m.pylon_heights_m[m.pylon_heights_m.length - 1];
    let above: number;
    if (given === undefined) {
      above = (extradosed ? 0.1 : 0.22) * adjMain;
      if (!derived.includes('pylon height')) derived.push('pylon height');
    } else if (m.pylon_height_ref === 'total') above = Math.max(given - E, 0.3 * given);
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
    };
  });
  const shapes = pylons.map((p) => buildPylon(m.pylon_shape, p.x, hw, E, E + p.heightAboveDeck, planes));
  const legCurves = pylons.map((p, i) => customLegs(p.support, p.x, i));

  // piers at abutments and non-pylon supports: box columns 0.6 × deck width across
  const pierT = clamp(mainSpan / 100, 2, 5);
  const pierBoxes: Box[] = [];
  for (let s = -1; s < spans.length; s++) {
    if (isPylonSupport.has(s)) continue;
    const h = E - deckDepth;
    pierBoxes.push({ c: [edges[s + 1], h / 2, 0], s: [pierT, h, 0.6 * W] });
  }

  // deck: complete, or balanced cantilevers to 60% of each reach (under construction)
  let deckSegments: { x0: number; x1: number }[] = [{ x0: 0, x1: totalLength }];
  const travellerBoxes: Box[] = [];
  if (status === 'under_construction') {
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
  const deckZ = (plane: number) => (planes === 1 ? 0 : plane === 0 ? -hw : hw);

  /** pylon-side anchor for a custom pylon: distributed by arc length along the leg's anchor zone */
  const customAnchor = (pi: number, plane: number, t: number): Vec3 => {
    const legs = legCurves[pi]!;
    const zones = custom!.anchor_zone;
    let zone = zones[0];
    let zOffset = 0;
    if (planes === 2) {
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
    const pl = legs[zone.leg].pl;
    const s0 = arcAtY(pl, E + zone.y_from_m);
    const s1 = arcAtY(pl, E + zone.y_to_m);
    const p = pointAt(pl, s0 + (s1 - s0) * t);
    return [p[0], p[1], p[2] + zOffset];
  };

  const cablesStation: Cable[] = [];
  pylons.forEach((p, pi) => {
    const yd = E;
    const H = p.heightAboveDeck;
    const [lo, hi] = pattern === 'fan' ? [0.97, 0.97] : pattern === 'semi_fan' ? [0.75, 0.97] : [0.3, 0.97];
    for (const side of [-1, 1] as const) {
      const r = reach(p.support, side);
      const [f0, f1] = extradosed ? [0.15, 0.5] : [0.08, 1];
      for (let plane = 0; plane < planes; plane++) {
        for (let j = 0; j < perSide; j++) {
          const t = perSide === 1 ? 1 : j / (perSide - 1); // 0 = nearest the pylon
          const x = p.x + side * r * (f0 + (f1 - f0) * t);
          if (!onBuiltDeck(x)) continue;
          // outer stays anchor highest (no crossing); fan: all at one point
          const top: Vec3 = p.custom
            ? customAnchor(pi, plane, t)
            : (() => {
                const y = yd + H * (lo + (hi - lo) * t);
                return [p.x, y, shapes[pi].anchorZ(plane, y)] as Vec3;
              })();
          cablesStation.push({ pylon: pi, side, plane, top, deck: [x, yd, deckZ(plane)] });
        }
      }
    }
  });

  // approaches + banks: shortened for context (the stayed unit is the subject)
  const A = Math.min(m.approach_length_m ?? 0.15 * totalLength, 0.2 * totalLength);
  if (m.approach_length_m === undefined) derived.push('approach length');
  const bankH = 4;
  const bankL = A + 80;

  // navigation clearance envelope under the main span(s), centred on the widest main span
  let clearanceStation: Omit<Clearance, 'box' | 'labelAt'> | undefined;
  const nav = opts.navClearance;
  if (nav && (nav.height_m || nav.width_m)) {
    const mi = spans.reduce((best, s, i) => (main[i] && s > (main[best] ? spans[best] : -1) ? i : best), main.indexOf(true));
    const c = (edges[mi] + edges[mi + 1]) / 2;
    const width = Math.min(nav.width_m ?? 0.6 * spans[mi], spans[mi] * 0.95);
    const height = nav.height_m ?? E - deckDepth - 1;
    clearanceStation = { x0: c - width / 2, x1: c + width / 2, height, width, givenHeight: nav.height_m, givenWidth: nav.width_m };
  }

  // ---- plan curvature: map straight station coordinates onto a horizontal arc ----
  const R = m.deck_plan_radius_m && m.deck_plan_radius_m > totalLength / Math.PI ? m.deck_plan_radius_m : undefined;
  const plan = (x: number, y: number, z: number): Vec3 => {
    if (!R) return [x, y, z];
    const th = (x - centre) / R;
    return [centre + (R - z) * Math.sin(th), y, R - (R - z) * Math.cos(th)];
  };
  const yawAt = (x: number) => (R ? -(x - centre) / R : 0);
  const mapV = (v: Vec3) => plan(v[0], v[1], v[2]);
  const mapBox = (b: Box): Box => ({ ...b, c: mapV(b.c), yaw: (b.yaw ?? 0) + yawAt(b.c[0]) });

  const deckPieces: Box[] = [];
  const pieceLen = R ? 20 : Infinity;
  for (const seg of deckSegments) {
    const n = Math.max(1, Math.ceil((seg.x1 - seg.x0) / pieceLen));
    const L = (seg.x1 - seg.x0) / n;
    for (let k = 0; k < n; k++) {
      const x = seg.x0 + (k + 0.5) * L;
      // a hair longer than the arc piece so curved joints close
      deckPieces.push(mapBox({ c: [x, E - deckDepth / 2, 0], s: [L + (R ? 0.3 : 0), deckDepth, W] }));
    }
  }
  const pitch = Math.atan2(E - bankH, A);
  const approaches: Box[] = [
    mapBox({ c: [-A / 2, (E + bankH) / 2 - deckDepth / 2, 0], s: [Math.hypot(A, E - bankH), deckDepth, W], pitch }),
    mapBox({ c: [totalLength + A / 2, (E + bankH) / 2 - deckDepth / 2, 0], s: [Math.hypot(A, E - bankH), deckDepth, W], pitch: -pitch }),
  ];
  const banks: Box[] = [
    mapBox({ c: [-bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] }),
    mapBox({ c: [totalLength + bankL / 2, bankH / 2, 0], s: [bankL, bankH, 3 * W] }),
  ];
  for (const p of pylons) {
    p.members = p.members.map((mb) => ({ ...mb, a: mapV(mb.a), b: mapV(mb.b) }));
    p.sweeps = p.sweeps.map((sw) => {
      const pos = sw.positions.slice();
      for (let i = 0; i < pos.length; i += 3) {
        const v = plan(pos[i], pos[i + 1], pos[i + 2]);
        pos[i] = v[0];
        pos[i + 1] = v[1];
        pos[i + 2] = v[2];
      }
      return { positions: pos, indices: sw.indices };
    });
  }
  const cables = cablesStation.map((c) => ({ ...c, top: mapV(c.top), deck: mapV(c.deck) }));
  const clearance: Clearance | undefined = clearanceStation && {
    ...clearanceStation,
    box: mapBox({
      c: [(clearanceStation.x0 + clearanceStation.x1) / 2, clearanceStation.height / 2, 0],
      s: [clearanceStation.width, clearanceStation.height, W + 20],
    }),
    // mid-height inside the envelope, clear of the main-span label on the deck
    labelAt: plan((clearanceStation.x0 + clearanceStation.x1) / 2, clearanceStation.height * 0.45, 0),
  };

  // world bounds of the unit
  const pts: Vec3[] = [plan(0, 0, -hw), plan(0, 0, hw), plan(totalLength, 0, -hw), plan(totalLength, 0, hw), plan(centre, 0, -hw), plan(centre, 0, hw)];
  for (const p of pylons) {
    pts.push(plan(p.x, E + p.heightAboveDeck, 0));
    for (const sw of p.sweeps) for (let i = 0; i < sw.positions.length; i += 3) pts.push([sw.positions[i], sw.positions[i + 1], sw.positions[i + 2]]);
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
    travellers: travellerBoxes.map(mapBox),
    approaches,
    banks,
    pylons,
    piers: pierBoxes.map(mapBox),
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

import { describe, expect, it } from 'vitest';
import type { Model3D } from '../types';
import { buildBridgeGeometry, choosePylonSupports, deckElevation, defaultCablesPerSide } from './bridge3d';

const base: Model3D = {
  spans_m: [150, 550, 150],
  pylon_shape: 'H',
  pylon_heights_m: [125, 125],
  pylon_height_ref: 'above_deck',
  cable_planes: 2,
  cable_pattern: 'fan',
  cables_per_side: 10,
  deck_width_m: 26,
  confidence: 'estimated',
};
const build = (m: Partial<Model3D>, status?: Parameters<typeof buildBridgeGeometry>[1]) => {
  const g = buildBridgeGeometry({ ...base, ...m }, status);
  if (!g) throw new Error('null geometry');
  return g;
};

describe('choosePylonSupports', () => {
  it('(a) every interior support when counts match', () => {
    expect(choosePylonSupports([150, 300, 300, 300, 300, 150], 5)).toEqual([0, 1, 2, 3, 4]);
    expect(choosePylonSupports([195, 195, 195, 195], 3)).toEqual([0, 1, 2]);
  });
  it('(b) ends of the largest spans', () => {
    expect(choosePylonSupports([40, 150, 550, 150, 40], 2)).toEqual([1, 2]);
    expect(choosePylonSupports([200, 100, 50], 1)).toEqual([0]);
    expect(choosePylonSupports([60, 120, 200], 1)).toEqual([1]);
  });
  it('(c) falls back to ranking supports, with a warning', () => {
    const warnings: string[] = [];
    expect(choosePylonSupports([100, 300, 100], 1, (w) => warnings.push(w))).toEqual([0]);
    expect(warnings).toHaveLength(1);
  });
});

describe('buildBridgeGeometry', () => {
  it('H / fan / 2 planes: counts, main span, elevation, symmetry', () => {
    const g = build({});
    expect(g.totalLength).toBe(850);
    expect(g.mainSpan).toBe(550);
    expect(g.deckElevation).toBe(45); // clamp(55, 12, 45)
    expect(g.pylons.map((p) => p.x)).toEqual([150, 700]);
    expect(g.spans.map((s) => s.main)).toEqual([false, true, false]);
    expect(g.cables).toHaveLength(2 * 2 * 2 * 10);
    expect(g.pylons[0].members).toHaveLength(4); // 2 legs + 2 cross-beams
    // H legs and 2-plane cables sit at the deck edges
    expect(g.cables.every((c) => Math.abs(c.deck[2]) === 13 && Math.abs(c.top[2]) === 13)).toBe(true);
    // fan: one anchor point per pylon/plane
    expect(new Set(g.cables.map((c) => c.top[1])).size).toBe(1);
    // mirror symmetry about mid-bridge
    const key = (x: number, y: number, z: number) => `${x.toFixed(3)}|${y.toFixed(3)}|${z}`;
    const set = new Set(g.cables.map((c) => key(c.deck[0], c.top[1], c.deck[2])));
    for (const c of g.cables) expect(set.has(key(g.totalLength - c.deck[0], c.top[1], c.deck[2]))).toBe(true);
  });

  it('deck anchors stay inside the adjacent span, on the right side, before mid-span between pylons', () => {
    const cases: Partial<Model3D>[] = [
      {},
      { cable_pattern: 'semi_fan', pylon_shape: 'inverted_Y', spans_m: [40, 150, 550, 150, 40] },
      { spans_m: [150, 300, 300, 300, 300, 150], pylon_heights_m: [110, 110, 110, 110, 110], pylon_shape: 'diamond' },
      { spans_m: [195, 195, 195, 195], pylon_heights_m: [55, 55, 55], cable_pattern: 'harp', cables_per_side: undefined },
      { spans_m: [100, 200, 100], pylon_heights_m: [], extradosed: true, cables_per_side: undefined },
      { spans_m: [200, 100], pylon_heights_m: [113], pylon_shape: 'single', cable_planes: 1 },
    ];
    for (const m of cases) {
      const g = build(m);
      expect(g.cables.length).toBeGreaterThan(0);
      for (const c of g.cables) {
        const p = g.pylons[c.pylon];
        const span = g.spans[c.side < 0 ? p.support : p.support + 1];
        expect(c.deck[0]).toBeGreaterThanOrEqual(span.x0);
        expect(c.deck[0]).toBeLessThanOrEqual(span.x1);
        expect(Math.sign(c.deck[0] - p.x)).toBe(c.side);
        const neighbourIsPylon = g.pylons.some((q) => q.support === p.support + c.side);
        if (neighbourIsPylon) expect(Math.abs(c.deck[0] - p.x)).toBeLessThanOrEqual(span.length / 2 + 1e-9);
        expect(c.deck[1]).toBe(g.deckElevation);
        expect(Math.abs(c.deck[2])).toBeLessThanOrEqual(g.deckWidth / 2);
        expect(c.top[1]).toBeGreaterThan(g.deckElevation);
        expect(c.top[1]).toBeLessThanOrEqual(g.deckElevation + p.heightAboveDeck);
      }
    }
  });

  it('single pylon, 1 plane, asymmetric: centreline cables, longer span is main', () => {
    const g = build({ spans_m: [200, 100], pylon_heights_m: [113], pylon_height_ref: 'total', pylon_shape: 'single', cable_planes: 1 });
    expect(g.pylons.map((p) => p.x)).toEqual([200]);
    expect(g.spans.map((s) => s.main)).toEqual([true, false]);
    expect(g.cables.every((c) => c.deck[2] === 0 && c.top[2] === 0)).toBe(true);
    expect(g.cables).toHaveLength(2 * 10);
    expect(g.pylons[0].heightAboveDeck).toBeCloseTo(113 - 20); // deck elevation clamp(20,12,45)
    expect(g.pylons[0].labelRef).toBe('total');
  });

  it('multi-pylon: Nhật Tân 5 pylons, Thượng Cát 3 pylons', () => {
    const nt = build({ spans_m: [150, 300, 300, 300, 300, 150], pylon_heights_m: [110, 110, 110, 110, 110], pylon_shape: 'diamond' });
    expect(nt.pylons).toHaveLength(5);
    expect(nt.spans.filter((s) => s.main)).toHaveLength(4);
    const tc = build({ spans_m: [195, 195, 195, 195], pylon_heights_m: [55, 55, 55], cables_per_side: undefined });
    expect(tc.pylons.map((p) => p.x)).toEqual([195, 390, 585]);
    expect(tc.cablesPerSide).toBe(8); // round(97.5 / 12)
  });

  it('extradosed: derived low pylons, short stays from 15% to 50% of the reach, deeper deck', () => {
    const g = build({ spans_m: [100, 200, 100], pylon_heights_m: [], extradosed: true, cables_per_side: undefined });
    expect(g.derived).toEqual(expect.arrayContaining(['pylon count', 'pylon height', 'cables per side']));
    expect(g.pylons).toHaveLength(2);
    expect(g.pylons[0].heightAboveDeck).toBeCloseTo(20); // 0.1 × 200
    expect(g.deckDepth).toBeCloseTo(2 * 1.8);
    for (const c of g.cables) {
      const d = Math.abs(c.deck[0] - g.pylons[c.pylon].x);
      expect(d).toBeGreaterThanOrEqual(0.15 * 95 - 1e-9);
      expect(d).toBeLessThanOrEqual(0.5 * 100 + 1e-9);
    }
  });

  it('defaults: pylon height 0.22 × main span; total height converted with the deck elevation', () => {
    expect(build({ pylon_heights_m: [] }).pylons[0].heightAboveDeck).toBeCloseTo(121);
    expect(build({ pylon_heights_m: [175, 175], pylon_height_ref: 'total' }).pylons[0].heightAboveDeck).toBeCloseTo(130);
    expect(deckElevation(100)).toBe(12);
    expect(defaultCablesPerSide(275)).toBe(23);
    expect(defaultCablesPerSide(30)).toBe(6);
    expect(defaultCablesPerSide(1000)).toBe(24);
  });

  it('under construction: cantilevers to 60% of each reach, travellers at tips, cables only on built deck', () => {
    const g = build({}, 'under_construction');
    expect(g.deckSegments).toHaveLength(2);
    expect(g.deckSegments[0].x0).toBeCloseTo(150 - 0.6 * 0.95 * 150);
    expect(g.deckSegments[0].x1).toBeCloseTo(150 + 0.6 * 275);
    expect(g.travellers).toHaveLength(4);
    for (const c of g.cables) expect(g.deckSegments.some((s) => c.deck[0] >= s.x0 && c.deck[0] <= s.x1)).toBe(true);
    expect(g.cables.length).toBeLessThan(80);
  });

  it('every pylon shape reaches the top; unusable data returns null', () => {
    for (const shape of ['H', 'A', 'inverted_Y', 'diamond', 'single', 'inverted_V', 'other'] as const) {
      const g = build({ pylon_shape: shape });
      const top = Math.max(...g.pylons[0].members.flatMap((m) => [m.a[1], m.b[1]]));
      expect(top).toBeCloseTo(g.deckElevation + 125);
    }
    // 'other': portal for 2 planes, single mast for 1 plane
    expect(build({ pylon_shape: 'other' }).pylons[0].members).toHaveLength(6);
    const one = build({ pylon_shape: 'other', cable_planes: 1 });
    expect(one.pylons[0].members.every((m) => m.a[2] === 0 && m.b[2] === 0)).toBe(true);
    expect(buildBridgeGeometry({ ...base, spans_m: [] })).toBeNull();
    expect(buildBridgeGeometry({ ...base, spans_m: [300] })).toBeNull();
  });
});

describe('pylon_custom, plan curve and clearance', () => {
  const baSonLike: Partial<Model3D> = {
    spans_m: [200, 115],
    pylon_heights_m: [113],
    pylon_shape: 'other',
    cable_planes: 1,
    cables_per_side: 8,
    pylon_custom: {
      description: 'single leg curving back, tip bending toward the main span',
      legs: [
        {
          centerline: [
            [0, -20, 0],
            [-10, 30, 0],
            [-8, 80, 0],
            [6, 110, 0],
          ],
          width_base_m: 8,
          width_top_m: 3,
          depth_base_m: 6,
          depth_top_m: 2.5,
        },
      ],
      anchor_zone: [{ y_from_m: 45, y_to_m: 105, leg: 0 }],
    },
  };

  it('sweeps a valid, non-degenerate mesh', () => {
    const g = build(baSonLike);
    const sw = g.pylons[0].sweeps[0];
    expect(g.pylons[0].custom).toBe(true);
    expect(sw.positions.length % 3).toBe(0);
    expect(sw.positions.every(Number.isFinite)).toBe(true);
    expect(Math.max(...sw.indices)).toBeLessThan(sw.positions.length / 3);
    const v = (i: number) => sw.positions.slice(i * 3, i * 3 + 3);
    let degenerate = 0;
    for (let i = 0; i < sw.indices.length; i += 3) {
      const [a, b, c] = [v(sw.indices[i]), v(sw.indices[i + 1]), v(sw.indices[i + 2])];
      const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const cr = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
      if (Math.hypot(...cr) / 2 < 1e-6) degenerate++;
    }
    expect(degenerate).toBe(0);
    // tapers: the first ring is wider than the last
    const ring = (i: number) => Math.hypot(v(i * 4)[2] - v(i * 4 + 2)[2], v(i * 4)[0] - v(i * 4 + 2)[0]);
    expect(ring(0)).toBeGreaterThan(ring(sw.positions.length / 12 - 1));
    // tip height comes from the centerline (local y 110 above deck)
    expect(g.pylons[0].heightAboveDeck).toBeCloseTo(110, 0);
  });

  it('stays attach along the curve inside the anchor zone, not on a vertical line, with stays on both sides', () => {
    const g = build(baSonLike);
    const sw = g.pylons[0].sweeps[0];
    // centre of each ring = mean of its 4 corners; anchors must be within a ring's half-size of the swept centreline
    const centres: number[][] = [];
    for (let i = 0; i < sw.positions.length; i += 12) {
      const c = [0, 0, 0];
      for (let k = 0; k < 4; k++) for (let a = 0; a < 3; a++) c[a] += sw.positions[i + k * 3 + a] / 4;
      centres.push(c);
    }
    for (const c of g.cables) {
      const d = Math.min(...centres.map((p) => Math.hypot(p[0] - c.top[0], p[1] - c.top[1], p[2] - c.top[2])));
      expect(d).toBeLessThan(3);
      expect(c.top[1] - g.deckElevation).toBeGreaterThanOrEqual(45 - 1e-6);
      expect(c.top[1] - g.deckElevation).toBeLessThanOrEqual(105 + 1e-6);
    }
    expect(new Set(g.cables.map((c) => c.top[0].toFixed(2))).size).toBeGreaterThan(3); // follows the curve in x
    expect(g.cables.filter((c) => c.side < 0)).toHaveLength(8);
    expect(g.cables.filter((c) => c.side > 0)).toHaveLength(8);
    // main span is on the left (spans[0]); local +x points to it, so the tip bends toward smaller x
    expect(g.pylons[0].x).toBe(200);
  });

  it('mirror_for_other_pylons: pylons face their own main span', () => {
    const g = build({
      ...baSonLike,
      spans_m: [150, 550, 150],
      cable_planes: 2,
      pylon_heights_m: [125, 125],
      pylon_custom: { ...baSonLike.pylon_custom!, mirror_for_other_pylons: true },
    });
    const meanX = (i: number) => {
      const p = g.pylons[i].sweeps[0].positions;
      let s = 0;
      for (let k = 0; k < p.length; k += 3) s += p[k];
      return s / (p.length / 3) - g.pylons[i].x;
    };
    // the leg leans back (away from the main span): left pylon leans to -x, right pylon to +x
    expect(meanX(0)).toBeLessThan(0);
    expect(meanX(1)).toBeGreaterThan(0);
    expect(meanX(0)).toBeCloseTo(-meanX(1), 6);
  });

  it('a horizontally curved deck keeps the arc length and puts deck anchors on the curve', () => {
    const R = 800;
    const g = build({ deck_plan_radius_m: R });
    const arc = g.deckPieces.reduce((s, p) => s + p.s[0] - 0.3, 0);
    expect(arc).toBeCloseTo(g.totalLength, 6);
    // all deck pieces lie within the chord span and on the circle
    const cx = g.totalLength / 2;
    for (const p of g.deckPieces) {
      expect(p.c[0]).toBeGreaterThanOrEqual(-1e-9);
      expect(p.c[0]).toBeLessThanOrEqual(g.totalLength + 1e-9);
      expect(Math.hypot(p.c[0] - cx, p.c[2] - R)).toBeCloseTo(R, 6);
    }
    for (const c of g.cables) {
      const r = Math.hypot(c.deck[0] - cx, c.deck[2] - R);
      expect(Math.abs(r - R)).toBeLessThanOrEqual(g.deckWidth / 2 + 1e-6);
    }
    expect(g.bounds.max[2] - g.bounds.min[2]).toBeGreaterThan(g.deckWidth); // visibly curved
  });

  it('navigation clearance: envelope under the main span, deck raised above it', () => {
    const g = buildBridgeGeometry({ ...base }, 'completed', { navClearance: { height_m: 50, width_m: 250 } })!;
    expect(g.clearance).toBeDefined();
    expect(g.clearance!.width).toBe(250);
    expect(g.clearance!.height).toBe(50);
    expect(g.clearance!.x0).toBeCloseTo(425 - 125);
    expect(g.deckElevation).toBeGreaterThanOrEqual(50 + g.deckDepth);
    expect(buildBridgeGeometry(base)!.clearance).toBeUndefined();
    // width only: drawn under the deck, height derived
    const w = buildBridgeGeometry({ ...base }, 'completed', { navClearance: { width_m: 300 } })!;
    expect(w.clearance!.givenHeight).toBeUndefined();
    expect(w.clearance!.height).toBeLessThan(w.deckElevation);
  });
});

describe('choosePylonSupports: single-pylon bridges', () => {
  it('puts one pylon between main and back span (Trần Thị Lý 230+120, Ba Son 200+115)', () => {
    expect(choosePylonSupports([230, 120], 1)).toEqual([0]);
    expect(choosePylonSupports([200, 115], 1)).toEqual([0]);
  });
  it('puts two pylons at the ends of the main span when approach spans are listed', () => {
    expect(choosePylonSupports([40, 40, 150, 550, 150, 40, 40], 2)).toEqual([2, 3]);
  });
});

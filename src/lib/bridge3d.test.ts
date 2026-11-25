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

import { describe, expect, it } from 'vitest';
import type { Model3D } from '../types';
import { buildBridgeGeometry, choosePylonSupports, deckElevation, defaultCablesPerSide, pileCapMesh, stayLightness } from './bridge3d';

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

  it('deck anchors stay between the pylon and the next pylon / unit end, before mid-span between pylons', () => {
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
        expect(Math.sign(c.deck[0] - p.x)).toBe(c.side);
        // stays stop at the unit ends (they may cross auxiliary piers on a back span)
        expect(c.deck[0]).toBeGreaterThanOrEqual(0);
        expect(c.deck[0]).toBeLessThanOrEqual(g.totalLength);
        const neighbourIsPylon = g.pylons.some((q) => q.support === p.support + c.side);
        if (neighbourIsPylon) {
          expect(c.deck[0]).toBeGreaterThanOrEqual(span.x0);
          expect(c.deck[0]).toBeLessThanOrEqual(span.x1);
          expect(Math.abs(c.deck[0] - p.x)).toBeLessThanOrEqual(span.length / 2 + 1e-9);
        }
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

describe('pylon feet', () => {
  it('inverted_Y and diamond legs converge toward the footing and pass outside the deck edges', () => {
    for (const shape of ['inverted_Y', 'diamond'] as const) {
      const g = build({ pylon_shape: shape });
      const E = g.deckElevation;
      const legs = g.pylons[0].members.filter((mb) => mb.a[1] === 0); // members starting at the footing
      expect(legs.length).toBe(2);
      for (const mb of legs) {
        expect(mb.b[1]).toBeCloseTo(E); // lower leg ends at deck level
        expect(Math.abs(mb.a[2])).toBeLessThan(Math.abs(mb.b[2])); // narrower at the footing
        expect(Math.abs(mb.b[2])).toBeGreaterThan(g.deckWidth / 2); // just outside the deck edge
      }
    }
  });
  it('A legs pass outside the deck edges at deck level', () => {
    const g = build({ pylon_shape: 'A' });
    const E = g.deckElevation;
    const [l] = g.pylons[0].members;
    const zAtDeck = l.a[2] + ((l.b[2] - l.a[2]) * (E - l.a[1])) / (l.b[1] - l.a[1]);
    expect(Math.abs(zAtDeck)).toBeGreaterThan(g.deckWidth / 2);
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

describe('phase 6: aux piers, colours, crest, crowns, struts, twist', () => {
  it('auxiliary piers: drawn as piers; back-span stays run to the unit end and snap onto them', () => {
    const g = build({ spans_m: [125, 270, 125], auxiliary_piers_m: [60, 460], cables_per_side: 12 });
    expect(g.auxiliaryPiers).toEqual([60, 460]);
    const pierX = g.piers.map((p) => p.c[0]).sort((a, b) => a - b);
    expect(pierX).toEqual([0, 60, 460, 520]);
    const back = g.cables.filter((c) => c.back);
    expect(back.length).toBeGreaterThan(0);
    // back-stays reach past the auxiliary pier toward the end
    expect(Math.min(...back.map((c) => c.deck[0]))).toBeLessThan(60);
    // none lands within 4 m of a pier without sitting exactly on it
    for (const c of back) for (const a of g.auxiliaryPiers) {
      const d = Math.abs(c.deck[0] - a);
      expect(d === 0 || d >= 4 - 1e-9).toBe(true);
    }
    // interior supports without pylons count as auxiliary piers too (Cần Thơ 40 + 40 end spans)
    const ct = build({ spans_m: [40, 40, 150, 550, 150, 40, 40] });
    expect(ct.auxiliaryPiers).toEqual([40, 80, 930, 970]);
    expect(Math.min(...ct.cables.map((c) => c.deck[0]))).toBeLessThan(40);
  });

  it('back flag marks stays toward the unit end, not the main span', () => {
    const g = build({ spans_m: [230, 120], pylon_heights_m: [120], pylon_shape: 'single', cable_planes: 1 });
    expect(g.cables.filter((c) => c.back).every((c) => c.side === 1)).toBe(true);
    expect(g.cables.filter((c) => !c.back).every((c) => c.side === -1)).toBe(true);
    expect(build({}).cables.filter((c) => c.back).every((c) => c.deck[0] < 150 || c.deck[0] > 700)).toBe(true);
  });

  it('colours pass through to the geometry; back-stays default to the stay colour', () => {
    const g = build({ pylon_colour: 'yellow', stay_colour: 'white', back_stay_colour: 'red', deck_colour: '#aa3322' });
    expect(g.colours).toEqual({ pylon: 'yellow', stay: 'white', backStay: 'red', deck: '#aa3322' });
    expect(build({ stay_colour: 'orange' }).colours.backStay).toBe('orange');
  });

  it('deck crest: parabolic rise at mid-unit, zero at the ends; stays and pylons follow', () => {
    const flat = build({});
    const g = build({ deck_crest_m: 6 });
    expect(g.deckY(0)).toBeCloseTo(g.deckElevation);
    expect(g.deckY(g.totalLength / 2)).toBeCloseTo(g.deckElevation + 6);
    expect(g.deckY(150)).toBeCloseTo(g.deckElevation + 6 * (1 - (275 / 425) ** 2));
    for (const c of g.cables) expect(c.deck[1]).toBeCloseTo(g.deckY(c.deck[0]), 6);
    // pylon tops lifted by the crest at the pylon
    expect(g.cables[0].top[1] - flat.cables[0].top[1]).toBeCloseTo(g.deckY(150) - g.deckElevation, 6);
    // deck pieces are pitched and sit on the curve
    for (const p of g.deckPieces) expect(p.c[1] + g.deckDepth / 2).toBeCloseTo(g.deckY(p.c[0]), 6);
    expect(g.deckPieces.some((p) => Math.abs(p.pitch ?? 0) > 0)).toBe(true);
    // continuous deck mesh follows the crest; straight decks have none
    expect(g.deckMeshes).toHaveLength(1);
    const pos = g.deckMeshes[0].positions;
    const topMid = Math.max(...pos.filter((_, i) => i % 3 === 1));
    expect(topMid).toBeCloseTo(g.deckElevation + 6, 1);
    expect(build({}).deckMeshes).toHaveLength(0);
  });

  const arch = (crown?: 'pointed' | 'rounded' | 'flat'): Partial<Model3D> => ({
    spans_m: [200, 115],
    pylon_heights_m: [100],
    pylon_shape: 'other',
    cable_planes: 2,
    cables_per_side: 6,
    pylon_custom: {
      description: 'arch',
      crown,
      legs: [
        { centerline: [[0, -20, -14], [0, 40, -12], [0, 80, -6], [0, 100, 0]], width_base_m: 4, width_top_m: 2.5 },
        { centerline: [[0, -20, 14], [0, 40, 12], [0, 80, 6], [0, 100, 0]], width_base_m: 4, width_top_m: 2.5 },
      ],
      anchor_zone: [
        { y_from_m: 40, y_to_m: 90, leg: 0 },
        { y_from_m: 40, y_to_m: 90, leg: 1 },
      ],
    },
  });
  const ringCentres = (sw: { positions: number[] }) => {
    const out: number[][] = [];
    for (let i = 0; i < sw.positions.length; i += 12) {
      const c = [0, 0, 0];
      for (let k = 0; k < 4; k++) for (let a = 0; a < 3; a++) c[a] += sw.positions[i + k * 3 + a] / 4;
      out.push(c);
    }
    return out;
  };

  it('rounded crown: the legs arrive at the apex horizontally (smooth arc), pointed ones steeply', () => {
    const slopeAtTip = (crown?: 'pointed' | 'rounded') => {
      const c = ringCentres(build(arch(crown)).pylons[0].sweeps[0]);
      const [a, b] = [c[c.length - 2], c[c.length - 1]];
      return Math.abs(b[1] - a[1]) / Math.max(1e-9, Math.abs(b[2] - a[2]));
    };
    expect(slopeAtTip('rounded')).toBeLessThan(0.35);
    expect(slopeAtTip('pointed')).toBeGreaterThan(0.6);
    // apex height kept
    expect(build(arch('rounded')).pylons[0].heightAboveDeck).toBeCloseTo(100, 0);
  });

  it('flat crown: legs stop below the apex and a head beam joins them', () => {
    const g = build(arch('flat'));
    const tops = g.pylons[0].sweeps.map((sw) => Math.max(...ringCentres(sw).map((c) => c[1])));
    for (const t of tops) expect(t).toBeLessThan(g.deckElevation + 100 - 1);
    const beam = g.pylons[0].members.find((m) => Math.abs(m.a[1] - m.b[1]) < 1e-6 && Math.abs(m.a[2] - m.b[2]) > 1);
    expect(beam).toBeDefined();
  });

  it('struts become members in the pylon frame (mirrored toward the main span)', () => {
    const m = arch();
    m.pylon_custom!.struts = [{ a: [-4, -20, -13], b: [-35, -2, -10], width: 2.5 }];
    const g = build(m);
    const strut = g.pylons[0].members.find((mb) => mb.size === 2.5)!;
    // main span is spans[0] (left), so local -x (away from the main span) is +station x
    expect(strut.b[0]).toBeCloseTo(200 + 35);
    expect(strut.b[1]).toBeCloseTo(g.deckElevation - 2);
  });

  it('twist_deg rotates the section progressively along the sweep', () => {
    const m = arch();
    m.pylon_custom!.legs = [
      { centerline: [[0, 0, 0], [0, 50, 0], [0, 100, 0]], width_base_m: 6, width_top_m: 6, depth_base_m: 2, depth_top_m: 2, twist_deg: 90 },
    ];
    m.pylon_custom!.anchor_zone = [{ y_from_m: 40, y_to_m: 90, leg: 0 }];
    m.cable_planes = 1;
    const sw = build(m).pylons[0].sweeps[0];
    const v = (i: number) => sw.positions.slice(i * 3, i * 3 + 3);
    const n = sw.positions.length / 12;
    // first ring: the 6 m width runs across (z); last ring: rotated 90°, so it runs along x
    const w0 = [v(0), v(1)];
    const w1 = [v((n - 1) * 4), v((n - 1) * 4 + 1)];
    expect(Math.abs(w0[0][2] - w0[1][2])).toBeCloseTo(6, 3);
    expect(Math.abs(w1[0][0] - w1[1][0])).toBeCloseTo(6, 3);
  });
});

describe('model review round 1: deck elevation, harp, back-stay planes, per-pylon custom heights, truss', () => {
  const curvedLeg: Model3D['pylon_custom'] = {
    description: 'two legs leaning toward the main span',
    legs: [
      { centerline: [[0, -20, -12], [2, 20, -11], [6, 50, -9], [9, 70, -7]], width_base_m: 4, width_top_m: 2.5 },
      { centerline: [[0, -20, 12], [2, 20, 11], [6, 50, 9], [9, 70, 7]], width_base_m: 4, width_top_m: 2.5 },
    ],
    anchor_zone: [
      { y_from_m: 25, y_to_m: 66, leg: 0 },
      { y_from_m: 25, y_to_m: 66, leg: 1 },
    ],
  };
  const slopeDeg = (c: { top: number[]; deck: number[] }) =>
    (Math.atan2(c.top[1] - c.deck[1], Math.abs(c.top[0] - c.deck[0])) * 180) / Math.PI;
  /** max angle difference between stays of one pylon / side / plane */
  const harpSpread = (g: ReturnType<typeof build>) => {
    const groups = new Map<string, number[]>();
    for (const c of g.cables) {
      const k = `${c.pylon}|${c.side}|${c.plane}`;
      groups.set(k, [...(groups.get(k) ?? []), slopeDeg(c)]);
    }
    return Math.max(...[...groups.values()].map((a) => Math.max(...a) - Math.min(...a)));
  };

  it('deck_elevation_m sets the deck height; navigation clearance still raises it, with a warning', () => {
    expect(build({ deck_elevation_m: 25 }).deckElevation).toBe(25);
    const g = buildBridgeGeometry({ ...base, deck_elevation_m: 25 }, 'completed', { navClearance: { height_m: 40 } })!;
    expect(g.deckElevation).toBeCloseTo(40 + g.deckDepth + 1, 6);
    expect(g.warnings).toContain('deck_elevation_m below navigation clearance');
    // custom pylon tips stay at the local y above the given deck
    const c = build({ deck_elevation_m: 25, pylon_custom: curvedLeg });
    expect(c.pylons[0].heightAboveDeck + c.deckElevation).toBeCloseTo(95, 0);
  });

  it('harp: stays on each side of a pylon are parallel (built-in, extradosed and custom pylons)', () => {
    for (const m of [
      { cable_pattern: 'harp' as const, cables_per_side: 9 },
      { cable_pattern: 'harp' as const, cables_per_side: 12, extradosed: true, pylon_heights_m: [30, 30] },
      { cable_pattern: 'harp' as const, cables_per_side: 6, pylon_custom: curvedLeg },
      { cable_pattern: 'harp' as const, cables_per_side: 8, extradosed: true, pylon_custom: curvedLeg },
    ]) {
      const g = build(m);
      expect(g.cables.length).toBeGreaterThan(0);
      expect(harpSpread(g)).toBeLessThan(0.5);
    }
    // a semi-fan is not parallel
    expect(harpSpread(build({ cable_pattern: 'semi_fan' }))).toBeGreaterThan(5);
  });

  it('harp: outermost stay still reaches the end of the reach, inner stays stay between pylon and reach', () => {
    const g = build({ cable_pattern: 'harp', cables_per_side: 9 });
    const left = g.cables.filter((c) => c.pylon === 0 && c.side === -1 && c.plane === 0);
    const xs = left.map((c) => c.deck[0]);
    expect(Math.min(...xs)).toBeCloseTo(150 - 0.95 * 150, 3);
    expect(Math.max(...xs)).toBeLessThan(150);
    // anchors rise with distance from the pylon
    const byX = [...left].sort((a, b) => b.deck[0] - a.deck[0]);
    for (let i = 1; i < byX.length; i++) expect(byX[i].top[1]).toBeGreaterThan(byX[i - 1].top[1]);
  });

  it('back_stay_planes = 2: one central plane in the main span, back stays split to both deck edges', () => {
    const g = build({ spans_m: [230, 120], pylon_shape: 'single', pylon_heights_m: [100], cable_planes: 1, back_stay_planes: 2, deck_width_m: 30 });
    const main = g.cables.filter((c) => !c.back);
    const back = g.cables.filter((c) => c.back);
    expect(main).toHaveLength(10);
    expect(main.every((c) => c.deck[2] === 0 && c.top[2] === 0)).toBe(true);
    expect(back).toHaveLength(20);
    expect(new Set(back.map((c) => c.deck[2]))).toEqual(new Set([-15, 15]));
    // they leave the mast from its two faces (small offset), not from the deck edges
    for (const c of back) {
      expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
      expect(Math.abs(c.top[2])).toBeLessThan(5);
    }
    // without the flag: everything in one plane
    expect(build({ spans_m: [230, 120], pylon_shape: 'single', pylon_heights_m: [100], cable_planes: 1 }).cables.every((c) => c.deck[2] === 0)).toBe(true);
  });

  it('back_stay_planes = 2 with a custom single mast anchors the split stays on the mast faces', () => {
    const g = build({
      spans_m: [230, 120],
      pylon_shape: 'single',
      pylon_heights_m: [145],
      pylon_height_ref: 'total',
      cable_planes: 1,
      back_stay_planes: 2,
      pylon_custom: {
        description: 'leaning mast',
        legs: [{ centerline: [[0, -8, 0], [-10, 40, 0], [-20, 88, 0], [-27, 120, 0]], width_base_m: 6, width_top_m: 2.5 }],
        anchor_zone: [{ y_from_m: 55, y_to_m: 118, leg: 0 }],
      },
    });
    const back = g.cables.filter((c) => c.back);
    expect(back.length).toBe(2 * g.cablesPerSide);
    for (const c of back) expect(Math.abs(c.top[2])).toBeGreaterThan(0.5);
    for (const c of back) expect(Math.abs(c.top[2])).toBeLessThan(3);
  });

  it('per-pylon heights scale a shared custom geometry (centre pylon taller), incl. crossbeams and anchors', () => {
    const pc = { ...curvedLeg!, crossbeams_y_m: [-3, 40] };
    const g = build({ spans_m: [110, 240, 240, 110], pylon_heights_m: [94.5, 99.74, 94.5], pylon_height_ref: 'total', pylon_custom: pc });
    const [a, b, c] = g.pylons.map((p) => p.heightAboveDeck);
    expect(b).toBeCloseTo(70, 0);
    expect(a).toBeCloseTo((70 * 94.5) / 99.74, 0);
    expect(c).toBeCloseTo(a, 6);
    // the upper crossbeam of a side pylon sits lower than the centre one
    const beamY = (pi: number) => Math.max(...g.pylons[pi].members.map((mb) => mb.a[1]));
    expect(beamY(0)).toBeLessThan(beamY(1));
    const topAnchor = (pi: number) => Math.max(...g.cables.filter((x) => x.pylon === pi).map((x) => x.top[1]));
    expect(topAnchor(0)).toBeLessThan(topAnchor(1));
    // equal heights: unscaled
    expect(build({ pylon_custom: pc }).pylons[0].heightAboveDeck).toBeCloseTo(70, 0);
  });

  it('custom pylon label: total (water to tip) when heights are given as total, else above deck', () => {
    const t = build({ pylon_height_ref: 'total', pylon_custom: curvedLeg });
    expect(t.pylons[0].labelRef).toBe('total');
    expect(t.pylons[0].labelHeight).toBeCloseTo(t.pylons[0].heightAboveDeck + t.deckElevation, 6);
    const a = build({ pylon_custom: curvedLeg });
    expect(a.pylons[0].labelRef).toBe('above_deck');
    expect(a.pylons[0].labelHeight).toBeCloseTo(a.pylons[0].heightAboveDeck, 6);
  });

  it('truss deck: two chord slabs deck_depth_m apart plus a web on both faces; deeper deck raises E over navigation', () => {
    const box = build({});
    const g = buildBridgeGeometry({ ...base, deck_section: 'truss', deck_depth_m: 14 }, 'completed', { navClearance: { height_m: 40 } })!;
    expect(g.deckSection).toBe('truss');
    expect(g.deckDepth).toBe(14);
    expect(g.deckPieces).toHaveLength(2 * box.deckPieces.length);
    const tops = g.deckPieces.map((p) => p.c[1] + p.s[1] / 2);
    expect(Math.max(...tops)).toBeCloseTo(g.deckElevation, 6);
    expect(Math.min(...g.deckPieces.map((p) => p.c[1] - p.s[1] / 2))).toBeCloseTo(g.deckElevation - 14, 6);
    expect(g.deckMembers.length).toBeGreaterThan(100);
    expect(new Set(g.deckMembers.map((mb) => Math.sign(mb.a[2])))).toEqual(new Set([-1, 1]));
    expect(g.deckElevation).toBeCloseTo(40 + 14 + 1, 6);
    // stays still anchor at the top chord edge
    expect(g.cables.every((c) => c.deck[1] === g.deckElevation && Math.abs(c.deck[2]) === 13)).toBe(true);
    expect(box.deckMembers).toHaveLength(0);
  });

  it('stay lightness clamp keeps white stays visible on a light sky and dark stays on a dark sky', () => {
    expect(stayLightness(0.91, false)).toBe(0.7);
    expect(stayLightness(0.4, false)).toBe(0.4);
    expect(stayLightness(0.2, true)).toBe(0.45);
    expect(stayLightness(0.9, true)).toBe(0.9);
  });
});

describe('pile caps (pylon_custom.pile_cap)', () => {
  const ext = (pos: number[]) => {
    const r = { x: [Infinity, -Infinity], y: [Infinity, -Infinity], z: [Infinity, -Infinity] };
    for (let i = 0; i < pos.length; i += 3)
      (['x', 'y', 'z'] as const).forEach((k, a) => {
        r[k][0] = Math.min(r[k][0], pos[i + a]);
        r[k][1] = Math.max(r[k][1], pos[i + a]);
      });
    return r;
  };
  it('box and stadium prisms span the given extents, with valid indices', () => {
    for (const rounded of [false, true]) {
      const m = pileCapMesh(20, 32, -25, -20, rounded);
      const e = ext(m.positions);
      expect(e.x[0]).toBeCloseTo(-10, 6);
      expect(e.x[1]).toBeCloseTo(10, 6);
      expect(e.z[0]).toBeCloseTo(-16, 6);
      expect(e.z[1]).toBeCloseTo(16, 6);
      expect(e.y).toEqual([-25, -20]);
      expect(Math.max(...m.indices)).toBeLessThan(m.positions.length / 3);
      expect(m.indices.length % 3).toBe(0);
    }
    // stadium: the ±z ends are semicircles, so a corner point (x = ±L/2, z = ±W/2) is not part of the outline
    const st = pileCapMesh(20, 32, -25, -20, true).positions;
    let corner = false;
    for (let i = 0; i < st.length; i += 3) if (Math.abs(Math.abs(st[i]) - 10) < 1e-6 && Math.abs(Math.abs(st[i + 2]) - 16) < 1e-6) corner = true;
    expect(corner).toBe(false);
  });

  it('drawn at every custom pylon in the pylon frame, included in the bounds; plain pylons have none', () => {
    const g = build({
      spans_m: [90, 160, 160, 90],
      pylon_heights_m: [18, 18, 18],
      deck_elevation_m: 22,
      deck_width_m: 21.5,
      pylon_custom: {
        description: 'columns on a cap',
        legs: [
          { centerline: [[0, -20, -11], [0, 0, -12], [0, 18, -20]], width_base_m: 2.5, width_top_m: 2, depth_base_m: 5, depth_top_m: 5.5 },
          { centerline: [[0, -20, 11], [0, 0, 12], [0, 18, 20]], width_base_m: 2.5, width_top_m: 2, depth_base_m: 5, depth_top_m: 5.5 },
        ],
        pile_cap: { length_x_m: 20, width_z_m: 32, top_y_m: -20, thickness_m: 5, rounded_ends: true },
        anchor_zone: [
          { y_from_m: 6, y_to_m: 17, leg: 0 },
          { y_from_m: 6, y_to_m: 17, leg: 1 },
        ],
      },
    });
    expect(g.pylons.every((p) => p.caps.length === 1)).toBe(true);
    for (const p of g.pylons) {
      const e = ext(p.caps[0].positions);
      expect(e.y[1]).toBeCloseTo(2, 6); // 22 m deck, top 20 m below it
      expect(e.y[0]).toBeCloseTo(-3, 6);
      expect(e.x[0]).toBeCloseTo(p.x - 10, 6);
      expect(e.x[1]).toBeCloseTo(p.x + 10, 6);
    }
    expect(g.bounds.max[2]).toBeGreaterThanOrEqual(16 - 1e-6);
    expect(build({}).pylons.every((p) => p.caps.length === 0)).toBe(true);
  });
});

describe('per-side anchor zones (G8)', () => {
  const sail: Partial<Model3D> = {
    spans_m: [125, 300, 125],
    pylon_heights_m: [111, 111],
    pylon_height_ref: 'total',
    cable_planes: 1,
    back_stay_planes: 2,
    cable_pattern: 'semi_fan',
    cables_per_side: 20,
    deck_width_m: 26.5,
    deck_elevation_m: 30,
    pylon_custom: {
      description: 'mast + two rear columns',
      legs: [
        { centerline: [[-9, -28, -11], [-9, 0, -12], [-8, 30, -8], [-6, 67, -2]], width_base_m: 2.5, width_top_m: 1.8 },
        { centerline: [[7, -28, 0], [8, 0, 0], [8.5, 25, 0], [2, 68, 0], [-4, 79.5, 0]], width_base_m: 4, width_top_m: 2.5 },
        { centerline: [[-9, -28, 11], [-9, 0, 12], [-8, 30, 8], [-6, 67, 2]], width_base_m: 2.5, width_top_m: 1.8 },
      ],
      anchor_zone: [
        { y_from_m: 30, y_to_m: 76, leg: 1, side: 'main' },
        { y_from_m: 24, y_to_m: 64, leg: 0, side: 'back' },
        { y_from_m: 24, y_to_m: 64, leg: 2, side: 'back' },
      ],
    },
  };

  it('main-span stays anchor on the mast in the central plane; side-span stays on the rear columns in two planes', () => {
    const g = build(sail);
    const main = g.cables.filter((c) => !c.back);
    const back = g.cables.filter((c) => c.back);
    expect(main).toHaveLength(2 * 20); // 2 pylons × 1 plane × 20
    expect(back).toHaveLength(2 * 2 * 20); // 2 pylons × 2 planes × 20
    for (const c of main) {
      expect(c.deck[2]).toBe(0);
      expect(Math.abs(c.top[2])).toBeLessThan(1e-6); // the mast is on the centreline
      expect(c.top[1] - g.deckElevation).toBeGreaterThanOrEqual(30 - 1e-6);
    }
    for (const c of back) {
      expect(Math.abs(c.deck[2])).toBe(13.25);
      // on the rear column of the same side: inside the deck edge, well away from the centreline
      expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
      expect(Math.abs(c.top[2])).toBeGreaterThan(1.5);
      expect(Math.abs(c.top[2])).toBeLessThan(13);
      expect(c.top[1] - g.deckElevation).toBeLessThanOrEqual(64 + 1e-6);
    }
    // rear-column anchors sit behind the mast (toward the side span), mast anchors in front of the columns at mid-height
    const p0 = g.pylons[0];
    const mainX = main.filter((c) => c.pylon === 0).map((c) => c.top[0]);
    const backX = back.filter((c) => c.pylon === 0).map((c) => c.top[0]);
    expect(Math.min(...backX)).toBeLessThan(p0.x - 4); // pylon 0 faces +x: rear columns at local −x
    expect(Math.max(...mainX)).toBeGreaterThan(p0.x + 4);
  });

  it('zones without a side serve both sides; without any side the old single-plane behaviour holds', () => {
    const noSide = build({
      ...sail,
      pylon_custom: { ...sail.pylon_custom!, anchor_zone: sail.pylon_custom!.anchor_zone.map((z) => ({ y_from_m: z.y_from_m, y_to_m: z.y_to_m, leg: z.leg })) },
    });
    // without sides, a single-plane bridge anchors on the centreline (plus the split-back face offset)
    expect(noSide.cables.filter((c) => !c.back).every((c) => c.top[2] === 0)).toBe(true);
  });
});

describe('deck crest vs navigation clearance (G9) and crossbeam depth (G10)', () => {
  const hPylon: Model3D['pylon_custom'] = {
    description: 'H: two vertical columns, lower and upper crossbeams',
    legs: [
      { centerline: [[0, -34, -11], [0, 0, -11], [0, 35, -11], [0, 66, -11]], width_base_m: 4, width_top_m: 3 },
      { centerline: [[0, -34, 11], [0, 0, 11], [0, 35, 11], [0, 66, 11]], width_base_m: 4, width_top_m: 3 },
    ],
    crossbeams_y_m: [-3, 35],
    anchor_zone: [
      { y_from_m: 31, y_to_m: 61, leg: 0 },
      { y_from_m: 31, y_to_m: 61, leg: 1 },
    ],
  };
  // Rạch Miễu 2-like: 120 + 270 + 120, deck 36 m at the ends + 6 m crest, 37.5 m channel
  const rm2: Model3D = {
    ...base,
    spans_m: [120, 270, 120],
    pylon_heights_m: [116.5, 116.5],
    pylon_height_ref: 'total',
    deck_width_m: 17.5,
    deck_elevation_m: 36,
    deck_crest_m: 6,
    pylon_custom: hPylon,
  };
  const nav = { navClearance: { height_m: 37.5, width_m: 220 } };

  it('the clearance is checked at the main-span centre including the crest: E stays at the given value, no warning', () => {
    const g = buildBridgeGeometry(rm2, 'completed', nav)!;
    expect(g.deckDepth).toBeCloseTo(2.25, 6);
    expect(g.deckElevation).toBe(36);
    expect(g.deckY(255)).toBeCloseTo(42, 1);
    expect(g.deckY(255) - g.deckDepth).toBeGreaterThan(37.5 + 1 - 1e-9);
    expect(g.warnings).not.toContain('deck_elevation_m below navigation clearance');
  });

  it('a given deck too low even with the crest is raised just enough at the main-span centre, with a warning', () => {
    const g = buildBridgeGeometry({ ...rm2, deck_elevation_m: 30 }, 'completed', nav)!;
    expect(g.deckY(255)).toBeCloseTo(37.5 + g.deckDepth + 1, 6);
    expect(g.deckElevation).toBeCloseTo(37.5 + g.deckDepth + 1 - 6, 6);
    expect(g.warnings).toContain('deck_elevation_m below navigation clearance');
  });

  it('the heuristic deck elevation is lowered by the crest at the main-span centre', () => {
    const g = buildBridgeGeometry({ ...rm2, deck_elevation_m: undefined }, 'completed', { navClearance: { height_m: 50 } })!;
    expect(g.deckElevation).toBeCloseTo(50 + g.deckDepth + 1 - 6, 6);
  });

  it('without a crest the clearance floor is unchanged', () => {
    const g = buildBridgeGeometry({ ...base, deck_elevation_m: 25 }, 'completed', { navClearance: { height_m: 40 } })!;
    expect(g.deckElevation).toBeCloseTo(40 + g.deckDepth + 1, 6);
    const flat = buildBridgeGeometry({ ...rm2, deck_crest_m: undefined }, 'completed', nav)!;
    expect(flat.deckElevation).toBeCloseTo(37.5 + flat.deckDepth + 1, 6);
  });

  it('pylon labels (total) include the crest at the pylon: label = drawn water-to-tip', () => {
    const g = buildBridgeGeometry(rm2, 'completed', nav)!;
    for (const p of g.pylons) {
      const tip = Math.max(...p.sweeps.flatMap((sw) => sw.positions.filter((_, i) => i % 3 === 1)));
      expect(p.labelHeight).toBeCloseTo(tip, 1); // sweep corners sit ±1.5 m off the pylon station, on a slightly different crest
      expect(p.labelHeight).toBeCloseTo(66 + g.deckY(p.x), 1);
    }
    // built-in pylons: the drawn tip (lifted by the crest at the pylon) matches the given total height
    const b = buildBridgeGeometry({ ...rm2, pylon_custom: undefined }, 'completed', nav)!;
    for (const p of b.pylons) {
      expect(p.labelHeight).toBe(116.5);
      expect(b.deckY(p.x) + p.heightAboveDeck).toBeCloseTo(116.5, 6);
    }
  });

  it('crossbeam_depth_m sets the vertical depth of the crossbeams (default: square members)', () => {
    const g = buildBridgeGeometry({ ...rm2, pylon_custom: { ...hPylon, crossbeam_depth_m: 5 } }, 'completed', nav)!;
    const beams = g.pylons[0].members;
    expect(beams).toHaveLength(2);
    expect(beams.every((mb) => mb.depth === 5 && Math.abs(mb.size - 2.4) < 1e-9)).toBe(true);
    // the upper strut at local y 35 above the (crested) deck at the pylon
    expect(Math.max(...beams.map((mb) => mb.a[1]))).toBeCloseTo(g.deckY(g.pylons[0].x) + 35, 1);
    const plain = buildBridgeGeometry(rm2, 'completed', nav)!;
    expect(plain.pylons[0].members.every((mb) => mb.depth === undefined)).toBe(true);
  });
});

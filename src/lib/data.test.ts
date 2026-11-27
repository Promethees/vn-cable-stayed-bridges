import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildBridgeGeometry, heightDimension } from './bridge3d';
import { defaultView } from './hero';
import { parseBridges } from './validate';

const files = ['data/bridges.json', 'data/bridges.sample.json'].map((f) => resolve(__dirname, '../..', f)).filter(existsSync);

describe.each(files)('%s', (file) => {
  const warnings: unknown[] = [];
  const raw = JSON.parse(readFileSync(file, 'utf8')) as unknown[];
  const bridges = parseBridges(raw, (...a) => warnings.push(a.join(' ')));

  it('every entry validates (no drops, no model3d rejected)', () => {
    expect(warnings.filter((w) => String(w).includes('dropping'))).toEqual([]);
    expect(bridges).toHaveLength(raw.length);
  });

  it('every model3d builds a geometry with pylons and cables inside the deck', () => {
    for (const b of bridges) {
      if (!b.model3d) continue;
      const g = buildBridgeGeometry(b.model3d, b.status);
      expect(g, b.id).not.toBeNull();
      expect(g!.pylons.length, b.id).toBeGreaterThan(0);
      expect(g!.cables.length, b.id).toBeGreaterThan(0);
      for (const c of g!.cables) {
        expect(c.deck[0], b.id).toBeGreaterThanOrEqual(0);
        expect(c.deck[0], b.id).toBeLessThanOrEqual(g!.totalLength);
      }
    }
  });

  it('custom pylons: every stay anchors on a swept leg (incl. the Long Hưng twin median blades)', () => {
    for (const b of bridges) {
      const pc = b.model3d?.pylon_custom;
      if (!pc) continue;
      const g = buildBridgeGeometry(b.model3d!, b.status, { navClearance: b.nav_clearance })!;
      const maxW = Math.max(...pc.legs.map((l) => Math.max(l.width_base_m, l.depth_base_m ?? 0)));
      for (const [pi, p] of g.pylons.entries()) {
        const centres: number[][] = [];
        for (const sw of p.sweeps)
          for (let i = 0; i < sw.positions.length; i += 12) {
            const c = [0, 0, 0];
            for (let k = 0; k < 4; k++) for (let a = 0; a < 3; a++) c[a] += sw.positions[i + k * 3 + a] / 4;
            centres.push(c);
          }
        for (const c of g.cables.filter((x) => x.pylon === pi)) {
          const d = Math.min(...centres.map((q) => Math.hypot(q[0] - c.top[0], q[1] - c.top[1], q[2] - c.top[2])));
          expect(d, `${b.id} pylon ${pi}`).toBeLessThan(maxW + 1);
        }
      }
      if (b.id === 'cau-long-hung') {
        // twin swords: one central plane anchored in the slot between the two median blades
        expect(pc.legs).toHaveLength(2);
        expect(g.cables.length).toBeGreaterThan(0);
        expect(g.cables.every((c) => Math.abs(c.top[2]) < 1e-6 && c.top[1] > g.deckElevation + 59)).toBe(true);
      }
    }
  });

  it('custom pylons: every member and sweep vertex lies inside the pylon_custom legs/struts bounding box', () => {
    for (const b of bridges) {
      const pc = b.model3d?.pylon_custom;
      if (!pc) continue;
      const g = buildBridgeGeometry(b.model3d!, b.status, { navClearance: b.nav_clearance })!;
      const E = g.deckElevation;
      const pad = Math.max(...pc.legs.map((l) => Math.max(l.width_base_m, l.width_top_m, l.depth_base_m ?? 0, l.depth_top_m ?? 0))) / 2 + 1;
      // local-frame extents of every leg centreline and strut, as |x| (pylons may be mirrored), y, z
      const local = [...pc.legs.flatMap((l) => l.centerline), ...(pc.struts ?? []).flatMap((st) => [st.a, st.b])];
      const maxAbsX = Math.max(...local.map((v) => Math.abs(v[0]))) + pad;
      const minY = Math.min(...local.map((v) => v[1])) - pad;
      const maxY = Math.max(...local.map((v) => v[1])) + pad;
      const minZ = Math.min(...local.map((v) => v[2])) - pad;
      const maxZ = Math.max(...local.map((v) => v[2])) + pad;
      for (const p of g.pylons) {
        expect(p.custom, b.id).toBe(true);
        const inside = (v: number[], what: string) => {
          expect(Math.abs(v[0] - p.x), `${b.id} ${what} x`).toBeLessThanOrEqual(maxAbsX);
          const ly = v[1] - E;
          // the deck crest may lift points slightly; allow for it
          expect(ly, `${b.id} ${what} y`).toBeGreaterThanOrEqual(minY - (b.model3d!.deck_crest_m ?? 0));
          expect(ly, `${b.id} ${what} y`).toBeLessThanOrEqual(maxY + (b.model3d!.deck_crest_m ?? 0));
          expect(v[2], `${b.id} ${what} z`).toBeGreaterThanOrEqual(minZ);
          expect(v[2], `${b.id} ${what} z`).toBeLessThanOrEqual(maxZ);
        };
        for (const mb of p.members) {
          inside(mb.a, 'member');
          inside(mb.b, 'member');
        }
        for (const sw of p.sweeps) for (let i = 0; i < sw.positions.length; i += 3) inside(sw.positions.slice(i, i + 3), 'sweep');
        // only crossbeams / crown beams / struts: never the default-shape members (the old "extra pole")
        const expected = (pc.crossbeams_y_m?.length ?? 0) * Math.max(0, pc.legs.length - 1) + (pc.struts?.length ?? 0);
        const flatBeams = pc.crown === 'flat' ? pc.legs.length - 1 : 0;
        expect(p.members.length, b.id).toBeGreaterThanOrEqual(expected);
        expect(p.members.length, b.id).toBeLessThanOrEqual(expected + flatBeams);
      }
    }
  }, 20_000); // one expect per sweep vertex: ≈2–5 s on a loaded machine

  it('height dimensions sit beside the real pylon tip (no orphan pole by the base of a leaning pylon)', () => {
    for (const b of bridges) {
      if (!b.model3d?.pylon_custom) continue;
      const g = buildBridgeGeometry(b.model3d, b.status, { navClearance: b.nav_clearance })!;
      for (const p of g.pylons) {
        const d = heightDimension(g, p);
        // the tip of the sweep
        let tip = [0, -Infinity, 0];
        for (const sw of p.sweeps)
          for (let i = 0; i < sw.positions.length; i += 3) if (sw.positions[i + 1] > tip[1]) tip = sw.positions.slice(i, i + 3);
        const gap = Math.max(8, g.deckWidth * 0.4);
        expect(d.x - tip[0], b.id).toBeCloseTo(gap, 6);
        expect(d.y1, b.id).toBeCloseTo(g.deckElevation + p.heightAboveDeck, 6);
      }
    }
  });

  it('cards with only link-only photos do not open on an empty photo tab', () => {
    for (const b of bridges) {
      if (b.images.length && b.images.every((i) => i.license.trim().toLowerCase() === 'unknown') && b.model3d)
        expect(defaultView(b), b.id).toBe('diagram');
    }
  });

  it('Thượng Cát (round 2): 3 V-blade pylons on 120 + 2 × 270 + 120, centre taller, blades lean outward, no beam above deck', () => {
    const b = bridges.find((x) => x.id === 'cau-thuong-cat');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, b.status, { navClearance: b.nav_clearance })!;
    expect(b.main_span_m).toBe(270);
    expect(g.pylons.map((p) => p.x)).toEqual([120, 390, 660]);
    expect(g.deckElevation).toBe(25);
    const [h0, h1, h2] = g.pylons.map((p) => p.heightAboveDeck);
    expect(h1).toBeCloseTo(80, 0);
    expect(h0).toBeCloseTo(70, 0);
    expect(h2).toBeCloseTo(70, 0);
    for (const p of g.pylons) {
      // the only member above the waterline block is the under-deck crossbeam: nothing joins the blades above the deck
      expect(p.members.every((mb) => Math.max(mb.a[1], mb.b[1]) < g.deckElevation)).toBe(true);
      // blades: widest across at the tips (outward lean), tips well outside the deck edges
      let tipHalf = 0;
      for (const sw of p.sweeps)
        for (let i = 0; i < sw.positions.length; i += 3)
          if (sw.positions[i + 1] > g.deckElevation + p.heightAboveDeck - 2) tipHalf = Math.max(tipHalf, Math.abs(sw.positions[i + 2]));
      expect(tipHalf).toBeGreaterThan(g.deckWidth / 2 + 15);
    }
    // stays: 2 planes from the deck edges, rising outward to the blades
    expect(g.cables.every((c) => Math.abs(c.deck[2]) === 17.5 && Math.abs(c.top[2]) > 17.5 && Math.sign(c.top[2]) === Math.sign(c.deck[2]))).toBe(true);
    // round 2b: blades = legs 2 and 3 (split at deck level); stays between ≈0.4 and 0.8 of the height, top fifth bare
    const pc = b.model3d.pylon_custom!;
    expect(pc.legs).toHaveLength(5);
    expect(pc.anchor_zone.map((z) => z.leg).sort()).toEqual([2, 3]);
    expect(pc.crossbeams_y_m).toBeUndefined();
    expect(b.model3d.cables_per_side).toBe(13);
    // round 3: slender along the bridge (height / width at the deck ≈ 18–22; flare ≈ 2–2.5 × the shaft at the waterline)
    const [lower, , upper] = pc.legs;
    expect(80 / upper.depth_base_m!).toBeGreaterThanOrEqual(17);
    expect(80 / upper.depth_base_m!).toBeLessThanOrEqual(22);
    expect(lower.depth_top_m).toBe(upper.depth_base_m);
    expect(lower.width_top_m).toBe(upper.width_base_m);
    expect(lower.depth_base_m! / upper.depth_base_m!).toBeGreaterThanOrEqual(2);
    expect(lower.depth_base_m! / upper.depth_base_m!).toBeLessThanOrEqual(2.5);
    for (const p of g.pylons)
      for (const c of g.cables.filter((x) => x.pylon === p.index)) {
        const f = (c.top[1] - g.deckElevation) / p.heightAboveDeck;
        expect(f).toBeGreaterThan(0.39);
        expect(f).toBeLessThan(0.81);
      }
    // low pile cap: members stay within ≈2 m of the waterline (+ crest lift); the only other members sit just under the deck
    for (const p of g.pylons)
      for (const mb of p.members) expect(Math.max(mb.a[1], mb.b[1]) <= 2.5 || Math.min(mb.a[1], mb.b[1]) > g.deckElevation - 15).toBe(true);
  });

  it('Bến Rừng (round 5): every pylon stands on a pile cap at the waterline; columns, 22 m deck, ≈25° blades, 12 stays', () => {
    const b = bridges.find((x) => x.id === 'cau-ben-rung');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, b.status, { navClearance: b.nav_clearance })!;
    expect(g.deckElevation).toBe(22);
    expect(g.deckElevation - g.deckDepth).toBeGreaterThan(11); // 11 m navigation clearance
    expect(g.pylons).toHaveLength(3);
    for (const p of g.pylons) {
      expect(p.caps).toHaveLength(1);
      let top = -Infinity;
      for (let i = 1; i < p.caps[0].positions.length; i += 3) top = Math.max(top, p.caps[0].positions[i]);
      expect(Math.abs(top)).toBeLessThanOrEqual(3); // cap top within ±3 m of the waterline
      // the legs reach down to the cap (no floating pylon)
      let legBottom = Infinity;
      for (const sw of p.sweeps) for (let i = 1; i < sw.positions.length; i += 3) legBottom = Math.min(legBottom, sw.positions[i]);
      expect(legBottom).toBeLessThanOrEqual(top + 0.5);
    }
    // blades lean out ≈25° from vertical above the deck
    const leg = b.model3d.pylon_custom!.legs[1].centerline;
    const [, y0, z0] = leg[3];
    const [, y1, z1] = leg[leg.length - 1];
    const lean = (Math.atan2(z1 - z0, y1 - y0) * 180) / Math.PI;
    expect(lean).toBeGreaterThan(22);
    expect(lean).toBeLessThan(28);
    expect(g.cablesPerSide).toBe(12);
    expect(g.pattern).toBe('semi_fan');
  });

  it('Nguyễn Trãi (round 6): sail pylons; main-span stays on the mast (1 plane), side-span stays on rear columns (2 planes)', () => {
    const b = bridges.find((x) => x.id === 'cau-nguyen-trai');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.deckElevation).toBe(30);
    expect(g.deckElevation - g.deckDepth).toBeGreaterThan(25); // 165 × 25 m channel
    expect(g.pylons.map((p) => p.x)).toEqual([125, 425]);
    for (const p of g.pylons) {
      expect(p.labelRef).toBe('total');
      expect(p.labelHeight).toBeGreaterThan(105);
      expect(p.labelHeight).toBeLessThan(113);
      expect(p.caps).toHaveLength(1);
      const main = g.cables.filter((c) => c.pylon === p.index && !c.back);
      const back = g.cables.filter((c) => c.pylon === p.index && c.back);
      expect(main).toHaveLength(20);
      expect(back).toHaveLength(40);
      expect(main.every((c) => c.deck[2] === 0 && Math.abs(c.top[2]) < 1e-6)).toBe(true);
      expect(back.every((c) => Math.abs(c.deck[2]) === 13.25 && Math.sign(c.top[2]) === Math.sign(c.deck[2]))).toBe(true);
    }
  });

  it('Phước Khánh (round 7): ≈68 m H portal on a pile cap, stays only above the upper beam, deck clears 55 × 242 m', () => {
    const b = bridges.find((x) => x.id === 'cau-phuoc-khanh');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(58.5);
    expect(g.pylons.map((p) => p.x)).toEqual([149.5, 449.5]);
    expect(g.cables).toHaveLength(112); // 14 per side per plane × 2 sides × 2 planes × 2 pylons
    for (const p of g.pylons) {
      expect(p.heightAboveDeck).toBeGreaterThan(64);
      expect(p.heightAboveDeck).toBeLessThan(71);
      expect(p.heightAboveDeck / g.deckElevation).toBeGreaterThan(1.05); // photo ratio 1.08–1.13 (was 1.65)
      expect(p.heightAboveDeck / g.deckElevation).toBeLessThan(1.2);
      expect(p.labelRef).toBe('total');
      expect(p.labelHeight).toBeGreaterThan(124); // ≈127 m water → tip, not the old 155
      expect(p.labelHeight).toBeLessThan(130);
      expect(p.caps).toHaveLength(1);
      const own = g.cables.filter((c) => c.pylon === p.index);
      expect(own).toHaveLength(56);
      for (const c of own) {
        const above = c.top[1] - g.deckY(p.x);
        expect(above, 'anchor above the upper crossbeam (43 m)').toBeGreaterThan(45);
        expect(above).toBeLessThan(68);
      }
    }
  });

  it('Bình Khánh (round 7): H legs reach the water outside a 30.35 m deck, beam at ≈2/3, tie beam at the waterline, white fan stays', () => {
    const b = bridges.find((x) => x.id === 'cau-binh-khanh');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, b.status, { navClearance: b.nav_clearance })!;
    const E = g.deckElevation;
    expect(E).toBe(60);
    expect(g.deckWidth).toBe(30.35);
    expect(b.width_m).toBe(21.75); // roadway; the girder is wider
    expect(E - g.deckDepth).toBeGreaterThanOrEqual(55); // 55 × 242 m channel
    expect(g.pylons.map((p) => p.x)).toEqual([187.25, 562.25]);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.colours.stay).toBe('white');
    for (const p of g.pylons) {
      expect(p.labelRef).toBe('total');
      expect(p.labelHeight).toBeGreaterThanOrEqual(151);
      expect(p.labelHeight).toBeLessThanOrEqual(157);
      // legs reach the water and stand fully outside the deck
      let bottom = Infinity;
      let inner = Infinity;
      for (const sw of p.sweeps)
        for (let i = 0; i < sw.positions.length; i += 3) {
          const y = sw.positions[i + 1];
          bottom = Math.min(bottom, y);
          if (y >= E - g.deckDepth - 6 && y <= E + 6) inner = Math.min(inner, Math.abs(sw.positions[i + 2])); // at deck level
        }
      expect(bottom).toBeLessThanOrEqual(0);
      expect(inner).toBeGreaterThan(g.deckWidth / 2);
      expect(inner - g.deckWidth / 2).toBeLessThan(1.5);
      // exactly two horizontal beams: the upper one at 0.64–0.68 of the above-deck height, a tie a few metres above water
      const beams = p.members.map((mb) => mb.a[1]).sort((a, c) => a - c);
      expect(beams).toHaveLength(2);
      expect(beams[0]).toBeGreaterThan(0);
      expect(beams[0]).toBeLessThan(15);
      expect((beams[1] - E) / p.heightAboveDeck).toBeGreaterThanOrEqual(0.64);
      expect((beams[1] - E) / p.heightAboveDeck).toBeLessThanOrEqual(0.68);
      expect(p.members.every((mb) => Math.abs(mb.a[1] - E) > 10)).toBe(true); // no beam under the deck
      // 2 planes × 17 per side, saddles over 53–89 m above deck, the lowest below the upper beam
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(2 * 2 * 17);
      const tops = cs.map((c) => c.top[1] - E);
      expect(Math.min(...tops)).toBeGreaterThanOrEqual(52.5);
      expect(Math.min(...tops)).toBeLessThan(beams[1] - E);
      expect(Math.max(...tops)).toBeLessThanOrEqual(89.5);
    }
  });

  it('Trần Thị Lý (round 7): 4×50 + 230 unit, 134 m leaning blade, back stays converging on abutment S1 (G11)', () => {
    const b = bridges.find((x) => x.id === 'cau-tran-thi-ly');
    if (!b?.model3d) return; // sample data
    const g = buildBridgeGeometry(b.model3d, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.deckElevation).toBe(11);
    expect(g.warnings).toEqual([]);
    expect(g.auxiliaryPiers).toEqual([50, 100, 150]);
    expect(g.pylons.map((p) => p.x)).toEqual([200]);
    const [p] = g.pylons;
    expect(p.labelRef).toBe('total');
    expect(p.labelHeight).toBeGreaterThan(142);
    expect(p.labelHeight).toBeLessThan(148);
    expect(p.caps).toHaveLength(1);
    // the mast leans 12° away from the main span (local −x is west, toward S1 at station 0)
    const cl = b.model3d.pylon_custom!.legs[0].centerline;
    const [x0, y0] = cl[0];
    const [x1, y1] = cl[cl.length - 1];
    expect((Math.atan2(x0 - x1, y1 - y0) * 180) / Math.PI).toBeCloseTo(12, 0);
    const main = g.cables.filter((c) => !c.back);
    const back = g.cables.filter((c) => c.back);
    expect(main).toHaveLength(33);
    expect(back).toHaveLength(30);
    expect(main.every((c) => c.deck[2] === 0 && c.deck[0] > 200)).toBe(true);
    expect(back.every((c) => Math.abs(c.deck[2]) === 17.25 && c.deck[0] >= 4.5 && c.deck[0] <= 19.5)).toBe(true);
    // no back stay lands over S2–S4
    expect(back.some((c) => c.deck[0] > 45)).toBe(false);
  });

  it('Rạch Miễu 2 (round 7): H pylons with an upper strut, no aux piers, crested deck clears 37.5 m at E = 36', () => {
    const b = bridges.find((x) => x.id === 'cau-rach-mieu-2');
    if (!b?.model3d || file.endsWith('.sample.json')) return; // the sample keeps an older, simpler record
    const m = b.model3d;
    expect(m.spans_m).toEqual([120, 270, 120]);
    expect(m.auxiliary_piers_m).toBeUndefined();
    expect(b.span_arrangement).toBe('120 + 270 + 120 m');
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(36);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([120, 390]);
    const mid = g.deckY(255);
    expect(mid).toBeCloseTo(42, 1);
    expect(mid - g.deckDepth).toBeGreaterThan(37.5 + 1 - 1e-9);
    expect(g.clearance?.height).toBe(37.5);
    for (const p of g.pylons) {
      // ≈40 m deck at the pylons, ≈66 m above it, ≈106 m water to tip (label includes the crest)
      expect(g.deckY(p.x)).toBeGreaterThan(39.5);
      expect(g.deckY(p.x)).toBeLessThan(41);
      expect(p.heightAboveDeck).toBeCloseTo(66, 0);
      expect(p.heightAboveDeck / g.deckY(p.x)).toBeGreaterThan(1.55);
      expect(p.heightAboveDeck / g.deckY(p.x)).toBeLessThan(1.75);
      expect(p.labelHeight).toBeGreaterThan(105);
      expect(p.labelHeight).toBeLessThan(108);
      expect(p.caps).toHaveLength(1);
      // lower crossbeam under the deck and the upper strut at ≈53% of the above-deck height, 5 m deep
      const ys = p.members.map((mb) => (mb.a[1] + mb.b[1]) / 2 - g.deckY(p.x)).sort((a, c) => a - c);
      expect(ys).toHaveLength(2);
      expect(ys[0]).toBeCloseTo(-3, 0);
      expect(ys[1] / p.heightAboveDeck).toBeGreaterThan(0.51);
      expect(ys[1] / p.heightAboveDeck).toBeLessThan(0.55);
      expect(p.members.every((mb) => mb.depth === 5)).toBe(true);
      // 14 per side per plane, anchored 31–61 m above the deck
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(14 * 2 * 2);
      for (const c of cs) {
        expect(c.top[1] - g.deckY(p.x)).toBeGreaterThan(30);
        expect(c.top[1] - g.deckY(p.x)).toBeLessThan(62);
      }
    }
    expect(g.colours.stay).toBe('white');
  });

  it('model3d has only schema keys, and harp bridges draw parallel stays (within 2°)', () => {
    const KEYS = new Set([
      'spans_m', 'pylon_shape', 'pylon_heights_m', 'pylon_height_ref', 'cable_planes', 'cable_pattern', 'cables_per_side',
      'deck_width_m', 'deck_type', 'approach_length_m', 'extradosed', 'deck_plan_radius_m', 'deck_crest_m', 'deck_elevation_m',
      'auxiliary_piers_m', 'pylon_colour', 'stay_colour', 'back_stay_colour', 'deck_colour', 'back_stay_planes', 'back_stay_count', 'back_stay_deck_m', 'deck_section',
      'deck_depth_m', 'pylon_custom', 'confidence', 'notes',
    ]);
    for (const b of bridges) {
      if (!b.model3d) continue;
      for (const k of Object.keys(b.model3d)) expect(KEYS.has(k), `${b.id}: ${k}`).toBe(true);
      if (b.model3d.cable_pattern !== 'harp') continue;
      const g = buildBridgeGeometry(b.model3d, 'completed', { navClearance: b.nav_clearance })!;
      const groups = new Map<string, number[]>();
      for (const c of g.cables) {
        const k = `${c.pylon}|${c.side}|${c.plane}`;
        const deg = (Math.atan2(c.top[1] - c.deck[1], Math.hypot(c.top[0] - c.deck[0], c.top[2] - c.deck[2])) * 180) / Math.PI;
        groups.set(k, [...(groups.get(k) ?? []), deg]);
      }
      for (const [k, a] of groups) {
        const sorted = [...a].sort((x, y) => x - y);
        for (let i = 1; i < sorted.length; i++) expect(sorted[i] - sorted[i - 1], `${b.id} ${k}`).toBeLessThan(2);
      }
    }
  });
});

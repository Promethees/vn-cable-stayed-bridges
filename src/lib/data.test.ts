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

  it('Tứ Liên (round 8): diamond-X pylons crossing at y 62, staggered posts, aux piers, 19 stays per side per plane', () => {
    const b = bridges.find((x) => x.id === 'cau-tu-lien');
    if (!b?.model3d || file.endsWith('.sample.json')) return; // the sample keeps an older record
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(m.spans_m).toEqual([250, 500, 250]);
    expect(b.span_arrangement).toBe('50 + 200 + 500 + 200 + 50 m');
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(24.5);
    expect(g.auxiliaryPiers).toEqual([50, 950]);
    expect(g.pylons.map((p) => p.x)).toEqual([250, 750]);
    expect(g.deckY(500)).toBeCloseTo(26.2, 1);
    expect(g.clearance?.height).toBe(10);
    // legs 0/1 cross at the centreline at y 62 and continue to the opposite post (2 is at −z, 3 at +z)
    const [l0, l1, l2, l3] = pc.legs.map((l) => l.centerline);
    expect(l0[5]).toEqual([0, 62, 0]);
    expect(l1[5]).toEqual([0, 62, 0]);
    expect(l0[0][2]).toBeLessThan(0);
    expect(l0[l0.length - 1]).toEqual(l3[0]);
    expect(l1[l1.length - 1]).toEqual(l2[0]);
    expect(l3[0][2] - l2[0][2]).toBeCloseTo(8.5, 5);
    expect(l2[l2.length - 1][1]).toBe(159.5);
    expect(l3[l3.length - 1][1]).toBe(150);
    expect(l3[l3.length - 1][1] / l2[l2.length - 1][1]).toBeCloseTo(0.94, 2);
    // knee half-spacing / (crossing − knee) ≈ 0.47; post c/c / knee spacing ≈ 0.13
    expect(33 / (62 - l0[2][1])).toBeCloseTo(0.47, 1);
    expect(Math.abs(l0[2][2])).toBe(33);
    for (const p of g.pylons) {
      expect(p.custom).toBe(true);
      expect(p.labelRef).toBe('total');
      expect(p.labelHeight).toBeGreaterThan(184.5);
      expect(p.labelHeight).toBeLessThan(186);
      expect(g.deckY(p.x)).toBeGreaterThan(25.5);
      expect(g.deckY(p.x)).toBeLessThan(26);
      expect(p.heightAboveDeck).toBeCloseTo(159.5, 0);
      expect(p.caps).toHaveLength(1);
      // under-deck crossbeam at the knees (8 m deep) and the short link at y 145
      const ys = p.members.map((mb) => (mb.a[1] + mb.b[1]) / 2 - g.deckY(p.x)).sort((a, c) => a - c);
      expect(ys).toHaveLength(2);
      expect(ys[0]).toBeCloseTo(-8.5, 0);
      expect(ys[1]).toBeCloseTo(145, 0);
      // 19 per side per plane, anchored 92–141 m on the posts; no stay crosses between the posts
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(19 * 2 * 2);
      for (const c of cs) {
        const y = c.top[1] - g.deckY(p.x);
        expect(y).toBeGreaterThan(91);
        expect(y).toBeLessThan(142);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
        expect(Math.abs(c.top[2])).toBeLessThan(7);
        expect(Math.abs(c.deck[2])).toBeGreaterThan(17);
      }
      // the back fan lands 28–244 m from the pylon (toward the unit end)
      const back = cs.filter((c) => Math.sign(c.deck[0] - p.x) !== Math.sign(500 - p.x));
      expect(back).toHaveLength(19 * 2);
      const d = back.map((c) => Math.abs(c.deck[0] - p.x));
      expect(Math.min(...d)).toBeCloseTo(28, 0);
      expect(Math.max(...d)).toBeCloseTo(244, 0);
    }
    expect(g.colours.pylon).toBe('#e8e0cc');
    expect(g.colours.stay).toBe('white');
  });

  it('Hòa Sơn (round 9): mountain-peak inverted Y, TEDI 7-span unit, light stays from the mast, deck 55, label 187', () => {
    const b = bridges.find((x) => x.id === 'cau-hoa-son');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(m.spans_m).toEqual([40, 40, 150, 550, 150, 40, 40]);
    expect(b.span_arrangement).toBe('40 + 40 + 150 + 550 + 150 + 40 + 40 m (main bridge 1,010 m)');
    expect(b.width_m).toBe(21);
    expect(b.lanes).toBe(4);
    expect(b.nav_clearance?.height_m).toBe(7);
    expect(b.nav_clearance?.width_m).toBe(50);
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(55);
    expect(g.auxiliaryPiers).toEqual([40, 80, 930, 970]);
    expect(g.pylons.map((p) => p.x)).toEqual([230, 780]);
    expect(g.colours.pylon).toBe('white');
    expect(g.colours.stay).toBe('#cfdbe6');
    // legs pass outside the 21 m deck at the deck (z ±14.5), merge at y 78 (≈0.59 of 132), mast 76–123, spire to 132
    const [l0, l1, mast, spire] = pc.legs.map((l) => l.centerline);
    expect(l0[4]).toEqual([0, -2, -14.5]);
    expect(l1[4]).toEqual([0, -2, 14.5]);
    expect(l0[l0.length - 1][1] / 132).toBeCloseTo(0.59, 2);
    expect(mast[0][1]).toBeLessThan(78);
    expect(spire[0]).toEqual(mast[mast.length - 1]);
    expect(pc.legs[3].width_top_m).toBeLessThan(1);
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      expect(p.custom).toBe(true);
      expect(p.labelRef).toBe('total');
      expect(p.heightAboveDeck).toBeCloseTo(132, 0);
      expect(Math.round(p.labelHeight)).toBe(187);
      expect(deck / p.labelHeight).toBeCloseTo(0.29, 1);
      expect(550 / p.heightAboveDeck).toBeCloseTo(4.2, 0);
      // 4 legs + 1 cup/stem panel, no crossbeams; one submerged pile cap
      expect(p.sweeps).toHaveLength(5);
      expect(p.members).toHaveLength(0);
      expect(p.caps).toHaveLength(1);
      // 22 per side per plane, two planes, all anchored on the mast faces 84–119 m above the deck (none below the merge)
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(22 * 2 * 2);
      for (const c of cs) {
        const y = c.top[1] - deck;
        expect(y).toBeGreaterThan(83);
        expect(y).toBeLessThan(120);
        expect(Math.abs(c.top[2])).toBeLessThan(5);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
        expect(Math.abs(c.deck[2])).toBeGreaterThan(8);
      }
      // the back fan lands 14–142 m behind the pylon, short of the anchor pier at 150 m
      const back = cs.filter((c) => Math.sign(c.deck[0] - p.x) !== Math.sign(505 - p.x));
      expect(back).toHaveLength(22 * 2);
      const d = back.map((c) => Math.abs(c.deck[0] - p.x));
      expect(Math.min(...d)).toBeCloseTo(14, 0);
      expect(Math.max(...d)).toBeCloseTo(142, 0);
    }
  });

  it('Ngọc Hồi (round 8): Sun Gate pylons, red inner posts + gate panel (G12/G13), split concrete legs on a cap, golden stays', () => {
    const b = bridges.find((x) => x.id === 'cau-ngoc-hoi');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    expect(m.spans_m).toEqual([165, 350, 165]);
    expect(b.width_m).toBe(38.3);
    expect(b.span_arrangement).toBe('165 + 350 + 165 m');
    expect(b.confidence).toBe('needs_check');
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(24.5);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([165, 515]);
    expect(g.colours.stay).toBe('#d4a24c');
    expect(g.colours.pylon).toBeUndefined();
    expect(m.colour_mode).toBe('vivid');
    expect(g.colours.vivid).toBe(true);
    // G14 is opt-in: only the listed bridges are vivid (the others render byte-identically)
    expect(bridges.filter((x) => x.model3d?.colour_mode === 'vivid').map((x) => x.id).sort()).toEqual(['cau-ngoc-hoi', 'cau-vam-cong']);
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      // ≈27.4 m deck at the pylons, tips 98.5 m above it, label 126 m
      expect(deck).toBeCloseTo(24.5 + 4 * (1 - (175 / 340) ** 2), 1);
      expect(p.heightAboveDeck).toBeCloseTo(98.5, 0);
      expect(Math.round(p.labelHeight)).toBe(126);
      // 4 post legs (2 red inner, 2 concrete outer) + 1 red gate panel; no crossbeams, 4 concrete struts
      expect(p.sweeps).toHaveLength(5);
      expect(p.sweeps.map((sw) => sw.colour)).toEqual(['#e06a3e', '#e06a3e', undefined, undefined, '#e06a3e']);
      expect(p.members).toHaveLength(4);
      expect(p.members.every((mb) => mb.colour === undefined && mb.size === 4.5)).toBe(true);
      // gate: top ≈ deck + 72 (above-deck y is lifted by the crest), soffit crown ≈ 23.2 m at the centreline
      const pn = p.sweeps[4].positions;
      const ys: number[] = [];
      const mid: number[] = [];
      for (let i = 0; i < pn.length; i += 3) {
        expect(Number.isFinite(pn[i]) && Number.isFinite(pn[i + 1]) && Number.isFinite(pn[i + 2])).toBe(true);
        ys.push(pn[i + 1] - deck);
        if (Math.abs(pn[i + 2]) < 1e-9) mid.push(pn[i + 1] - deck);
      }
      expect(Math.max(...ys)).toBeCloseTo(72, 0);
      expect(Math.min(...ys)).toBeCloseTo(0, 0);
      expect(Math.min(...mid)).toBeCloseTo(23.2, 0);
      expect(Math.max(...mid)).toBeCloseTo(27.9, 0);
      // feet of the split legs on the 24 × 50 m cap, ≈1 m above the water
      const feet = p.members.map((mb) => (mb.a[1] < mb.b[1] ? mb.a : mb.b));
      expect(feet.every((f) => Math.abs(Math.abs(f[0] - p.x) - 8) < 1e-6 && f[1] > 0 && f[1] < 2)).toBe(true);
      expect(p.caps).toHaveLength(1);
      // 16 per side per plane, two planes, anchored ≈36–87 m above the deck on the red inner legs (|z| = 20.25)
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(16 * 2 * 2);
      for (const c of cs) {
        expect(c.top[1] - deck).toBeGreaterThan(35);
        expect(c.top[1] - deck).toBeLessThan(88);
        expect(Math.abs(Math.abs(c.top[2]) - 20.25)).toBeLessThan(2);
      }
    }
    // the gate panel is inside the unit bounds (bounds include every sweep)
    expect(g.bounds.max[1]).toBeGreaterThan(g.deckY(165) + 98);
  });

  it('Vàm Cống (round 9): improved-H pylons, arched upper beam + haunched under-deck beam (G13), cap, 147 m, blue vivid stays', () => {
    const b = bridges.find((x) => x.id === 'cau-vam-cong');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(m.spans_m).toEqual([210, 450, 210]);
    expect(m.auxiliary_piers_m).toBeUndefined();
    expect(b.width_m).toBe(24.5);
    expect(b.notes).toContain('GS E&C');
    expect(b.nav_clearance?.height_m).toBe(37.5);
    expect(pc.crossbeams_y_m).toBeUndefined();
    expect(pc.panels).toHaveLength(2);
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(33);
    expect(g.deckDepth).toBe(2.5);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([210, 660]);
    expect(g.deckY(435)).toBeCloseTo(41.5, 5);
    expect(g.colours.stay).toBe('#3b7fd4');
    expect(g.colours.vivid).toBe(true);
    // legs converge above the deck: c/c at the upper beam (11.5) ≈ 0.35 × c/c at deck level; feet ≈ 1.43 × it
    const [l0] = pc.legs.map((l) => l.centerline);
    const zAt = (y: number) => {
      for (let i = 1; i < l0.length; i++) {
        const [, y0, z0] = l0[i - 1];
        const [, y1, z1] = l0[i];
        if (y >= y0 && y <= y1) return Math.abs(z0 + ((z1 - z0) * (y - y0)) / (y1 - y0));
      }
      throw new Error(`y ${y} outside the leg`);
    };
    expect(zAt(78) / zAt(0)).toBeGreaterThan(0.33);
    expect(zAt(78) / zAt(0)).toBeLessThan(0.4);
    expect(zAt(-30.5) / zAt(0)).toBeCloseTo(1.43, 1);
    expect(zAt(95)).toBe(5.75); // vertical posts
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      // ≈39.2 m deck at the pylons, tips 107.8 m above it, label 147 m (no scale_y)
      expect(deck).toBeCloseTo(33 + 8.5 * (1 - (225 / 435) ** 2), 5);
      expect(p.heightAboveDeck).toBeCloseTo(107.8, 1);
      expect(Math.round(p.labelHeight)).toBe(147);
      expect(p.custom).toBe(true);
      // 2 legs + 2 panels, no straight crossbeams
      expect(p.sweeps).toHaveLength(4);
      expect(p.members).toHaveLength(0);
      const ysOf = (sw: { positions: ArrayLike<number> }) => {
        const ys: number[] = [];
        const mid: number[] = [];
        const pn = sw.positions;
        for (let i = 0; i < pn.length; i += 3) {
          expect(Number.isFinite(pn[i]) && Number.isFinite(pn[i + 1]) && Number.isFinite(pn[i + 2])).toBe(true);
          ys.push(pn[i + 1] - deck);
          if (Math.abs(pn[i + 2]) < 1e-9) mid.push(pn[i + 1] - deck);
        }
        return { ys, mid };
      };
      // upper beam: flat top at 84, round-arched soffit 75 at the legs → 80.4 at the crown
      const up = ysOf(p.sweeps[2]);
      expect(Math.max(...up.ys)).toBeCloseTo(84, 0);
      expect(Math.min(...up.ys)).toBeCloseTo(75, 0);
      expect(Math.min(...up.mid)).toBeCloseTo(80.4, 0);
      // under-deck beam: top just under the girder, haunched soffit −12 at the legs (below-deck y stretched by 1 + crest/E)
      const s = 1 + (deck - 33) / 33;
      const lo = ysOf(p.sweeps[3]);
      expect(Math.max(...lo.ys)).toBeCloseTo(-2.5 * s, 0);
      expect(Math.min(...lo.ys)).toBeCloseTo(-12 * s, 0);
      expect(Math.max(...lo.mid)).toBeCloseTo(-2.5 * s, 0);
      expect(Math.min(...lo.mid)).toBeCloseTo(-6.7 * s, 0);
      // a rectangular cap standing ≈3 m proud of the water
      expect(p.caps).toHaveLength(1);
      const cap = ysOf(p.caps[0]);
      expect(Math.max(...cap.ys) + deck).toBeCloseTo(3, 0);
      // 18 per side per plane (144 stays in all), anchored 48–104 m on the legs/posts, outboard of the deck
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(18 * 2 * 2);
      for (const c of cs) {
        expect(c.top[1] - deck).toBeGreaterThan(47);
        expect(c.top[1] - deck).toBeLessThan(105);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
        expect(Math.abs(c.top[2])).toBeLessThan(Math.abs(c.deck[2]));
      }
      // the back fan lands 12–204 m from the pylon (toward the unit end)
      const back = cs.filter((c) => Math.sign(c.deck[0] - p.x) !== Math.sign(435 - p.x));
      expect(back).toHaveLength(18 * 2);
      const d = back.map((c) => Math.abs(c.deck[0] - p.x));
      expect(Math.min(...d)).toBeCloseTo(12, 0);
      expect(Math.max(...d)).toBeCloseTo(204, 0);
    }
  });

  it('Mỹ Thuận (round 10): H legs leaning in to one arched upper beam, posts above, under-deck beam, stadium cap, crested deck, 121 m', () => {
    const b = bridges.find((x) => x.id === 'cau-my-thuan');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(m.spans_m).toEqual([150, 350, 150]);
    expect(m.auxiliary_piers_m).toBeUndefined();
    expect(m.colour_mode).toBeUndefined();
    expect(b.nav_clearance?.height_m).toBe(37.5);
    expect(b.nav_clearance?.width_m).toBe(110);
    expect(b.notes).toContain('Baulderstone');
    expect(pc.crossbeams_y_m).toBeUndefined();
    expect(pc.panels).toHaveLength(2);
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(30);
    expect(g.deckDepth).toBe(1.8);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([150, 500]);
    // deck 30 at the unit ends, 40.5 at mid-span (≥ 37.5 + 1.8 + 1, so no raise)
    expect(g.deckY(0)).toBeCloseTo(30, 5);
    expect(g.deckY(650)).toBeCloseTo(30, 5);
    expect(g.deckY(325)).toBeCloseTo(40.5, 5);
    expect(g.colours.stay).toBe('#7aa6cc');
    expect(g.colours.pylon).toBe('#dcd6c8');
    expect(g.colours.vivid).toBeFalsy();
    // legs lean in: c/c at the upper beam ≈ 0.70 × c/c at deck level, foot ≈ 1.2 ×, posts near-vertical at ±9.5–9.7
    const [l0] = pc.legs.map((l) => l.centerline);
    const zAt = (y: number) => {
      for (let i = 1; i < l0.length; i++) {
        const [, y0, z0] = l0[i - 1];
        const [, y1, z1] = l0[i];
        if (y >= y0 && y <= y1) return Math.abs(z0 + ((z1 - z0) * (y - y0)) / (y1 - y0));
      }
      throw new Error(`y ${y} outside the leg`);
    };
    expect(zAt(43) / zAt(0)).toBeGreaterThan(0.66);
    expect(zAt(43) / zAt(0)).toBeLessThan(0.74);
    expect(zAt(-26.4) / zAt(0)).toBeCloseTo(1.22, 1);
    expect(zAt(46.5) - zAt(83.5)).toBeLessThan(0.3);
    expect(zAt(83.5)).toBe(9.5);
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      // ≈37.46 m deck at the pylons, tips 83.5 m above it, label 121 m
      expect(deck).toBeCloseTo(30 + 10.5 * (1 - (175 / 325) ** 2), 5);
      expect(p.heightAboveDeck).toBeCloseTo(83.5, 1);
      expect(Math.round(p.labelHeight)).toBe(121);
      expect(p.custom).toBe(true);
      // 2 legs + 2 panels, no straight crossbeams
      expect(p.sweeps).toHaveLength(4);
      expect(p.members).toHaveLength(0);
      const ysOf = (sw: { positions: ArrayLike<number> }) => {
        const ys: number[] = [];
        const mid: number[] = [];
        const pn = sw.positions;
        for (let i = 0; i < pn.length; i += 3) {
          expect(Number.isFinite(pn[i]) && Number.isFinite(pn[i + 1]) && Number.isFinite(pn[i + 2])).toBe(true);
          ys.push(pn[i + 1] - deck);
          if (Math.abs(pn[i + 2]) < 1e-9) mid.push(pn[i + 1] - deck);
        }
        return { ys, mid };
      };
      // upper beam: flat top 45.5, soffit 40.6 at the legs → 41.6 at the crown
      const up = ysOf(p.sweeps[2]);
      expect(Math.max(...up.ys)).toBeCloseTo(45.5, 0);
      expect(Math.min(...up.ys)).toBeCloseTo(40.6, 0);
      expect(Math.min(...up.mid)).toBeCloseTo(41.6, 0);
      // under-deck beam: top −1.6, haunched soffit −6.8 → −5.8 (below-deck y stretched by 1 + crest/E)
      const s = 1 + (deck - 30) / 30;
      const lo = ysOf(p.sweeps[3]);
      expect(Math.max(...lo.ys)).toBeCloseTo(-1.6 * s, 0);
      expect(Math.min(...lo.ys)).toBeCloseTo(-6.8 * s, 0);
      expect(Math.min(...lo.mid)).toBeCloseTo(-5.8 * s, 0);
      // a stadium cap standing ≈4.5 m proud of the water
      expect(p.caps).toHaveLength(1);
      const cap = ysOf(p.caps[0]);
      expect(Math.max(...cap.ys) + deck).toBeCloseTo(4.5, 0);
      // 16 per side per plane (128 stays in all), anchored 47–79 m on the posts, inboard of the deck edges
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(16 * 2 * 2);
      for (const c of cs) {
        expect(c.top[1] - deck).toBeGreaterThan(46.5);
        expect(c.top[1] - deck).toBeLessThan(79.5);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
        expect(Math.abs(c.top[2])).toBeLessThan(Math.abs(c.deck[2]));
      }
      // the back fan lands 10.5–149 m from the pylon (toward the unit end)
      const back = cs.filter((c) => Math.sign(c.deck[0] - p.x) !== Math.sign(325 - p.x));
      expect(back).toHaveLength(16 * 2);
      const d = back.map((c) => Math.abs(c.deck[0] - p.x));
      expect(Math.min(...d)).toBeCloseTo(10.5, 0);
      expect(Math.max(...d)).toBeCloseTo(149, 0);
    }
  });

  it('Phước An (round 9): closed deck while under construction (G16), giọt-nước arch on a cap, 12 semi-fan stays 24–105 m (G15)', () => {
    const b = bridges.find((x) => x.id === 'cau-phuoc-an');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    expect(b.status).toBe('under_construction');
    expect(m.deck_closed).toBe(true);
    expect(m.pylon_custom!.crown).toBe('pointed');
    expect(b.span_arrangement).toBe('137.5 + 250 + 137.5 m');
    const g = buildBridgeGeometry(m, b.status, { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    // G16: one full-length deck, no travellers, status kept
    expect(g.status).toBe('under_construction');
    expect(g.deckSegments).toEqual([{ x0: 0, x1: 525 }]);
    expect(g.travellers).toHaveLength(0);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([137.5, 387.5]);
    // deck 54 at the ends, ≈59 at the pylons, 60.5 at mid-span (clears 55 m, no raise)
    expect(g.deckElevation).toBe(54);
    expect(g.deckY(262.5)).toBeCloseTo(60.5, 6);
    expect(g.colours.pylon).toBe('#e9e7e1');
    expect(g.colours.stay).toBe('white');
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      expect(deck).toBeCloseTo(59.03, 1);
      expect(p.heightAboveDeck).toBeCloseTo(60, 0);
      expect(Math.round(p.labelHeight)).toBe(119);
      // 2 legs + the solid-tip panel; one strut below the deck; the legs stand on the cap ≈2 m above the water
      expect(p.sweeps).toHaveLength(3);
      expect(p.members).toHaveLength(1);
      expect(p.members[0].a[1]).toBeLessThan(deck - 20);
      expect(p.caps).toHaveLength(1);
      let low = Infinity;
      for (const sw of p.sweeps.slice(0, 2)) for (let i = 1; i < sw.positions.length; i += 3) low = Math.min(low, sw.positions[i]);
      expect(low).toBeGreaterThan(0);
      expect(low).toBeLessThan(4);
      // 12 per side per plane, 2 planes, anchored 18–42 m above the deck, deck anchors 24–105 m from the pylon
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(12 * 2 * 2);
      for (const c of cs) {
        const y = c.top[1] - g.deckY(c.top[0]);
        expect(y).toBeGreaterThan(17);
        expect(y).toBeLessThan(43);
        const d = Math.abs(c.deck[0] - p.x);
        expect(d).toBeGreaterThan(24 - 1e-6);
        expect(d).toBeLessThan(105 + 1e-6);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
      }
    }
    // the centre of the main span is unstayed: 250 − 2 × 105 = 40 m between the outermost main stays
    const mainXs = g.cables.filter((c) => !c.back).map((c) => c.deck[0]);
    expect(Math.min(...mainXs.filter((x) => x > 262.5)) - Math.max(...mainXs.filter((x) => x < 262.5))).toBeCloseTo(40, 6);
    // G15/G16 are opt-in: G16 deck_closed only Phước An; G15 main_stay_deck_m Phước An, Cát Lái and Thuận An (r10)
    expect(bridges.filter((x) => x.model3d?.deck_closed).map((x) => x.id)).toEqual(['cau-phuoc-an']);
    expect(bridges.filter((x) => x.model3d?.main_stay_deck_m).map((x) => x.id).sort()).toEqual(['cau-cat-lai', 'cau-phuoc-an', 'cau-thuan-an']);
  });

  it('Cát Lái (round 10): TEDI "giọt nước" pylon straddling the 33.5 m deck, loop below, two separate tips, 22 semi-fan stays', () => {
    const b = bridges.find((x) => x.id === 'cau-cat-lai');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(b.status).toBe('under_construction');
    expect(m.deck_closed).toBeUndefined();
    expect(pc.crown).toBeUndefined();
    expect(pc.crossbeams_y_m).toBeUndefined();
    expect(b.width_m).toBe(33.5);
    expect(b.span_arrangement).toBe('190 + 450 + 190 m');
    expect(b.pylons_en).toContain('water drop');
    expect(b.pylons_en).not.toMatch(/rounded|twin swords/);
    // legs stand outside the deck edges (±16.75) at deck level, bow out to ±22 below it, end in separate tips at ±7.2
    for (const leg of pc.legs) {
      const at0 = leg.centerline.find((p) => p[1] === 0)!;
      expect(Math.abs(at0[2])).toBeGreaterThanOrEqual(17);
      expect(Math.max(...leg.centerline.filter((p) => p[1] < 0).map((p) => Math.abs(p[2])))).toBe(22);
      expect(leg.centerline[leg.centerline.length - 1]).toEqual([0, 117, Math.sign(at0[2]) * 7.2]);
    }
    const g = buildBridgeGeometry(m, b.status, { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    const full = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(full.warnings).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([190, 640]);
    expect(g.auxiliaryPiers).toEqual([70, 760]);
    expect(g.deckElevation).toBe(50);
    expect(g.deckY(415)).toBeCloseTo(61, 6);
    expect(g.colours.stay).toBe('white');
    // under construction: balanced cantilevers, not a closed deck
    expect(g.travellers.length).toBeGreaterThan(0);
    for (const p of g.pylons) {
      expect(g.deckY(p.x)).toBeCloseTo(57.77, 1);
      expect(Math.round(p.labelHeight)).toBe(175);
      // 2 legs + 4 panels (under-deck arch beam, waist web, top link, base knot); no straight crossbeam; one plinth
      expect(p.sweeps).toHaveLength(6);
      expect(p.members).toHaveLength(0);
      expect(p.caps).toHaveLength(1);
      // stays only on the built cantilevers; the completed bridge has 22 per side per plane, 2 planes,
      // back stays 22–186 m and main stays 22–218 m from the pylon
      const built = g.cables.filter((c) => c.pylon === p.index);
      expect(built.length).toBeGreaterThan(0);
      expect(built.length).toBeLessThan(22 * 2 * 2);
      const cs = full.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(22 * 2 * 2);
      for (const c of cs) {
        const d = Math.abs(c.deck[0] - p.x);
        expect(d).toBeGreaterThan(22 - 1e-6);
        expect(d).toBeLessThan((c.back ? 186 : 218) + 1e-6);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
      }
    }
  });

  it('Phú Mỹ (round 10): modified-H pylons splayed to a cap, haunched upper beam + box under-deck beam (G13), crest, 139 m, grey stays', () => {
    const b = bridges.find((x) => x.id === 'cau-phu-my');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    const pc = m.pylon_custom!;
    expect(m.spans_m).toEqual([162.5, 380, 162.5]);
    expect(m.auxiliary_piers_m).toBeUndefined();
    expect(b.width_m).toBe(27.5);
    expect(m.deck_width_m).toBe(27.5);
    expect(b.construction_start).toBe(2005);
    expect(b.nav_clearance?.height_m).toBe(45);
    expect(b.nav_clearance?.width_m).toBe(250);
    expect(pc.crossbeams_y_m).toBeUndefined();
    expect(pc.panels).toHaveLength(2);
    const g = buildBridgeGeometry(m, 'completed', { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.deckElevation).toBe(40.8);
    expect(g.deckDepth).toBe(2.5);
    expect(g.auxiliaryPiers).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([162.5, 542.5]);
    expect(g.deckY(352.5)).toBeCloseTo(48.8, 5);
    expect(g.colours.stay).toBe('#7a7f85');
    expect(g.colours.vivid).toBeFalsy();
    // modified H: feet ≈ 1.3 × the deck c/c, tips ≈ 0.8 × it, with a kink at the deck
    const [l0] = pc.legs.map((l) => l.centerline);
    const zAt = (y: number) => {
      for (let i = 1; i < l0.length; i++) {
        const [, y0, z0] = l0[i - 1];
        const [, y1, z1] = l0[i];
        if (y >= y0 && y <= y1) return Math.abs(z0 + ((z1 - z0) * (y - y0)) / (y1 - y0));
      }
      throw new Error(`y ${y} outside the leg`);
    };
    expect(zAt(-36.9) / zAt(0)).toBeGreaterThan(1.25);
    expect(zAt(-36.9) / zAt(0)).toBeLessThan(1.35);
    expect(zAt(92.5) / zAt(0)).toBeGreaterThan(0.76);
    expect(zAt(92.5) / zAt(0)).toBeLessThan(0.84);
    const slopeBelow = (zAt(-3) - zAt(-36.9)) / 33.9;
    const slopeAbove = (zAt(92.5) - zAt(3)) / 89.5;
    expect(slopeBelow).toBeLessThan(-0.1); // splays outward going down
    expect(slopeAbove).toBeLessThan(0); // leans gently inward going up
    expect(Math.abs(slopeAbove)).toBeLessThan(Math.abs(slopeBelow) / 3); // kink at the deck
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      // ≈46.5 m deck at the pylons, tips 92.5 m above it, label 139 m (no scale_y)
      expect(deck).toBeCloseTo(40.8 + 8 * (1 - (190 / 352.5) ** 2), 5);
      expect(deck).toBeCloseTo(46.5, 0);
      expect(p.heightAboveDeck).toBeCloseTo(92.5, 0);
      expect(Math.round(p.labelHeight)).toBe(139);
      expect(p.custom).toBe(true);
      // 2 legs + 2 panels, no straight crossbeams
      expect(p.sweeps).toHaveLength(4);
      expect(p.members).toHaveLength(0);
      const ysOf = (sw: { positions: ArrayLike<number> }) => {
        const ys: number[] = [];
        const mid: number[] = [];
        const pn = sw.positions;
        for (let i = 0; i < pn.length; i += 3) {
          expect(Number.isFinite(pn[i]) && Number.isFinite(pn[i + 1]) && Number.isFinite(pn[i + 2])).toBe(true);
          ys.push(pn[i + 1] - deck);
          if (Math.abs(pn[i + 2]) < 1e-9) mid.push(pn[i + 1] - deck);
        }
        return { ys, mid };
      };
      // upper beam: top 59.5 (fillets to 63 at the legs), haunched soffit 44 at the legs → 51.2 at the crown
      const up = ysOf(p.sweeps[2]);
      expect(Math.max(...up.ys)).toBeCloseTo(63, 0);
      expect(Math.min(...up.ys)).toBeCloseTo(44, 0);
      expect(Math.min(...up.mid)).toBeCloseTo(51.2, 0);
      expect(Math.max(...up.mid)).toBeCloseTo(59.5, 0);
      // under-deck box beam: top just under the girder, bottom ≈9.4 m below the deck (below-deck y stretched by 1 + crest/E)
      const s = 1 + (deck - 40.8) / 40.8;
      const lo = ysOf(p.sweeps[3]);
      expect(Math.max(...lo.ys)).toBeCloseTo(-2.2 * s, 0);
      expect(Math.min(...lo.ys)).toBeCloseTo(-9.5 * s, 0);
      expect(Math.min(...lo.mid)).toBeCloseTo(-8.2 * s, 0);
      // a rectangular cap standing ≈4.5 m proud of the water
      expect(p.caps).toHaveLength(1);
      const cap = ysOf(p.caps[0]);
      expect(Math.max(...cap.ys) + deck).toBeCloseTo(4.5, 0);
      // 18 per side per plane (144 stays in all), anchored 46–90 m on the legs, in near-vertical planes on the deck edges
      const cs = g.cables.filter((c) => c.pylon === p.index);
      expect(cs).toHaveLength(18 * 2 * 2);
      for (const c of cs) {
        expect(c.top[1] - deck).toBeGreaterThan(45);
        expect(c.top[1] - deck).toBeLessThan(91);
        expect(Math.sign(c.top[2])).toBe(Math.sign(c.deck[2]));
        expect(Math.abs(Math.abs(c.top[2]) - Math.abs(c.deck[2]))).toBeLessThan(2.5);
      }
    }
  });

  it('Thuận An (round 10): longitudinal A median shaft, twin wall piers on a cap, 17 semi-fan stays 26–89 m, haunched girder (G17)', () => {
    const b = bridges.find((x) => x.id === 'cau-thuan-an');
    if (!b?.model3d?.pylon_custom || file.endsWith('.sample.json')) return;
    const m = b.model3d;
    expect(b.status).toBe('completed');
    expect(m.deck_closed).toBeUndefined();
    expect(b.span_arrangement).toBe('120 + 218 + 120 m');
    expect(b.nav_clearance?.height_m).toBe(40);
    expect(m.deck_haunch).toEqual({ depth_at_pylon_m: 9.5, length_m: 85 });
    const g = buildBridgeGeometry(m, b.status, { navClearance: b.nav_clearance })!;
    expect(g.warnings).toEqual([]);
    expect(g.pylons.map((p) => p.x)).toEqual([120, 338]);
    // deck 40.5 at the unit ends (not raised by the 40 m clearance), ≈44.4 at the pylons, 45.5 at mid-span
    expect(g.deckElevation).toBe(40.5);
    expect(g.deckY(229)).toBeCloseTo(45.5, 6);
    expect(g.deckY(229) - g.deckDepthAt(229)).toBeGreaterThanOrEqual(40 + 1);
    expect(g.colours.pylon).toBe('white');
    expect(g.colours.stay).toBe('red');
    for (const p of g.pylons) {
      const deck = g.deckY(p.x);
      expect(deck).toBeCloseTo(44.37, 1);
      // G17: 9.5 m deep at the pier, 4 m by 85 m out
      expect(g.deckDepthAt(p.x)).toBeCloseTo(9.5, 6);
      expect(g.deckDepthAt(p.x + 85)).toBeCloseTo(4, 6);
      // pylon 27.5 m above the deck, tip ≈72 m above the water; pylon : deck-above-water ≈0.62
      expect(p.heightAboveDeck).toBeCloseTo(27.5, 6);
      let tip = -Infinity;
      for (const sw of p.sweeps) for (let i = 1; i < sw.positions.length; i += 3) tip = Math.max(tip, sw.positions[i]);
      expect(tip).toBeCloseTo(71.9, 0);
      expect(p.heightAboveDeck / deck).toBeGreaterThan(0.55);
      expect(p.heightAboveDeck / deck).toBeLessThan(0.7);
      // whole shaft (A legs + walls) on the centreline, narrow across: no legs at the deck edges
      for (const sw of p.sweeps) for (let i = 2; i < sw.positions.length; i += 3) expect(Math.abs(sw.positions[i])).toBeLessThanOrEqual(4 + 1e-6);
      // the pile cap shows ≈4 m above the water
      expect(p.caps).toHaveLength(1);
      let capTop = -Infinity;
      for (let i = 1; i < p.caps[0].positions.length; i += 3) capTop = Math.max(capTop, p.caps[0].positions[i]);
      expect(capTop).toBeGreaterThan(3);
      expect(capTop).toBeLessThan(5.5);
      // 17 stays per side in one central plane, deck anchors 26–89 m from the pylon, pylon anchors 6.9–20.1 m above the deck
      const own = g.cables.filter((c) => c.pylon === p.index);
      expect(own.filter((c) => c.back)).toHaveLength(17);
      expect(own.filter((c) => !c.back)).toHaveLength(17);
      for (const c of own) {
        expect(Math.abs(c.deck[2])).toBeLessThan(1e-6);
        const d = Math.abs(c.deck[0] - p.x);
        expect(d).toBeGreaterThan(26 - 1e-6);
        expect(d).toBeLessThan(89 + 1e-6);
        expect(c.top[1] - deck).toBeGreaterThan(6.9 - 0.5);
        expect(c.top[1] - deck).toBeLessThan(20.1 + 0.5);
      }
    }
    // ≈40 m of the main span unstayed: 218 − 2 × 89
    const mainXs = g.cables.filter((c) => !c.back).map((c) => c.deck[0]);
    expect(Math.min(...mainXs.filter((x) => x > 229)) - Math.max(...mainXs.filter((x) => x < 229))).toBeCloseTo(40, 6);
    expect(JSON.stringify(m)).not.toContain('king-post');
  });

  it('pylon_custom has only schema keys (incl. G12 colours and G13 panels)', () => {
    const PC = new Set(['description', 'legs', 'crossbeams_y_m', 'crossbeam_depth_m', 'crown', 'struts', 'panels', 'pile_cap', 'anchor_zone', 'mirror_for_other_pylons', 'reference_images']);
    const LEG = new Set(['centerline', 'width_base_m', 'width_top_m', 'depth_base_m', 'depth_top_m', 'twist_deg', 'colour']);
    const STRUT = new Set(['a', 'b', 'width', 'colour']);
    const PANEL = new Set(['top', 'bottom', 'depth_m', 'x_m', 'colour']);
    for (const b of bridges) {
      const pc = b.model3d?.pylon_custom;
      if (!pc) continue;
      for (const k of Object.keys(pc)) expect(PC.has(k), `${b.id}: ${k}`).toBe(true);
      for (const l of pc.legs) for (const k of Object.keys(l)) expect(LEG.has(k), `${b.id}: legs.${k}`).toBe(true);
      for (const s of pc.struts ?? []) for (const k of Object.keys(s)) expect(STRUT.has(k), `${b.id}: struts.${k}`).toBe(true);
      for (const s of pc.panels ?? []) for (const k of Object.keys(s)) expect(PANEL.has(k), `${b.id}: panels.${k}`).toBe(true);
    }
  });

  it('model3d has only schema keys, and harp bridges draw parallel stays (within 2°)', () => {
    const KEYS = new Set([
      'spans_m', 'pylon_shape', 'pylon_heights_m', 'pylon_height_ref', 'cable_planes', 'cable_pattern', 'cables_per_side',
      'deck_width_m', 'deck_type', 'approach_length_m', 'extradosed', 'deck_plan_radius_m', 'deck_crest_m', 'deck_elevation_m',
      'auxiliary_piers_m', 'pylon_colour', 'stay_colour', 'back_stay_colour', 'deck_colour', 'back_stay_planes', 'back_stay_count', 'back_stay_deck_m', 'main_stay_deck_m', 'deck_closed', 'deck_section', 'deck_haunch',
      'deck_depth_m', 'colour_mode', 'pylon_custom', 'confidence', 'notes',
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

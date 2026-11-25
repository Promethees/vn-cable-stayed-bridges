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

  it('custom pylons: every stay anchors on a swept leg (incl. Long Hưng leg 2 on the split-foot mast)', () => {
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
        expect(pc.anchor_zone[0].leg).toBe(2);
        expect(g.cables.length).toBeGreaterThan(0);
        // anchors sit on the mast (leg 2), i.e. on the centreline, above the split foot
        expect(g.cables.every((c) => Math.abs(c.top[2]) < 1e-6 && c.top[1] > g.deckElevation + 15)).toBe(true);
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
  });

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
});

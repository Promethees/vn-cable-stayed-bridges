import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildBridgeGeometry } from './bridge3d';
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

  it('cards with only link-only photos do not open on an empty photo tab', () => {
    for (const b of bridges) {
      if (b.images.length && b.images.every((i) => i.license.trim().toLowerCase() === 'unknown') && b.model3d)
        expect(defaultView(b), b.id).toBe('diagram');
    }
  });
});

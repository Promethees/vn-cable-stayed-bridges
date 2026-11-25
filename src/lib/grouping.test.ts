import { describe, expect, it, vi } from 'vitest';
import type { Bridge, Status, Usage } from '../types';
import { countByUsage, filterBridges, filterByStatus, groupByProvince } from './grouping';
import { parseBridges } from './validate';

const mk = (
  id: string,
  province: string,
  status: Status,
  lat: number,
  lng: number,
  extra: Partial<Bridge> = {},
): Bridge => ({
  id,
  name_vi: id,
  status,
  structure_type: 'cable_stayed',
  usage: ['road'],
  province,
  roads: [],
  main_span_m: 300,
  lat,
  lng,
  images: [],
  sources: [],
  confidence: 'verified',
  ...extra,
});

const data = [
  mk('a', 'Cần Thơ', 'completed', 10, 105),
  mk('b', 'Cần Thơ', 'planned', 12, 107, { usage: ['road', 'rail'] }),
  mk('c', 'Hồ Chí Minh', 'under_construction', 10.7, 106.7, { usage: ['metro'] }),
  mk('d', 'Hà Nội', 'planned', 21, 105.8, { usage: ['pedestrian'] }),
];
const all = new Set<Status>(['completed', 'under_construction', 'planned']);
const allUsage = new Set<Usage>(['road', 'rail', 'metro']);

describe('groupByProvince', () => {
  it('groups by province with count, status split, centroid and bounds, sorted north to south', () => {
    const groups = groupByProvince(data);
    expect(groups.map((g) => [g.province, g.count])).toEqual([
      ['Hà Nội', 1],
      ['Cần Thơ', 2],
      ['Hồ Chí Minh', 1],
    ]);
    const ct = groups[1];
    expect(ct.slug).toBe('can-tho');
    expect(ct.byStatus).toEqual({ completed: 1, under_construction: 0, planned: 1 });
    expect(ct.lat).toBeCloseTo(11);
    expect(ct.lng).toBeCloseTo(106);
    expect(ct.bounds).toEqual([
      [10, 105],
      [12, 107],
    ]);
  });
  it('returns empty for no bridges', () => {
    expect(groupByProvince([])).toEqual([]);
  });
});

describe('filtering', () => {
  it('filterByStatus keeps only active statuses', () => {
    expect(filterByStatus(data, new Set<Status>(['planned', 'completed'])).map((b) => b.id)).toEqual(['a', 'b', 'd']);
    expect(filterByStatus(data, new Set<Status>())).toEqual([]);
  });
  it('usage filter: any active usage matches; pedestrian-only always passes', () => {
    const ids = (u: Usage[]) => filterBridges(data, all, new Set(u)).map((b) => b.id);
    expect(ids(['rail'])).toEqual(['b', 'd']);
    expect(ids(['metro'])).toEqual(['c', 'd']);
    expect(ids([])).toEqual(['d']);
    expect(ids([...allUsage])).toEqual(['a', 'b', 'c', 'd']);
  });
  it('feeds grouping (filtered counts)', () => {
    const groups = groupByProvince(filterBridges(data, new Set<Status>(['planned']), new Set<Usage>(['road'])));
    expect(groups.map((g) => [g.province, g.count])).toEqual([
      ['Hà Nội', 1],
      ['Cần Thơ', 1],
    ]);
  });
  it('countByUsage counts each usage of combined bridges', () => {
    expect(countByUsage(data)).toEqual({ road: 2, rail: 1, metro: 1, pedestrian: 1 });
  });
});

describe('parseBridges', () => {
  it('drops spans <= 150, invalid entries and duplicates with a warning', () => {
    const warn = vi.fn();
    const out = parseBridges([data[0], mk('short', 'X', 'completed', 1, 1, { main_span_m: 150 }), { id: 'bad' }, data[0]], warn);
    expect(out.map((b) => b.id)).toEqual(['a']);
    expect(warn.mock.calls.filter(([m]) => String(m).includes('dropping'))).toHaveLength(3);
  });
  it('rejects bad structure_type / usage / railways', () => {
    const warn = vi.fn();
    const bad = [
      { ...data[0], id: 'x1', structure_type: 'suspension' },
      { ...data[0], id: 'x2', usage: ['boat'] },
      { ...data[0], id: 'x3', railways: 'Bắc–Nam' },
    ];
    expect(parseBridges(bad, warn)).toEqual([]);
  });
  it('defaults missing structure_type / usage for older data', () => {
    const { structure_type: _s, usage: _u, ...old } = data[0];
    void _s;
    void _u;
    const [b] = parseBridges([old], () => {});
    expect(b.structure_type).toBe('cable_stayed');
    expect(b.usage).toEqual(['road']);
  });
});

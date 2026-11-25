import { describe, expect, it, vi } from 'vitest';
import type { Bridge, Status } from '../types';
import { filterByStatus, groupByProvince } from './grouping';
import { parseBridges } from './validate';

const mk = (id: string, province: string, status: Status, lat: number, lng: number, span = 300): Bridge => ({
  id,
  name_vi: id,
  status,
  province,
  roads: [],
  main_span_m: span,
  lat,
  lng,
  images: [],
  sources: [],
  confidence: 'verified',
});

const data = [
  mk('a', 'Cần Thơ', 'completed', 10, 105),
  mk('b', 'Cần Thơ', 'planned', 12, 107),
  mk('c', 'Hồ Chí Minh', 'under_construction', 10.7, 106.7),
];

describe('groupByProvince', () => {
  it('groups by province with count, centroid and bounds', () => {
    const groups = groupByProvince(data);
    expect(groups.map((g) => [g.province, g.count])).toEqual([
      ['Cần Thơ', 2],
      ['Hồ Chí Minh', 1],
    ]);
    const ct = groups[0];
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

describe('filterByStatus', () => {
  it('keeps only active statuses', () => {
    expect(filterByStatus(data, new Set<Status>(['planned', 'completed'])).map((b) => b.id)).toEqual(['a', 'b']);
    expect(filterByStatus(data, new Set<Status>())).toEqual([]);
  });
  it('feeds grouping (filtered counts)', () => {
    const groups = groupByProvince(filterByStatus(data, new Set<Status>(['completed'])));
    expect(groups).toHaveLength(1);
    expect(groups[0].count).toBe(1);
  });
});

describe('parseBridges', () => {
  it('drops spans <= 150, invalid entries and duplicates with a warning', () => {
    const warn = vi.fn();
    const out = parseBridges([data[0], mk('short', 'X', 'completed', 1, 1, 150), { id: 'bad' }, data[0]], warn);
    expect(out.map((b) => b.id)).toEqual(['a']);
    expect(warn).toHaveBeenCalledTimes(3);
  });
});

import { FILTER_USAGES, type Bridge, type Status, type Usage } from '../types';
import { findProvince, provinceSlug, splitProvinces } from './provinces';

export interface ProvinceGroup {
  province: string;
  slug: string;
  bridges: Bridge[];
  count: number;
  byStatus: Record<Status, number>;
  /** dot anchor: fixed province anchor (src/lib/provinces.ts), else centroid of its bridges */
  lat: number;
  lng: number;
  /** [[south, west], [north, east]] of the province's bridges */
  bounds: [[number, number], [number, number]];
}

export function filterByStatus(bridges: Bridge[], statuses: ReadonlySet<Status>): Bridge[] {
  return bridges.filter((b) => statuses.has(b.status));
}

/** A bridge passes if any of its filterable usages is active; bridges with no filterable usage always pass. */
export function matchesUsage(b: Bridge, usages: ReadonlySet<Usage>): boolean {
  const relevant = b.usage.filter((u) => FILTER_USAGES.includes(u));
  return relevant.length === 0 || relevant.some((u) => usages.has(u));
}

export function filterBridges(bridges: Bridge[], statuses: ReadonlySet<Status>, usages: ReadonlySet<Usage>): Bridge[] {
  return bridges.filter((b) => statuses.has(b.status) && matchesUsage(b, usages));
}

/** Counts unique bridges (a boundary bridge counts once). */
export function countByStatus(bridges: Bridge[]): Record<Status, number> {
  const c: Record<Status, number> = { completed: 0, under_construction: 0, planned: 0 };
  for (const b of bridges) c[b.status]++;
  return c;
}

export function countByUsage(bridges: Bridge[]): Record<Usage, number> {
  const c: Record<Usage, number> = { road: 0, rail: 0, metro: 0, pedestrian: 0 };
  for (const b of bridges) for (const u of new Set(b.usage)) c[u]++;
  return c;
}

/**
 * Groups by province. A bridge whose `province` is "A – B" is counted in both A and B.
 * Sorted north → south (tab order).
 */
export function groupByProvince(bridges: Bridge[]): ProvinceGroup[] {
  const map = new Map<string, { name: string; list: Bridge[] }>();
  for (const b of bridges) {
    for (const raw of new Set(splitProvinces(b.province))) {
      const info = findProvince(raw);
      const slug = info?.slug ?? provinceSlug(raw);
      const entry = map.get(slug);
      if (entry) {
        if (!entry.list.includes(b)) entry.list.push(b);
      } else map.set(slug, { name: info?.name ?? raw, list: [b] });
    }
  }
  return [...map.entries()]
    .map(([slug, { name, list }]) => {
      const lats = list.map((b) => b.lat);
      const lngs = list.map((b) => b.lng);
      const info = findProvince(name);
      return {
        province: name,
        slug,
        bridges: list,
        count: list.length,
        byStatus: countByStatus(list),
        lat: info?.lat ?? lats.reduce((a, c) => a + c, 0) / list.length,
        lng: info?.lng ?? lngs.reduce((a, c) => a + c, 0) / list.length,
        bounds: [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ] as [[number, number], [number, number]],
      };
    })
    .sort((a, b) => b.lat - a.lat);
}

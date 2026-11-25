import { FILTER_USAGES, type Bridge, type Status, type Usage } from '../types';
import { slugify } from './url';

export interface ProvinceGroup {
  province: string;
  slug: string;
  bridges: Bridge[];
  count: number;
  byStatus: Record<Status, number>;
  /** centroid (mean lat/lng) of the province's bridges */
  lat: number;
  lng: number;
  /** [[south, west], [north, east]] */
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

export function countByUsage(bridges: Bridge[]): Record<Usage, number> {
  const c: Record<Usage, number> = { road: 0, rail: 0, metro: 0, pedestrian: 0 };
  for (const b of bridges) for (const u of new Set(b.usage)) c[u]++;
  return c;
}

export function countByStatus(bridges: Bridge[]): Record<Status, number> {
  const c: Record<Status, number> = { completed: 0, under_construction: 0, planned: 0 };
  for (const b of bridges) c[b.status]++;
  return c;
}

/** Groups by `province`, sorted north → south (tab order). */
export function groupByProvince(bridges: Bridge[]): ProvinceGroup[] {
  const map = new Map<string, Bridge[]>();
  for (const b of bridges) {
    const key = b.province.trim();
    const list = map.get(key);
    if (list) list.push(b);
    else map.set(key, [b]);
  }
  return [...map.entries()]
    .map(([province, list]) => {
      const lats = list.map((b) => b.lat);
      const lngs = list.map((b) => b.lng);
      return {
        province,
        slug: slugify(province),
        bridges: list,
        count: list.length,
        byStatus: countByStatus(list),
        lat: lats.reduce((a, c) => a + c, 0) / list.length,
        lng: lngs.reduce((a, c) => a + c, 0) / list.length,
        bounds: [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ] as [[number, number], [number, number]],
      };
    })
    .sort((a, b) => b.lat - a.lat);
}

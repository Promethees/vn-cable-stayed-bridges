import type { Bridge, Status } from '../types';

export interface ProvinceGroup {
  province: string;
  bridges: Bridge[];
  count: number;
  /** centroid (mean lat/lng) of the province's bridges */
  lat: number;
  lng: number;
  /** [[south, west], [north, east]] */
  bounds: [[number, number], [number, number]];
}

export function filterByStatus(bridges: Bridge[], statuses: ReadonlySet<Status>): Bridge[] {
  return bridges.filter((b) => statuses.has(b.status));
}

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
        bridges: list,
        count: list.length,
        lat: lats.reduce((a, c) => a + c, 0) / list.length,
        lng: lngs.reduce((a, c) => a + c, 0) / list.length,
        bounds: [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ] as [[number, number], [number, number]],
      };
    })
    .sort((a, b) => a.province.localeCompare(b.province, 'vi'));
}

import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import type { L10n } from './i18n';

/** Initial view (design.md §4.1): mainland + Hoàng Sa + Trường Sa. */
export const VIETNAM_BOUNDS: LatLngBoundsExpression = [
  [8.2, 102.1],
  [23.4, 116.6],
];
export const VIETNAM_MAX_BOUNDS: LatLngBoundsExpression = [
  [5.0, 99.5],
  [24.8, 119.0],
];
export const MAX_ZOOM = 18;
/** Below this zoom (and no province selected) the map shows province dots. */
export const BRIDGE_ZOOM_THRESHOLD = 8;
export const PROVINCE_MAX_ZOOM = 12;
export const BRIDGE_FOCUS_ZOOM = 13;
export const DEEP_LINK_ZOOM = 14;
export const PROVINCE_LABEL_ZOOM = 6.5;
export const BRIDGE_LABEL_ZOOM = 12;
export const ISLAND_LABEL_MAX_ZOOM = 9;
/** Max zoom while the map centre is over an archipelago (plates only cover tile labels up to here). */
export const ARCHIPELAGO_MAX_ZOOM = 9;

export interface MapLabel {
  id: string;
  position: LatLngTuple;
  line1: L10n;
  line2?: L10n;
  plate: boolean;
  /** only shown at or above this zoom */
  minZoom?: number;
  /** compact one-line plate (sub-groups / islands) */
  small?: boolean;
}

// Anchors nudged (visual check on OSM standard, zoom 5–9) to sit on top of the tile's own archipelago labels:
// the Hoàng Sa district label is drawn at Phú Lâm island (~16.83, 112.34), a second city label appears
// at ~16.32, 111.98 from zoom ~7.5; the Trường Sa district label sits at Chữ Thập reef (~9.55, 112.89).
export const MAP_LABELS: MapLabel[] = [
  {
    id: 'hoang-sa',
    position: [16.85, 112.33],
    line1: { vi: 'Quần đảo Hoàng Sa', en: 'Hoang Sa Archipelago' },
    line2: { vi: '(Việt Nam)', en: '(Viet Nam)' },
    plate: true,
  },
  {
    id: 'hoang-sa-2',
    position: [16.31, 111.98],
    line1: { vi: 'Hoàng Sa', en: 'Hoang Sa' },
    line2: { vi: '(Việt Nam)', en: '(Viet Nam)' },
    plate: true,
    minZoom: 7.5,
  },
  {
    id: 'truong-sa',
    position: [9.52, 112.9],
    line1: { vi: 'Quần đảo Trường Sa', en: 'Truong Sa Archipelago' },
    line2: { vi: '(Việt Nam)', en: '(Viet Nam)' },
    plate: true,
  },
  // Zoom >= 8.75: sub-group / island plates. The first four sit on the raster tile's own feature labels
  // (OSM standard, measured at z9); the rest name the main Vietnamese-held islands of Trường Sa.
  ...(
    [
      ['an-vinh', [16.98, 112.27], 'Nhóm An Vĩnh', 'Amphitrite Group (An Vĩnh)'],
      ['luoi-liem', [16.46, 111.74], 'Nhóm Lưỡi Liềm', 'Crescent Group (Lưỡi Liềm)'],
      ['xu-bi', [10.91, 114.07], 'Đá Xu Bi', 'Xu Bi Reef'],
      ['thi-tu', [11.055, 114.28], 'Đảo Thị Tứ', 'Thi Tu Island'],
      ['song-tu-tay', [11.43, 114.33], 'Đảo Song Tử Tây', 'Song Tu Tay Island'],
      ['nam-yet', [10.18, 114.36], 'Đảo Nam Yết', 'Nam Yet Island'],
      ['sinh-ton', [9.88, 114.33], 'Đảo Sinh Tồn', 'Sinh Ton Island'],
      ['dao-truong-sa', [8.645, 111.92], 'Đảo Trường Sa', 'Truong Sa Island'],
    ] as [string, LatLngTuple, string, string][]
  ).map(
    ([id, position, vi, en]): MapLabel => ({ id, position, line1: { vi, en }, plate: true, small: true, minZoom: 8.75 }),
  ),
  { id: 'bien-dong', position: [13.2, 112.8], line1: { vi: 'Biển Đông', en: 'East Sea (Biển Đông)' }, plate: false },
];

/** Approximate extents; drawn as dotted ellipses. */
export const ARCHIPELAGO_BOUNDS: [[number, number], [number, number]][] = [
  [
    [15.7, 111.1],
    [17.2, 112.9],
  ],
  [
    [7.5, 111.5],
    [11.6, 116.0],
  ],
];

export function ellipse([[s, w], [n, e]]: [[number, number], [number, number]], steps = 48): LatLngTuple[] {
  const cy = (s + n) / 2,
    cx = (w + e) / 2,
    ry = (n - s) / 2,
    rx = (e - w) / 2;
  return Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    return [cy + ry * Math.sin(t), cx + rx * Math.cos(t)] as LatLngTuple;
  });
}

export const googleMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
export const osmUrl = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

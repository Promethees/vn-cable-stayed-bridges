import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';

/** Initial view: mainland Vietnam plus Hoàng Sa and Trường Sa. */
export const VIETNAM_BOUNDS: LatLngBoundsExpression = [
  [7.8, 102.1],
  [23.5, 114.6],
];

/** Panning limit (generous padding around mainland + both archipelagos). */
export const VIETNAM_MAX_BOUNDS: LatLngBoundsExpression = [
  [4.5, 98.5],
  [25.5, 119.5],
];

export const MIN_ZOOM = 5;
export const MAX_ZOOM = 18;
/** At or above this zoom, individual bridge markers replace province dots. */
export const BRIDGE_ZOOM_THRESHOLD = 9;
export const BRIDGE_FOCUS_ZOOM = 13;

export const ISLAND_LABELS: { text: string; position: LatLngTuple }[] = [
  { text: 'Quần đảo Hoàng Sa (Việt Nam)', position: [16.5, 112.0] },
  { text: 'Quần đảo Trường Sa (Việt Nam)', position: [9.8, 114.0] },
];

export const googleMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
export const osmUrl = (lat: number, lng: number) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

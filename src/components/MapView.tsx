import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import {
  LayersControl,
  MapContainer,
  GeoJSON,
  Marker,
  Pane,
  Polygon,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { Bridge, Status } from '../types';
import type { ProvinceGroup } from '../lib/grouping';
import { spreadCircles } from '../lib/spread';
import { pylonSvg } from '../lib/status';
import { fmtMeters, STATUS_LABEL, STRINGS, type Lang } from '../lib/i18n';
import {
  ARCHIPELAGO_BOUNDS,
  ARCHIPELAGO_MAX_ZOOM,
  BRIDGE_LABEL_ZOOM,
  ellipse,
  ISLAND_LABEL_MAX_ZOOM,
  MAP_LABELS,
  MAX_ZOOM,
  PROVINCE_LABEL_ZOOM,
  PROVINCE_MAX_ZOOM,
  BRIDGE_ZOOM_THRESHOLD,
  VIETNAM_BOUNDS,
  VIETNAM_MAX_BOUNDS,
} from '../lib/geo';

export type BaseLayerId = 'osm' | 'light' | 'sat';

export type FlyTarget =
  | { kind: 'country' }
  | { kind: 'province'; bounds: [[number, number], [number, number]] }
  | { kind: 'bridge'; lat: number; lng: number; zoom: number };

export interface FlyRequest {
  target: FlyTarget;
  /** map-space padding (px) covered by the panel / sheet */
  padRight: number;
  padBottom: number;
  nonce: number;
}

interface Props {
  bridges: Bridge[];
  groups: ProvinceGroup[];
  showBridges: boolean;
  selectedId: string | null;
  zoom: number;
  lang: Lang;
  baseLayer: BaseLayerId;
  dark: boolean;
  fly: FlyRequest | null;
  onZoom: (z: number) => void;
  onBaseLayer: (id: BaseLayerId) => void;
  onProvince: (g: ProvinceGroup) => void;
  onBridge: (id: string) => void;
  onMapClick: () => void;
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function MapView(p: Props) {
  const t = STRINGS[p.lang];
  const layerNames: Record<BaseLayerId, string> = { osm: t.layerOsm, light: t.layerLight, sat: t.layerSat };
  return (
    <MapContainer
      className={`map${p.baseLayer === 'sat' ? ' is-satellite' : ''}`}
      bounds={VIETNAM_BOUNDS}
      boundsOptions={{ padding: [16, 16] }}
      maxBounds={VIETNAM_MAX_BOUNDS}
      maxBoundsViscosity={1}
      maxZoom={MAX_ZOOM}
      zoomSnap={0.25}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <LayersControl position="topright" key={`${p.lang}-${p.dark}`}>
        <LayersControl.BaseLayer checked={p.baseLayer === 'osm'} name={layerNames.osm}>
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={OSM_ATTR} maxZoom={19} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked={p.baseLayer === 'light'} name={layerNames.light}>
          <TileLayer
            url={`https://{s}.basemaps.cartocdn.com/${p.dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`}
            attribution={`${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`}
            subdomains="abcd"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked={p.baseLayer === 'sat'} name={layerNames.sat}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <MapSetup
        lang={p.lang}
        zoom={p.zoom}
        onZoom={p.onZoom}
        onMapClick={p.onMapClick}
        onBaseLayer={(name) => {
          const id = (Object.keys(layerNames) as BaseLayerId[]).find((k) => layerNames[k] === name);
          if (id) p.onBaseLayer(id);
        }}
      />
      <FlyController fly={p.fly} />
      <NeighborMask />
      <ArchipelagoZoomCap />

      {p.zoom <= ISLAND_LABEL_MAX_ZOOM && <SovereigntyLabels lang={p.lang} zoom={p.zoom} />}

      {p.showBridges ? (
        <BridgeMarkers bridges={p.bridges} selectedId={p.selectedId} zoom={p.zoom} lang={p.lang} onBridge={p.onBridge} />
      ) : (
        <ProvinceDots groups={p.groups} lang={p.lang} zoom={p.zoom} onProvince={p.onProvince} />
      )}
    </MapContainer>
  );
}

/** Zoom tracking, min-zoom lock, a11y label, label-visibility classes, base-layer and click events. */
function MapSetup({
  lang,
  zoom,
  onZoom,
  onMapClick,
  onBaseLayer,
}: {
  lang: Lang;
  zoom: number;
  onZoom: (z: number) => void;
  onMapClick: () => void;
  onBaseLayer: (name: string) => void;
}) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
    click: () => onMapClick(),
    baselayerchange: (e) => onBaseLayer(e.name),
  });
  useEffect(() => {
    // dev-only test hook for headless screenshots (stripped from production builds)
    if (import.meta.env.DEV) (window as unknown as { __map: L.Map }).__map = map;
    map.setMinZoom(map.getZoom());
    onZoom(map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  useEffect(() => {
    map.getContainer().setAttribute('aria-label', STRINGS[lang].mapLabel);
  }, [map, lang]);
  useEffect(() => {
    map.getContainer().classList.toggle('show-province-labels', zoom >= PROVINCE_LABEL_ZOOM);
  }, [map, zoom]);
  return null;
}

function FlyController({ fly }: { fly: FlyRequest | null }) {
  const map = useMap();
  useEffect(() => {
    if (!fly) return;
    const animate = !reducedMotion();
    const { target, padRight, padBottom } = fly;
    if (target.kind === 'country') {
      if (animate) map.flyToBounds(VIETNAM_BOUNDS, { duration: 0.8, padding: [16, 16] });
      else map.fitBounds(VIETNAM_BOUNDS, { padding: [16, 16], animate: false });
      return;
    }
    let center: L.LatLng;
    let zoom: number;
    if (target.kind === 'province') {
      const b = L.latLngBounds(target.bounds);
      const fit = map.getBoundsZoom(b, false, L.point(128 + padRight, 128 + padBottom));
      zoom = Math.min(Math.max(fit, BRIDGE_ZOOM_THRESHOLD), PROVINCE_MAX_ZOOM);
      center = b.getCenter();
    } else {
      zoom = target.zoom;
      center = L.latLng(target.lat, target.lng);
    }
    // shift so the target sits in the centre of the area not covered by panel/sheet
    const pt = map.project(center, zoom).add([padRight / 2, padBottom / 2]);
    const dest = map.unproject(pt, zoom);
    if (animate) map.flyTo(dest, zoom, { duration: 0.8 });
    else map.setView(dest, zoom, { animate: false });
  }, [map, fly]);
  return null;
}

/** Dims the land of every foreign country (Natural Earth admin-0, see scripts/build_neighbors.sh). */
function NeighborMask() {
  const [data, setData] = useState<FeatureCollection | null>(null);
  useEffect(() => {
    let alive = true;
    import('../assets/neighbors.geo.json')
      .then((m) => alive && setData(m.default as unknown as FeatureCollection))
      .catch((e) => console.warn('[map] neighbour mask failed to load', e));
    return () => {
      alive = false;
    };
  }, []);
  if (!data) return null;
  return (
    <Pane name="neighborMask" style={{ zIndex: 250, pointerEvents: 'none' }}>
      <GeoJSON data={data} pane="neighborMask" interactive={false} style={{ stroke: false, fillOpacity: 1 }} />
    </Pane>
  );
}

/** Limits zoom over the archipelagos so raster tile labels there stay covered by our plates. */
function ArchipelagoZoomCap() {
  const map = useMap();
  useEffect(() => {
    const boxes = ARCHIPELAGO_BOUNDS.map((b) => L.latLngBounds(b).pad(0.15));
    const update = () => {
      const inside = boxes.some((b) => b.contains(map.getCenter()));
      map.setMaxZoom(inside ? ARCHIPELAGO_MAX_ZOOM : MAX_ZOOM);
    };
    update();
    map.on('moveend', update);
    return () => {
      map.off('moveend', update);
    };
  }, [map]);
  return null;
}

function SovereigntyLabels({ lang, zoom }: { lang: Lang; zoom: number }) {
  const icons = useMemo(
    () =>
      MAP_LABELS.map((l) =>
        L.divIcon({
          className: l.plate ? `map-plate${l.small ? ' is-small' : ''}` : 'map-sea-label',
          html: `<span><span class="plate-l1">${esc(l.line1[lang])}</span>${
            l.line2 ? `<span class="plate-l2">${esc(l.line2[lang])}</span>` : ''
          }</span>`,
          iconSize: [0, 0],
        }),
      ),
    [lang],
  );
  return (
    <Pane name="vnLabels" style={{ zIndex: 450, pointerEvents: 'none' }}>
      {ARCHIPELAGO_BOUNDS.map((b, i) => (
        <Polygon
          key={i}
          positions={ellipse(b)}
          pane="vnLabels"
          interactive={false}
          className="archipelago-ring"
          pathOptions={{ fill: false, weight: 1, dashArray: '2 4' }}
        />
      ))}
      {MAP_LABELS.map((l, i) =>
        l.minZoom !== undefined && zoom < l.minZoom ? null : (
        <Marker key={l.id} position={l.position} icon={icons[i]} pane="vnLabels" interactive={false} keyboard={false} />
        ),
      )}
    </Pane>
  );
}

/** Marker with role=button, aria-label, Enter/Space activation, tooltip on focus. */
function A11yMarker({
  position,
  icon,
  label,
  dataId,
  zIndexOffset,
  onActivate,
  children,
}: {
  position: [number, number];
  icon: L.DivIcon;
  label: string;
  dataId?: string;
  zIndexOffset?: number;
  onActivate: () => void;
  children?: ReactNode;
}) {
  const ref = useRef<L.Marker>(null);
  const act = useRef(onActivate);
  useEffect(() => {
    act.current = onActivate;
  });
  useEffect(() => {
    const m = ref.current;
    const el = m?.getElement();
    if (!m || !el) return;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', label);
    el.tabIndex = 0;
    if (dataId) el.dataset.markerId = dataId;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        act.current();
      }
    };
    const onFocus = () => m.openTooltip();
    const onBlur = () => {
      if (!m.getTooltip()?.options.permanent) m.closeTooltip();
    };
    el.addEventListener('keydown', onKey);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
    return () => {
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  });
  return (
    <Marker
      ref={ref}
      position={position}
      icon={icon}
      zIndexOffset={zIndexOffset}
      eventHandlers={{ click: () => act.current() }}
    >
      {children}
    </Marker>
  );
}

const iconCache = new Map<string, L.DivIcon>();
function cached(key: string, make: () => L.DivIcon) {
  let i = iconCache.get(key);
  if (!i) iconCache.set(key, (i = make()));
  return i;
}

const RING_ORDER: Status[] = ['completed', 'under_construction', 'planned'];
const RING_VAR: Record<Status, string> = {
  completed: 'var(--status-completed)',
  under_construction: 'var(--status-construction)',
  planned: 'var(--status-planned)',
};

function ringGradient(by: Record<Status, number>, total: number): string {
  const present = RING_ORDER.filter((s) => by[s] > 0);
  if (present.length === 1) return RING_VAR[present[0]];
  const GAP = 4; // degrees ≈ 1px on a 40px ring
  let a = 0;
  const stops: string[] = [];
  for (const s of present) {
    const b = a + (by[s] / total) * 360;
    stops.push(`${RING_VAR[s]} ${a}deg ${b - GAP}deg`, `var(--c-raised) ${b - GAP}deg ${b}deg`);
    a = b;
  }
  return `conic-gradient(${stops.join(', ')})`;
}

const dotDiameter = (count: number) => Math.round(Math.min(48, Math.max(32, 28 + 6 * Math.sqrt(count))));

function provinceIcon(g: ProvinceGroup, dx: number, dy: number) {
  const d = dotDiameter(g.count);
  const hit = Math.max(44, d);
  const ring = ringGradient(g.byStatus, g.count);
  const c = hit / 2;
  // leader line from the displaced dot back to the province anchor
  const leader =
    Math.hypot(dx, dy) > d / 2 + 4
      ? `<svg class="province-leader" width="${hit}" height="${hit}" aria-hidden="true"><line x1="${c}" y1="${c}" x2="${c - dx}" y2="${c - dy}"/><circle cx="${c - dx}" cy="${c - dy}" r="2.5"/></svg>`
      : '';
  return cached(`p|${g.province}|${g.count}|${ring}|${dx}|${dy}`, () =>
    L.divIcon({
      className: 'province-hit',
      iconSize: [hit, hit],
      iconAnchor: [c - dx, c - dy],
      html: `${leader}<span class="province-dot" style="width:${d}px;height:${d}px;background:${ring}"><span class="province-num">${g.count}</span></span><span class="province-name">${esc(g.province)}</span>`,
    }),
  );
}

function ProvinceDots({
  groups,
  lang,
  zoom,
  onProvince,
}: {
  groups: ProvinceGroup[];
  lang: Lang;
  zoom: number;
  onProvince: (g: ProvinceGroup) => void;
}) {
  const t = STRINGS[lang];
  const map = useMap();
  const offsets = useMemo(() => {
    const z = map.getZoom();
    const circles = groups.map((g) => {
      const p = map.project([g.lat, g.lng], z);
      return { x: p.x, y: p.y, r: Math.max(44, dotDiameter(g.count)) / 2 };
    });
    return spreadCircles(circles, 2).map(({ dx, dy }) => ({ dx: Math.round(dx), dy: Math.round(dy) }));
    // zoom is the trigger: offsets are recomputed at each zoom level
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, map, zoom]);
  return (
    <>
      {groups.map((g, i) => (
        <A11yMarker
          key={g.slug}
          position={[g.lat, g.lng]}
          icon={provinceIcon(g, offsets[i].dx, offsets[i].dy)}
          label={t.provinceAria(g.province, g.count, g.byStatus.completed, g.byStatus.under_construction, g.byStatus.planned)}
          dataId={`province:${g.slug}`}
          onActivate={() => onProvince(g)}
        >
          <Tooltip direction="top" offset={[offsets[i].dx, offsets[i].dy - 18]}>
            {t.provinceTooltip(g.count)}
          </Tooltip>
        </A11yMarker>
      ))}
    </>
  );
}

function bridgeIcon(status: Status, selected: boolean) {
  return cached(`b|${status}|${selected}`, () =>
    L.divIcon({
      className: 'bridge-hit',
      iconSize: [44, 44],
      html: `<span class="bridge-marker status-${status}${selected ? ' is-selected' : ''}">${pylonSvg(status)}</span>`,
    }),
  );
}

function BridgeMarkers({
  bridges,
  selectedId,
  zoom,
  lang,
  onBridge,
}: {
  bridges: Bridge[];
  selectedId: string | null;
  zoom: number;
  lang: Lang;
  onBridge: (id: string) => void;
}) {
  const t = STRINGS[lang];
  const sorted = useMemo(() => [...bridges].sort((a, b) => b.lat - a.lat), [bridges]);
  return (
    <>
      {sorted.map((b) => {
        const sel = b.id === selectedId;
        const permanent = sel || zoom >= BRIDGE_LABEL_ZOOM;
        const span = fmtMeters(b.main_span_m, lang);
        return (
          <A11yMarker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={bridgeIcon(b.status, sel)}
            label={t.bridgeAria(b.name_vi, STATUS_LABEL[b.status][lang], span)}
            dataId={`bridge:${b.id}`}
            zIndexOffset={sel ? 1000 : 0}
            onActivate={() => onBridge(b.id)}
          >
            <Tooltip
              key={permanent ? 'perm' : 'hover'}
              permanent={permanent}
              direction="right"
              offset={[sel ? 20 : 15, 0]}
              className={`bridge-label${sel ? ' is-selected' : ''}`}
            >
              {permanent && !sel ? b.name_vi : `${b.name_vi}, ${span}`}
            </Tooltip>
          </A11yMarker>
        );
      })}
    </>
  );
}

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { LayersControl, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { Bridge } from '../types';
import type { ProvinceGroup } from '../lib/grouping';
import { STATUS_ICON_SVG, STATUS_LABEL } from '../lib/status';
import {
  BRIDGE_FOCUS_ZOOM,
  BRIDGE_ZOOM_THRESHOLD,
  ISLAND_LABELS,
  MAX_ZOOM,
  MIN_ZOOM,
  VIETNAM_BOUNDS,
  VIETNAM_MAX_BOUNDS,
} from '../lib/geo';

interface Props {
  bridges: Bridge[];
  groups: ProvinceGroup[];
  zoom: number;
  onZoom: (z: number) => void;
  selected: Bridge | null;
  onSelect: (id: string) => void;
  onReset: () => void;
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export function MapView({ bridges, groups, zoom, onZoom, selected, onSelect, onReset }: Props) {
  const showBridges = zoom >= BRIDGE_ZOOM_THRESHOLD;
  return (
    <MapContainer
      className="map"
      bounds={VIETNAM_BOUNDS}
      maxBounds={VIETNAM_MAX_BOUNDS}
      maxBoundsViscosity={1}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      zoomSnap={0.5}
      worldCopyJump={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={OSM_ATTR} maxZoom={19} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="CARTO Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution={`${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`}
            subdomains="abcd"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri World Imagery">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <IslandLabels />
      <ZoomWatcher onZoom={onZoom} />
      <ResetControl onReset={onReset} />
      <FocusController selected={selected} />

      {showBridges ? (
        <BridgeMarkers bridges={bridges} selectedId={selected?.id ?? null} onSelect={onSelect} />
      ) : (
        <ProvinceMarkers groups={groups} />
      )}
    </MapContainer>
  );
}

function IslandLabels() {
  const icons = useMemo(
    () =>
      ISLAND_LABELS.map((l) =>
        L.divIcon({ className: 'island-label', html: `<span>${l.text}</span>`, iconSize: [0, 0] }),
      ),
    [],
  );
  return (
    <>
      {ISLAND_LABELS.map((l, i) => (
        <Marker key={l.text} position={l.position} icon={icons[i]} interactive={false} keyboard={false} />
      ))}
    </>
  );
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

function ResetControl({ onReset }: { onReset: () => void }) {
  const map = useMap();
  const cb = useRef(onReset);
  useEffect(() => {
    cb.current = onReset;
  }, [onReset]);
  useEffect(() => {
    const control = new L.Control({ position: 'topleft' });
    control.onAdd = () => {
      const wrap = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const btn = L.DomUtil.create('button', 'reset-button', wrap);
      btn.type = 'button';
      btn.title = 'Xem toàn Việt Nam';
      btn.setAttribute('aria-label', 'Xem toàn Việt Nam');
      btn.innerHTML =
        '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 7l6-5 6 5M4 6v8h8V6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
      L.DomEvent.disableClickPropagation(wrap);
      L.DomEvent.on(btn, 'click', () => {
        cb.current();
        map.flyToBounds(VIETNAM_BOUNDS, { duration: 0.8 });
      });
      return wrap;
    };
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);
  return null;
}

/** Flies to the selected bridge (deep link: close zoom; later clicks: keep zoom if already close). */
function FocusController({ selected }: { selected: Bridge | null }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (!selected) return;
    const zoom = first.current ? BRIDGE_FOCUS_ZOOM : Math.max(map.getZoom(), BRIDGE_ZOOM_THRESHOLD + 2);
    first.current = false;
    map.flyTo([selected.lat, selected.lng], zoom, { duration: 0.8 });
  }, [map, selected]);
  return null;
}

function ProvinceMarkers({ groups }: { groups: ProvinceGroup[] }) {
  const map = useMap();
  return (
    <>
      {groups.map((g) => {
        const size = Math.min(48, 26 + g.count * 3);
        const label = `${g.province}: ${g.count} cầu. Nhấn để phóng to.`;
        const icon = L.divIcon({
          className: 'province-marker',
          html: `<span>${g.count}</span>`,
          iconSize: [size, size],
        });
        return (
          <Marker
            key={g.province}
            position={[g.lat, g.lng]}
            icon={icon}
            title={label}
            alt={label}
            eventHandlers={{
              add: (e) => e.target.getElement()?.setAttribute('aria-label', label),
              click: () => {
                const bounds = L.latLngBounds(g.bounds);
                const fit = map.getBoundsZoom(bounds.pad(0.3));
                const z = Math.min(Math.max(fit, BRIDGE_ZOOM_THRESHOLD), BRIDGE_FOCUS_ZOOM);
                map.flyTo(bounds.getCenter(), z, { duration: 0.8 });
              },
            }}
          />
        );
      })}
    </>
  );
}

function BridgeMarkers({
  bridges,
  selectedId,
  onSelect,
}: {
  bridges: Bridge[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {bridges.map((b) => {
        const isSel = b.id === selectedId;
        const label = `${b.name_vi} – ${STATUS_LABEL[b.status].vi}, nhịp chính ${b.main_span_m} m`;
        const icon = L.divIcon({
          className: `bridge-marker${isSel ? ' is-selected' : ''}`,
          html: `<span class="bridge-marker-inner" data-status="${b.status}">${STATUS_ICON_SVG[b.status]}</span>`,
          iconSize: isSel ? [36, 36] : [28, 28],
        });
        return (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={icon}
            title={b.name_vi}
            zIndexOffset={isSel ? 1000 : 0}
            eventHandlers={{
              add: (e) => {
                const el = e.target.getElement() as HTMLElement | undefined;
                el?.setAttribute('aria-label', label);
                el?.setAttribute('data-bridge-id', b.id);
              },
              click: () => onSelect(b.id),
            }}
          />
        );
      })}
    </>
  );
}

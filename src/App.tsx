import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STATUSES, type Status } from './types';
import { bridges as allBridges, isSampleData } from './lib/data';
import { filterByStatus, groupByProvince } from './lib/grouping';
import { MapView } from './components/MapView';
import { DetailCard } from './components/DetailCard';
import { Legend } from './components/Legend';

const readBridgeParam = () => new URLSearchParams(window.location.search).get('bridge');

function writeBridgeParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('bridge', id);
  else url.searchParams.delete('bridge');
  window.history.replaceState(null, '', url);
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const id = readBridgeParam();
    return id && allBridges.some((b) => b.id === id) ? id : null;
  });
  const [active, setActive] = useState<ReadonlySet<Status>>(() => new Set(STATUSES));
  const [zoom, setZoom] = useState(6);
  const returnFocus = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => filterByStatus(allBridges, active), [active]);
  const groups = useMemo(() => groupByProvince(filtered), [filtered]);
  const counts = useMemo(() => {
    const c = { completed: 0, under_construction: 0, planned: 0 } as Record<Status, number>;
    for (const b of allBridges) c[b.status]++;
    return c;
  }, []);
  const selected = allBridges.find((b) => b.id === selectedId) ?? null;

  const select = useCallback((id: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setSelectedId(id);
    writeBridgeParam(id);
  }, []);

  const close = useCallback(() => {
    setSelectedId(null);
    writeBridgeParam(null);
    const el = returnFocus.current;
    returnFocus.current = null;
    if (el && document.contains(el)) el.focus();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, close]);

  const toggle = (s: Status) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  return (
    <div className={`app${selected ? ' has-card' : ''}`}>
      <header className="app-header">
        <h1>Cầu dây văng Việt Nam</h1>
        <p className="muted">Nhịp chính &gt; 150 m · {allBridges.length} cầu</p>
      </header>
      <main className="map-wrap">
        <MapView
          bridges={filtered}
          groups={groups}
          zoom={zoom}
          onZoom={setZoom}
          selected={selected}
          onSelect={select}
          onReset={close}
        />
        <Legend active={active} counts={counts} onToggle={toggle} isSample={isSampleData} />
      </main>
      {selected && <DetailCard bridge={selected} onClose={close} />}
    </div>
  );
}

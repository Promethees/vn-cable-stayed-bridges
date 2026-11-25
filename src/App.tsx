import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FILTER_USAGES, STATUSES, type Bridge, type Status, type Usage } from './types';
import { isSampleData, loadBridges } from './lib/data';
import { countByStatus, countByUsage, filterBridges, groupByProvince, type ProvinceGroup } from './lib/grouping';
import { readStoredLang, storeLang, STRINGS, type Lang } from './lib/i18n';
import { buildSearch, parseSearch, sameView, type View } from './lib/url';
import { resolveView, type HeroView } from './lib/hero';
import { primaryProvince, provinceSlug } from './lib/provinces';
import { BRIDGE_FOCUS_ZOOM, BRIDGE_ZOOM_THRESHOLD, DEEP_LINK_ZOOM } from './lib/geo';
import { readStored, useDarkTheme, useMediaQuery, writeStored } from './lib/hooks';
import { MapView, type BaseLayerId, type FlyRequest, type FlyTarget } from './components/MapView';
import { DetailCard } from './components/DetailCard';
import { BridgeList } from './components/BridgeList';
import { Panel, type SheetSnap } from './components/Panel';
import { Header, Legend, Toast } from './components/Chrome';

type DataState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; bridges: Bridge[] };

const PANEL_W = 400;
const primarySlug = (province: string) => provinceSlug(primaryProvince(province));
const SHEET_PX: Record<SheetSnap, () => number> = {
  peek: () => 148,
  half: () => window.innerHeight * 0.52,
  full: () => window.innerHeight - 56,
};
const LAYER_KEY = 'vncsb.baseLayer';

export default function App() {
  const [init] = useState(() => parseSearch(window.location.search));
  const [lang, setLangState] = useState<Lang>(() => init.lang ?? readStoredLang() ?? 'vi');
  const [view, setView] = useState<View>(init.view);
  const [heroPref, setHeroPref] = useState<HeroView | null>(init.hero);
  const [data, setData] = useState<DataState>({ status: 'loading' });
  const [loadNonce, setLoadNonce] = useState(0);
  const [active, setActive] = useState<ReadonlySet<Status>>(() => new Set(STATUSES));
  const [activeUsage, setActiveUsage] = useState<ReadonlySet<Usage>>(() => new Set(FILTER_USAGES));
  const [zoom, setZoom] = useState(5);
  const [listOpen, setListOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [fly, setFly] = useState<FlyRequest | null>(null);
  const [sheet, setSheet] = useState<SheetSnap>('half');
  const [baseLayer, setBaseLayer] = useState<BaseLayerId>(
    () => readStored(LAYER_KEY, ['osm', 'light', 'sat'] as const) ?? 'osm',
  );
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const dark = useDarkTheme();
  const t = STRINGS[lang];

  const bridges = useMemo(() => (data.status === 'ready' ? data.bridges : []), [data]);
  const byId = useMemo(() => new Map(bridges.map((b) => [b.id, b])), [bridges]);

  const selected = view.kind === 'bridge' ? (byId.get(view.id) ?? null) : null;

  const filtered = useMemo(() => filterBridges(bridges, active, activeUsage), [bridges, active, activeUsage]);
  const groups = useMemo(() => groupByProvince(filtered), [filtered]);
  const allGroups = useMemo(() => groupByProvince(bridges), [bridges]);
  const currentGroup = view.kind === 'province' ? allGroups.find((g) => g.slug === view.slug) : undefined;
  // breadcrumb: province view → that province; bridge view → first listed province
  const provinceName = currentGroup ? currentGroup.province : selected ? primaryProvince(selected.province) : null;
  const counts = useMemo(() => countByStatus(bridges), [bridges]);
  const usageCounts = useMemo(() => countByUsage(bridges), [bridges]);
  // the selected bridge stays visible even if filtered out
  const markerBridges = selected && !filtered.includes(selected) ? [...filtered, selected] : filtered;
  const showBridges = view.kind !== 'country' || zoom >= BRIDGE_ZOOM_THRESHOLD;

  // ---- refs for callbacks used inside Leaflet handlers ----
  const st = useRef({ view, lang, isDesktop, sheet, allGroups, byId, heroPref });
  useEffect(() => {
    st.current = { view, lang, isDesktop, sheet, allGroups, byId, heroPref };
  });

  /** URL for a view: &view= only when the kept hero view applies to that bridge. */
  const urlFor = useCallback((v: View) => {
    const { lang: l, byId: ids, heroPref: pref } = st.current;
    const b = v.kind === 'bridge' ? ids.get(v.id) : undefined;
    const hero = b && pref && resolveView(b, pref) === pref ? pref : null;
    return buildSearch(v, l, hero) || window.location.pathname;
  }, []);

  const nonce = useRef(0);
  const requestFly = useCallback((target: FlyTarget, cardOpen: boolean) => {
    const { isDesktop: desk } = st.current;
    setFly({
      target,
      padRight: cardOpen && desk ? PANEL_W : 0,
      padBottom: cardOpen && !desk ? SHEET_PX.half() : 0,
      nonce: ++nonce.current,
    });
  }, []);

  const targetFor = useCallback((v: View, bridgeZoom: number): FlyTarget | null => {
    const { allGroups: gs, byId: ids } = st.current;
    if (v.kind === 'country') return { kind: 'country' };
    if (v.kind === 'province') {
      const g = gs.find((x) => x.slug === v.slug);
      return g ? { kind: 'province', bounds: g.bounds } : null;
    }
    const b = ids.get(v.id);
    return b ? { kind: 'bridge', lat: b.lat, lng: b.lng, zoom: bridgeZoom } : null;
  }, []);

  /** Change view, push history, optionally fly the map. */
  const navigate = useCallback(
    (next: View, opts: { fly?: boolean; replace?: boolean; bridgeZoom?: number } = {}) => {
      const { view: cur } = st.current;
      if (next.kind === 'bridge') {
        const b = st.current.byId.get(next.id);
        setSheet(b && st.current.heroPref && resolveView(b, st.current.heroPref) === '3d' ? 'full' : 'half');
      }
      setView(next);
      st.current.view = next;
      const url = urlFor(next);
      if (opts.replace || sameView(cur, next)) window.history.replaceState(null, '', url);
      else window.history.pushState(null, '', url);
      if (opts.fly !== false) {
        const target = targetFor(next, opts.bridgeZoom ?? BRIDGE_FOCUS_ZOOM);
        if (target) requestFly(target, next.kind === 'bridge');
      }
    },
    [requestFly, targetFor, urlFor],
  );

  // ---- data loading ----
  useEffect(() => {
    let alive = true;
    loadBridges()
      .then((list) => {
        if (!alive) return;
        setData({ status: 'ready', bridges: list });
        const ids = new Map(list.map((b) => [b.id, b]));
        st.current.byId = ids;
        st.current.allGroups = groupByProvince(list);
        const v = st.current.view;
        if (v.kind === 'bridge' && !ids.has(v.id)) {
          setNotice(STRINGS[st.current.lang].notFound(v.id));
          navigate({ kind: 'country' }, { replace: true, fly: false });
        } else if (v.kind === 'province' && !st.current.allGroups.some((g) => g.slug === v.slug)) {
          navigate({ kind: 'country' }, { replace: true, fly: false });
        } else if (v.kind !== 'country') {
          navigate(v, { replace: true, bridgeZoom: DEEP_LINK_ZOOM });
        }
      })
      .catch((err) => {
        console.error('[bridges] load failed', err);
        if (alive) setData({ status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, [loadNonce, navigate]);

  // ---- browser back/forward ----
  useEffect(() => {
    const onPop = () => {
      const { view: v, lang: l, hero } = parseSearch(window.location.search);
      setView(v);
      setHeroPref(hero);
      st.current.heroPref = hero;
      st.current.view = v;
      if (l) setLangState(l);
      const target = targetFor(v, BRIDGE_FOCUS_ZOOM);
      if (target) requestFly(target, v.kind === 'bridge');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [requestFly, targetFor]);

  // ---- language ----
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.appTitle;
  }, [lang, t.appTitle]);
  const changeLang = (l: Lang) => {
    setLangState(l);
    storeLang(l);
    st.current.lang = l;
    window.history.replaceState(null, '', urlFor(st.current.view));
  };

  const changeBaseLayer = (id: BaseLayerId) => {
    setBaseLayer(id);
    writeStored(LAYER_KEY, id);
  };

  // ---- view transitions ----
  const focusMarker = (key: string) =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-marker-id="${CSS.escape(key)}"]`)?.focus());

  const closeCard = useCallback(() => {
    const { view: v, byId: ids } = st.current;
    if (v.kind !== 'bridge') return;
    const b = ids.get(v.id);
    navigate(b ? { kind: 'province', slug: primarySlug(b.province) } : { kind: 'country' }, { fly: false });
    focusMarker(`bridge:${v.id}`);
  }, [navigate]);

  const goCountry = useCallback(() => navigate({ kind: 'country' }), [navigate]);

  const onProvince = useCallback(
    (g: ProvinceGroup) => {
      if (g.count === 1) navigate({ kind: 'bridge', id: g.bridges[0].id }, { bridgeZoom: BRIDGE_FOCUS_ZOOM });
      else navigate({ kind: 'province', slug: g.slug });
    },
    [navigate],
  );

  const onBridge = useCallback(
    (id: string) => {
      setListOpen(false);
      navigate({ kind: 'bridge', id });
    },
    [navigate],
  );

  const prevZoom = useRef<number | null>(null);
  const onZoom = useCallback(
    (z: number) => {
      setZoom(z);
      const prev = prevZoom.current;
      prevZoom.current = z;
      // only when the user zooms out across the threshold (not the initial zoom report on load)
      if (prev !== null && prev >= BRIDGE_ZOOM_THRESHOLD && z < BRIDGE_ZOOM_THRESHOLD && st.current.view.kind === 'province')
        navigate({ kind: 'country' }, { fly: false });
    },
    [navigate],
  );

  const onMapClick = useCallback(() => {
    const { view: v, isDesktop: desk, sheet: s } = st.current;
    if (v.kind !== 'bridge') return;
    if (!desk && s !== 'peek') setSheet('peek');
    else closeCard();
  }, [closeCard]);

  // ---- Escape steps back one level ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || document.querySelector('dialog[open]')) return;
      if (listOpen) {
        setListOpen(false);
        return;
      }
      const v = st.current.view;
      if (v.kind === 'bridge') closeCard();
      else if (v.kind === 'province') {
        goCountry();
        focusMarker(`province:${v.slug}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [listOpen, closeCard, goCountry]);

  const toggleIn =
    <T,>(set: (fn: (prev: ReadonlySet<T>) => ReadonlySet<T>) => void) =>
    (v: T) =>
      set((prev) => {
        const next = new Set(prev);
        if (next.has(v)) next.delete(v);
        else next.add(v);
        return next;
      });
  const toggleStatus = toggleIn<Status>(setActive);
  const toggleUsage = toggleIn<Usage>(setActiveUsage);

  const liveMessage =
    data.status !== 'ready'
      ? ''
      : selected
        ? t.viewBridge(selected.name_vi)
        : currentGroup
          ? t.viewProvince(currentGroup.province, currentGroup.count)
          : t.viewCountry(bridges.length);

  const panelContent = listOpen ? (
    <BridgeList bridges={bridges} lang={lang} onPick={onBridge} onClose={() => setListOpen(false)} />
  ) : selected ? (
    <DetailCard
      bridge={selected}
      lang={lang}
      onClose={closeCard}
      onBackToProvince={() => navigate({ kind: 'province', slug: primarySlug(selected.province) })}
      heroPref={heroPref}
      onHeroSelect={(v) => {
        setHeroPref(v);
        st.current.heroPref = v;
        window.history.replaceState(null, '', urlFor(st.current.view));
      }}
      onEngage={(v) => setSheet((s) => (v === '3d' ? 'full' : s === 'peek' ? 'half' : s))}
    />
  ) : null;

  return (
    <div className={`app${panelContent ? ' has-panel' : ''}${isDesktop ? ' is-desktop' : ' is-phone'}`}>
      <button type="button" className="skip-link" onClick={() => setListOpen(true)}>
        {t.skipLink}
      </button>
      <Header lang={lang} province={provinceName} onLang={changeLang} onBack={view.kind !== 'country' ? goCountry : null} />
      <Legend
        active={active}
        counts={counts}
        onToggle={toggleStatus}
        activeUsage={activeUsage}
        usageCounts={usageCounts}
        onToggleUsage={toggleUsage}
        lang={lang}
        isSample={isSampleData}
      />

      <main className="map-wrap">
        <MapView
          bridges={markerBridges}
          groups={groups}
          showBridges={showBridges}
          selectedId={selected?.id ?? null}
          zoom={zoom}
          lang={lang}
          baseLayer={baseLayer}
          dark={dark}
          fly={fly}
          onZoom={onZoom}
          onBaseLayer={changeBaseLayer}
          onProvince={onProvince}
          onBridge={onBridge}
          onMapClick={onMapClick}
        />
      </main>

      <div className="toasts">
        {data.status === 'loading' && <Toast message={t.loading} busy />}
        {data.status === 'error' && (
          <Toast
            kind="error"
            message={t.loadFailed}
            action={{
              label: t.retry,
              onClick: () => {
                setData({ status: 'loading' });
                setLoadNonce((n) => n + 1);
              },
            }}
          />
        )}
        {data.status === 'ready' && filtered.length === 0 && (
          <Toast message={t.emptyFilter} action={{ label: t.showAll, onClick: () => {
                setActive(new Set(STATUSES));
                setActiveUsage(new Set(FILTER_USAGES));
              },
            }} />
        )}
        {notice && <Toast message={notice} action={{ label: t.close, onClick: () => setNotice(null) }} />}
      </div>

      {panelContent && (
        <Panel
          isDesktop={isDesktop}
          status={listOpen ? undefined : selected?.status}
          snap={sheet}
          onSnap={setSheet}
          labelledBy="panel-title"
          lang={lang}
        >
          {panelContent}
        </Panel>
      )}

      <div className="visually-hidden" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
}

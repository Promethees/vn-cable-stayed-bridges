import { lazy, Suspense, useId, useRef, type KeyboardEvent } from 'react';
import type { Bridge } from '../types';
import { availableViews, resolveView, type HeroView } from '../lib/hero';
import { loadEngine } from '../lib/engineLoader';
import { STRINGS, type Lang } from '../lib/i18n';
import { Gallery } from './Gallery';
import { SpanDiagram } from './SpanDiagram';

// The 3D view (and with it the three.js engine chunk) is only fetched when the tab is chosen.
const Model3DView = lazy(() => import('./Model3DView').then((m) => ({ default: m.Model3DView })));

interface Props {
  bridge: Bridge;
  lang: Lang;
  pref: HeroView | null;
  onSelect: (v: HeroView) => void;
  /** phone: raise the sheet when the hero is used (to full for 3D, else at least half) */
  onEngage: (view: HeroView) => void;
}

/** Hero media area with Photos / 3D / Diagram tabs (design-3d.md §1). */
export function CardHero({ bridge, lang, pref, onSelect, onEngage }: Props) {
  const t = STRINGS[lang];
  const views = availableViews(bridge);
  const active = resolveView(bridge, pref);
  const id = useId();
  const tabRefs = useRef<Partial<Record<HeroView, HTMLButtonElement | null>>>({});
  const label: Record<HeroView, string> = { photos: t.tabPhotos, '3d': t.tab3d, diagram: t.tabDiagram };

  const select = (v: HeroView) => {
    onSelect(v);
    onEngage(v);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = views.indexOf(active);
    const next = views[(i + (e.key === 'ArrowRight' ? 1 : -1) + views.length) % views.length];
    select(next);
    tabRefs.current[next]?.focus();
  };
  const prefetch = () => {
    if (window.matchMedia('(pointer: fine)').matches) {
      void import('./Model3DView');
      void loadEngine().catch(() => {});
    }
  };

  return (
    <section className="hero" aria-label={t.mediaLabel} onPointerDown={() => onEngage(active)}>
      <div className="hero-tabs" role="tablist" aria-label={t.mediaLabel} onKeyDown={onKey}>
        {views.map((v) => (
          <button
            key={v}
            ref={(el) => {
              tabRefs.current[v] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${v}`}
            aria-selected={active === v}
            aria-controls={`${id}-panel-${v}`}
            tabIndex={active === v ? 0 : -1}
            className="hero-tab"
            onClick={() => select(v)}
            onPointerEnter={v === '3d' ? prefetch : undefined}
            onFocus={v === '3d' ? prefetch : undefined}
          >
            {label[v]}
            {v === 'photos' && (
              <span className={`hero-tab-count${bridge.images.length === 0 ? ' is-zero' : ''}`}>{bridge.images.length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="hero-panel" role="tabpanel" id={`${id}-panel-${active}`} aria-labelledby={`${id}-tab-${active}`}>
        {active === 'photos' && <Gallery key={bridge.id} bridge={bridge} lang={lang} />}
        {active === 'diagram' && (
          <div className="hero-diagram">
            <SpanDiagram bridge={bridge} lang={lang} className="is-hero" />
          </div>
        )}
        {active === '3d' && (
          <Suspense
            fallback={
              <div className="m3d-viewport">
                <div className="m3d-loading">
                  <SpanDiagram bridge={bridge} lang={lang} className="is-hero is-dim" />
                  <span className="m3d-bar" aria-hidden="true" />
                  <span className="m3d-pill" role="status">
                    {t.loading3d}
                  </span>
                </div>
              </div>
            }
          >
            <Model3DView bridge={bridge} lang={lang} />
          </Suspense>
        )}
      </div>
    </section>
  );
}

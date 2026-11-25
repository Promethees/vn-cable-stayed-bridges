import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Bridge } from '../types';
import { buildBridgeGeometry } from '../lib/bridge3d';
import { describeModel } from '../lib/describe3d';
import { hasWebGL, loadEngine } from '../lib/engineLoader';
import { fmtMeters, STRINGS, type Lang } from '../lib/i18n';
import { readStored, useMediaQuery, writeStored } from '../lib/hooks';
import type { BridgeEngine } from '../three/engine';
import { SpanDiagram } from './SpanDiagram';

type Phase = 'loading' | 'ready' | 'error' | 'nowebgl' | 'lost';
const HINT_KEY = 'vncsb.m3dHintSeen';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const ICON = {
  reset: 'M3 8a5 5 0 1 0 1.5-3.5M3 2.5V5h2.5',
  dims: 'M2 11h12M2 9v4M14 9v4M5 5h6M5 3v4M11 3v4',
  rotate: 'M13 8a5 5 0 0 1-9.3 2.5M3 8a5 5 0 0 1 9.3-2.5M12.5 2.5v3h-3M3.5 13.5v-3h3',
  full: 'M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4',
  info: 'M8 7v4M8 4.6v.2M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z',
  close: 'M4 4l8 8M12 4l-8 8',
};

/** 3D tab content (design-3d.md §2–§6): lazy engine, toolbar, fallback, full screen, keyboard. */
export function Model3DView({ bridge, lang }: { bridge: Bridge; lang: Lang }) {
  const t = STRINGS[lang];
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const geometry = useMemo(
    () => (bridge.model3d ? buildBridgeGeometry(bridge.model3d, bridge.status, { navClearance: bridge.nav_clearance }) : null),
    [bridge.model3d, bridge.status, bridge.nav_clearance],
  );
  const description = geometry ? describeModel(bridge, geometry, lang) : '';
  const descId = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const fsHostRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fsButtonRef = useRef<HTMLButtonElement>(null);
  const engineRef = useRef<BridgeEngine | null>(null);
  const [phase, setPhase] = useState<Phase>(() => (hasWebGL() ? 'loading' : 'nowebgl'));
  const [engineGen, setEngineGen] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [labels, setLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [hint, setHint] = useState(() => !readStored(HINT_KEY, ['1'] as const));

  const strings = useMemo(
    () => ({
      meters: (v: number) => fmtMeters(Math.round(v), lang),
      clearance: (h?: number, w?: number) =>
        t.clearance3d(h ? fmtMeters(Math.round(h), lang) : undefined, w ? fmtMeters(Math.round(w), lang) : undefined),
      heightLabel: t.heightLabel,
      aboveDeck: t.aboveDeck,
      total: t.totalHeight,
    }),
    [lang, t],
  );

  // create the engine once (per mount / retry); full dispose on unmount
  const shouldLoad = geometry !== null && (phase === 'loading' || phase === 'ready');
  useEffect(() => {
    if (!shouldLoad || !hostRef.current) return;
    let alive = true;
    loadEngine()
      .then(({ BridgeEngine }) => {
        if (!alive || !hostRef.current) return;
        const engine = new BridgeEngine(hostRef.current, {
          strings,
          labels: true,
          fullscreen: false,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          onContextLost: () => setPhase('lost'),
        });
        engineRef.current = engine;
        setEngineGen((g) => g + 1);
        setPhase('ready');
      })
      .catch((e) => {
        console.error('[3d] engine failed to load', e);
        if (alive) setPhase('error');
      });
    return () => {
      alive = false;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
    // strings are applied separately; recreate only on retry
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, shouldLoad]);

  // rebuild the scene when the bridge (geometry) or language changes; dispose happens inside
  useEffect(() => {
    const e = engineRef.current;
    if (!e || !geometry) return;
    e.setOptions({ strings });
    e.setGeometry(geometry);
  }, [engineGen, geometry, strings]);

  useEffect(() => {
    engineRef.current?.setOptions({ labels, fullscreen });
  }, [labels, fullscreen, engineGen]);
  useEffect(() => {
    engineRef.current?.setAutoRotate(autoRotate && !reduced);
  }, [autoRotate, reduced, engineGen]);

  // theme: OS preference + data-theme attribute
  useEffect(() => {
    if (phase !== 'ready') return;
    const apply = () => engineRef.current?.applyTheme();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', apply);
      mo.disconnect();
    };
  }, [phase]);

  // first-visit hint fades after 4 s
  useEffect(() => {
    if (!hint || phase !== 'ready') return;
    const id = window.setTimeout(() => {
      setHint(false);
      writeStored(HINT_KEY, '1');
    }, 4000);
    return () => window.clearTimeout(id);
  }, [hint, phase]);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    setAnnounce(t.resetDone);
  }, [t]);
  const toggleLabels = useCallback(() => {
    setLabels((v) => {
      setAnnounce(v ? t.labelsHidden : t.labelsShown);
      return !v;
    });
  }, [t]);

  const openFullscreen = () => {
    const d = dialogRef.current;
    if (!d || !fsHostRef.current) return;
    d.showModal();
    engineRef.current?.mount(fsHostRef.current);
    setFullscreen(true);
  };
  const onDialogClose = () => {
    if (hostRef.current) engineRef.current?.mount(hostRef.current);
    setFullscreen(false);
    fsButtonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const eng = engineRef.current;
    if (!eng) return;
    const k = e.key;
    let handled = true;
    if (e.shiftKey && k.startsWith('Arrow'))
      eng.pan(k === 'ArrowLeft' ? -1 : k === 'ArrowRight' ? 1 : 0, k === 'ArrowUp' ? 1 : k === 'ArrowDown' ? -1 : 0);
    else if (k === 'ArrowLeft') eng.orbit(-15, 0);
    else if (k === 'ArrowRight') eng.orbit(15, 0);
    else if (k === 'ArrowUp') eng.orbit(0, -10);
    else if (k === 'ArrowDown') eng.orbit(0, 10);
    else if (k === '+' || k === '=') eng.zoom(1 / 1.15);
    else if (k === '-' || k === '_') eng.zoom(1.15);
    else if (k === '0' || k === 'Home') reset();
    else if (k === 'l' || k === 'L') toggleLabels();
    else if ((k === 'f' || k === 'F') && !fullscreen) openFullscreen();
    else handled = false;
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const fallback = (message: string, retry?: () => void) => (
    <div className="m3d-fallback">
      <SpanDiagram bridge={bridge} lang={lang} className="is-hero" />
      <p className="m3d-notice" role="status">
        {message}{' '}
        {retry && (
          <button type="button" className="btn btn-small" onClick={retry}>
            {t.retry}
          </button>
        )}
      </p>
      {description && <p className="m3d-desc-visible">{description}</p>}
    </div>
  );

  if (!geometry) return fallback(t.badModel);
  if (phase === 'nowebgl') return fallback(t.noWebgl);
  if (phase === 'lost')
    return fallback(t.contextLost, () => {
      setPhase('loading');
      setAttempt((a) => a + 1);
    });
  if (phase === 'error')
    return fallback(t.load3dFailed, () => {
      setPhase('loading');
      setAttempt((a) => a + 1);
    });

  const approx = bridge.model3d?.confidence === 'estimated';
  const toolbar = (
    <div className="m3d-toolbar" role="toolbar" aria-label="3D">
      <button type="button" className="m3d-tool" onClick={reset} aria-label={t.resetView} title={t.resetView}>
        <Icon d={ICON.reset} />
        <span className="m3d-tool-text">{t.resetView}</span>
      </button>
      <button type="button" className="m3d-tool" aria-pressed={labels} onClick={toggleLabels} aria-label={t.dimensions} title={t.dimensions}>
        <Icon d={ICON.dims} />
      </button>
      {!reduced && (
        <button type="button" className="m3d-tool" aria-pressed={autoRotate} onClick={() => setAutoRotate((v) => !v)} aria-label={t.autoRotate} title={t.autoRotate}>
          <Icon d={ICON.rotate} />
        </button>
      )}
      {fullscreen ? (
        <button type="button" className="m3d-tool" onClick={() => dialogRef.current?.close()} aria-label={t.close} title={t.close}>
          <Icon d={ICON.close} />
        </button>
      ) : (
        <button ref={fsButtonRef} type="button" className="m3d-tool" onClick={openFullscreen} aria-label={t.fullscreen} title={t.fullscreen}>
          <Icon d={ICON.full} />
        </button>
      )}
    </div>
  );

  const overlay = (
    <>
      {approx && (
        <div className="m3d-badge-wrap">
          <button type="button" className="m3d-badge" aria-expanded={notesOpen} onClick={() => setNotesOpen((v) => !v)}>
            <Icon d={ICON.info} /> {t.approxModel}
          </button>
          {notesOpen && bridge.model3d?.notes && <p className="m3d-notes">{bridge.model3d.notes}</p>}
        </div>
      )}
      {toolbar}
      {hint && phase === 'ready' && <p className="m3d-hint">{coarse ? t.hintTouch : t.hintMouse}</p>}
      {focused && <p className="m3d-keys">{t.keysLegend}</p>}
    </>
  );

  return (
    <div className="m3d">
      <div
        className="m3d-viewport"
        role="application"
        aria-roledescription={t.model3dRole}
        aria-label={t.model3dAria(bridge.name_vi)}
        aria-describedby={descId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.target === e.currentTarget && setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div ref={hostRef} className="m3d-host" />
        {phase === 'loading' && (
          <div className="m3d-loading">
            <SpanDiagram bridge={bridge} lang={lang} className="is-hero is-dim" />
            <span className="m3d-bar" aria-hidden="true" />
            <span className="m3d-pill" role="status">
              {t.loading3d}
            </span>
          </div>
        )}
        {!fullscreen && overlay}
      </div>
      <p className="m3d-caption">{t.modelCaption}</p>
      <p id={descId} className="visually-hidden">
        {description}
      </p>
      <div className="visually-hidden" aria-live="polite">
        {announce}
      </div>
      <dialog ref={dialogRef} className="m3d-dialog" aria-label={t.model3dAria(bridge.name_vi)} onClose={onDialogClose}>
        <div className="m3d-viewport is-fullscreen" tabIndex={0} onKeyDown={onKeyDown}>
          <div ref={fsHostRef} className="m3d-host" />
          {fullscreen && overlay}
        </div>
      </dialog>
    </div>
  );
}

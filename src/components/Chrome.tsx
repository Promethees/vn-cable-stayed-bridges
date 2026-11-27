import { FILTER_USAGES, STATUSES, type Status, type Usage } from '../types';
import { STATUS_LABEL, STRINGS, USAGE_LABEL, type Lang } from '../lib/i18n';
import { pylonSvg } from '../lib/status';
import { useState } from 'react';
import { readStored, writeStored } from '../lib/hooks';
import { Chevron, PylonGlyph, UsageIcon } from './Glyph';

const LEGEND_STORAGE_KEY = 'legend';

export function Header({
  lang,
  province,
  onLang,
  onBack,
}: {
  lang: Lang;
  province: string | null;
  onLang: (l: Lang) => void;
  onBack: (() => void) | null;
}) {
  const t = STRINGS[lang];
  return (
    <>
      <header className="app-header">
        <div className="brand">
          <PylonGlyph status="completed" size={20} />
          <div>
            <h1>{t.appTitle}</h1>
            {province && (
              <p className="breadcrumb">
                {t.country} › {province}
              </p>
            )}
          </div>
        </div>
      </header>
      <div className="lang-toggle" role="group" aria-label={t.langLabel}>
        {(['vi', 'en'] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => onLang(l)} lang={l}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      {onBack && (
        <button type="button" className="btn back-button" onClick={onBack}>
          <Chevron /> {t.backCountry}
        </button>
      )}
    </>
  );
}

export function Legend({
  active,
  counts,
  onToggle,
  activeUsage,
  usageCounts,
  onToggleUsage,
  lang,
  isSample,
}: {
  active: ReadonlySet<Status>;
  counts: Record<Status, number>;
  onToggle: (s: Status) => void;
  activeUsage: ReadonlySet<Usage>;
  usageCounts: Record<Usage, number>;
  onToggleUsage: (u: Usage) => void;
  lang: Lang;
  isSample: boolean;
}) {
  const t = STRINGS[lang];
  const [open, setOpen] = useState(() => readStored(LEGEND_STORAGE_KEY, ['open', 'closed'] as const) !== 'closed');
  const toggleOpen = () => {
    setOpen((o) => {
      writeStored(LEGEND_STORAGE_KEY, o ? 'closed' : 'open');
      return !o;
    });
  };
  const filtered = active.size < STATUSES.length || activeUsage.size < FILTER_USAGES.length;
  return (
    <section className={`legend${open ? '' : ' is-collapsed'}`} aria-labelledby="legend-title">
      <h2 id="legend-title" className="legend-heading">
        <button
          type="button"
          className="legend-toggle"
          aria-expanded={open}
          aria-controls="legend-body"
          title={open ? t.legendCollapse : t.legendExpand}
          onClick={toggleOpen}
        >
          <span className="legend-toggle-label">{t.statusTitle}</span>
          {!open && filtered && <span className="legend-filtered">{t.legendFiltered}</span>}
          <span className="legend-chevron" aria-hidden="true">
            <Chevron />
          </span>
        </button>
      </h2>
      <div id="legend-body" className="legend-body" hidden={!open}>
      <div className="legend-items" role="group" aria-labelledby="legend-title">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`legend-item status-${s}`}
            aria-pressed={active.has(s)}
            onClick={() => onToggle(s)}
          >
            <span className="legend-check" aria-hidden="true" />
            <span className="marker-sample" dangerouslySetInnerHTML={{ __html: pylonSvg(s, 14) }} />
            <span className="legend-label">{STATUS_LABEL[s][lang]}</span>
            <span className="legend-count">{counts[s]}</span>
          </button>
        ))}
      </div>
      <h2 id="usage-title" className="legend-subtitle">{t.usageTitle}</h2>
      <div className="legend-items usage-items" role="group" aria-labelledby="usage-title">
        {FILTER_USAGES.map((u) => (
          <button key={u} type="button" className="legend-item usage-item" aria-pressed={activeUsage.has(u)} onClick={() => onToggleUsage(u)}>
            <span className="legend-check" aria-hidden="true" />
            <UsageIcon usage={u} />
            <span className="legend-label">{USAGE_LABEL[u][lang]}</span>
            <span className="legend-count">{usageCounts[u]}</span>
          </button>
        ))}
      </div>
      <p className="legend-footnote">
        {t.filterFootnote}
        {isSample && <> · {t.sampleNote}</>}
      </p>
      </div>
    </section>
  );
}

export function Toast({
  kind = 'info',
  message,
  action,
  busy,
}: {
  kind?: 'info' | 'error';
  message: string;
  action?: { label: string; onClick: () => void };
  busy?: boolean;
}) {
  return (
    <div className={`toast toast-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {busy && <span className="toast-glyph" dangerouslySetInnerHTML={{ __html: pylonSvg('completed', 18) }} />}
      <span>{message}</span>
      {action && (
        <button type="button" className="btn btn-small" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

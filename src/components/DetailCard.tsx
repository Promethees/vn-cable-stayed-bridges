import { useEffect, useRef } from 'react';
import type { Bridge } from '../types';
import { visibleFields, type FieldDef } from '../lib/fields';
import { googleMapsUrl, osmUrl } from '../lib/geo';
import { fmtMeters, fmtNum, STRINGS, STRUCTURE_LABEL, type Lang } from '../lib/i18n';
import { primaryProvince } from '../lib/provinces';
import { Chevron, ExternalIcon, StatusChip, UsageTag } from './Glyph';
import { SpanDiagram } from './SpanDiagram';
import { Gallery } from './Gallery';

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

function FieldValue({ f, b, lang }: { f: FieldDef; b: Bridge; lang: Lang }) {
  const v = b[f.key];
  if (f.format === 'roadChips' && Array.isArray(v))
    return (
      <ul className="road-chips">
        {v.map((r) => (
          <li key={String(r)}>{String(r)}</li>
        ))}
      </ul>
    );
  if (f.format === 'meters' && typeof v === 'number') return <>{fmtMeters(v, lang)}</>;
  if (Array.isArray(v)) return <>{v.join(' – ')}</>;
  if (typeof v === 'number' && !f.key.endsWith('start') && f.key !== 'opened') return <>{fmtNum(v, lang)}</>;
  return <>{String(v)}</>;
}

interface Props {
  bridge: Bridge;
  lang: Lang;
  onClose: () => void;
  onBackToProvince: () => void;
}

export function DetailCard({ bridge, lang, onClose, onBackToProvince }: Props) {
  const t = STRINGS[lang];
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [bridge.id]);

  const fields = visibleFields(bridge);
  const ext = { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <article className="card">
      <div className="card-topbar">
        <button type="button" className="btn btn-ghost" onClick={onBackToProvince}>
          <Chevron /> {primaryProvince(bridge.province)}
        </button>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label={`${t.close} (Esc)`}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h2 id="panel-title" ref={headingRef} tabIndex={-1} className="card-title">
        {bridge.name_vi}
      </h2>
      {lang === 'en' && bridge.name_en && <p className="card-subtitle">{bridge.name_en}</p>}
      <p className="card-meta">
        <StatusChip status={bridge.status} lang={lang} />
        <span>{[bridge.crosses, bridge.province].filter(Boolean).join(', ')}</span>
      </p>
      <p className="card-tags">
        <span className={`tag tag-structure is-${bridge.structure_type}`}>{STRUCTURE_LABEL[bridge.structure_type][lang]}</span>
        {bridge.usage.map((u) => (
          <UsageTag key={u} usage={u} lang={lang} />
        ))}
      </p>

      <p className="headline">
        <span className="headline-figure">{fmtMeters(bridge.main_span_m, lang)}</span>
        <span className="headline-label">{t.mainSpan}</span>
      </p>

      <SpanDiagram bridge={bridge} lang={lang} />

      <div className="nav-buttons">
        <a className="btn btn-nav" href={googleMapsUrl(bridge.lat, bridge.lng)} {...ext}>
          {t.openGmaps} <ExternalIcon />
          <span className="visually-hidden">{t.newTab}</span>
        </a>
        <a className="btn btn-nav" href={osmUrl(bridge.lat, bridge.lng)} {...ext}>
          {t.openOsm} <ExternalIcon />
          <span className="visually-hidden">{t.newTab}</span>
        </a>
      </div>

      <dl className="spec">
        {fields.map((f) => {
          const label = typeof f.label === 'function' ? f.label(bridge) : f.label;
          return (
            <div key={f.key} className="spec-row">
              <dt>{label[lang]}</dt>
              <dd>
                <FieldValue f={f} b={bridge} lang={lang} />
              </dd>
            </div>
          );
        })}
      </dl>

      <Gallery key={bridge.id} images={bridge.images} name={bridge.name_vi} status={bridge.status} lang={lang} />

      {bridge.sources.length > 0 && (
        <section className="card-section">
          <h3>{t.sources}</h3>
          <ol className="sources">
            {bridge.sources.map((s) => (
              <li key={s}>
                <a href={s} {...ext} title={s}>
                  {hostOf(s)}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
      {bridge.confidence === 'needs_check' && (
        <p className="needs-check" role="note">
          <span aria-hidden="true">ⓘ</span> {t.needsCheck}
        </p>
      )}
      {bridge.notes && (
        <details className="notes">
          <summary>{t.notes}</summary>
          <p>{bridge.notes}</p>
        </details>
      )}
    </article>
  );
}

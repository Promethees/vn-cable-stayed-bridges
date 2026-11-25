import { useEffect, useRef } from 'react';
import type { Bridge } from '../types';
import { groupByProvince } from '../lib/grouping';
import { fmtMeters, STRINGS, type Lang } from '../lib/i18n';
import { StatusChip } from './Glyph';

/** Non-map alternative (skip link target): bridges grouped by province. */
export function BridgeList({
  bridges,
  lang,
  onPick,
  onClose,
}: {
  bridges: Bridge[];
  lang: Lang;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const t = STRINGS[lang];
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const groups = groupByProvince(bridges).sort((a, b) => a.province.localeCompare(b.province, 'vi'));
  return (
    <article className="card bridge-list">
      <div className="card-topbar">
        <h2 id="panel-title" ref={ref} tabIndex={-1} className="card-title">
          {t.listTitle}
        </h2>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label={`${t.close} (Esc)`}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {groups.map((g) => (
        <section key={g.slug} className="card-section">
          <h3>{g.province}</h3>
          <ul className="list-items">
            {g.bridges.map((b) => (
              <li key={b.id}>
                <button type="button" className="list-item" onClick={() => onPick(b.id)}>
                  <span className="list-name">{b.name_vi}</span>
                  <StatusChip status={b.status} lang={lang} />
                  <span className="list-span">{fmtMeters(b.main_span_m, lang)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}

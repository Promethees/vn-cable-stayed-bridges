import { useEffect, useRef } from 'react';
import type { Bridge } from '../types';
import { CARD_FIELDS } from '../lib/fields';
import { googleMapsUrl, osmUrl } from '../lib/geo';
import { StatusBadge } from './StatusBadge';
import { ImageGallery } from './ImageGallery';

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function DetailCard({ bridge, onClose }: { bridge: Bridge; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [bridge.id]);

  const rows = CARD_FIELDS.map((f) => ({ f, v: f.render(bridge) })).filter(
    ({ v }) => v !== null && v !== undefined && v !== '',
  );

  return (
    <aside className="detail-card" data-status={bridge.status} aria-labelledby="detail-title" role="dialog" aria-modal="false">
      <header className="card-header">
        <div>
          <h2 id="detail-title" ref={headingRef} tabIndex={-1}>
            {bridge.name_vi}
          </h2>
          {bridge.name_en && <p className="name-en">{bridge.name_en}</p>}
          <div className="badges">
            <StatusBadge status={bridge.status} />
            {bridge.confidence === 'needs_check' && (
              <span className="needs-check-badge" title="Một số thông tin chưa được kiểm chứng đầy đủ">
                Cần kiểm tra
              </span>
            )}
          </div>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Đóng (Esc)">
          ×
        </button>
      </header>

      <dl className="fields">
        {rows.map(({ f, v }) => (
          <div key={f.key} className="field-row">
            <dt>{f.label}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="card-actions">
        <a className="button" href={googleMapsUrl(bridge.lat, bridge.lng)} target="_blank" rel="noopener noreferrer">
          Mở trong Google Maps
        </a>
        <a className="button" href={osmUrl(bridge.lat, bridge.lng)} target="_blank" rel="noopener noreferrer">
          Mở trong OpenStreetMap
        </a>
      </div>

      <ImageGallery images={bridge.images} name={bridge.name_vi} />

      {bridge.sources.length > 0 && (
        <section className="card-section">
          <h3>Nguồn</h3>
          <ol className="sources">
            {bridge.sources.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" title={s}>
                  {hostOf(s)}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </aside>
  );
}

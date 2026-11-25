import { useEffect, useRef, useState } from 'react';
import type { Bridge, BridgeImage } from '../types';
import { STRINGS, type Lang } from '../lib/i18n';
import { pylonSvg } from '../lib/status';

const isLinkOnly = (img: BridgeImage) => img.license.trim().toLowerCase() === 'unknown';
const isPublicDomain = (l: string) => /^(cc0|public domain|pd)/i.test(l.trim());
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Licensed images first (data order), then link-only items (design-3d.md §7.1). */
const orderedImages = (images: BridgeImage[]) => [
  ...images.filter((i) => !isLinkOnly(i)),
  ...images.filter(isLinkOnly),
];

const MAX_THUMBS = 4;

function Glyph({ size = 48 }: { size?: number }) {
  return <span className="glyph" dangerouslySetInnerHTML={{ __html: pylonSvg('planned', size) }} />;
}

function CreditLine({ img, lang }: { img: BridgeImage; lang: Lang }) {
  const t = STRINGS[lang];
  if (isLinkOnly(img)) return <>{t.creditLinkOnly(img.credit || '?', hostOf(img.source || img.url))}</>;
  const lic = isPublicDomain(img.license) ? t.publicDomain : img.license;
  return (
    <>
      {t.photoBy}: {img.credit || '?'}, {lic}.{' '}
      {img.source && (
        <a href={img.source} target="_blank" rel="noopener noreferrer">
          {t.source}
        </a>
      )}
    </>
  );
}

function LinkCard({ img, lang }: { img: BridgeImage; lang: Lang }) {
  const t = STRINGS[lang];
  const host = hostOf(img.source || img.url);
  return (
    <div className="link-card">
      <Glyph />
      <p>{t.copyrightBy(img.credit || '?')}</p>
      <a className="btn btn-link-card" href={img.source || img.url} target="_blank" rel="noopener noreferrer">
        {t.viewAt(host)}
        <span className="visually-hidden"> {t.newTab}</span>
      </a>
    </div>
  );
}

/** Photos view: main viewer + thumbnail strip + credit line + lightbox. */
export function Gallery({ bridge, lang }: { bridge: Bridge; lang: Lang }) {
  const t = STRINGS[lang];
  const items = orderedImages(bridge.images);
  const [idx, setIdx] = useState(0);
  const [broken, setBroken] = useState<ReadonlySet<number>>(new Set());
  const [lightbox, setLightbox] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  if (items.length === 0)
    return (
      <div className="photo-viewport is-empty">
        <Glyph />
        <p>{t.noPhotosLong}</p>
        <a
          href={`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(bridge.name_vi)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.findCommons}
        </a>
      </div>
    );

  const cur = items[Math.min(idx, items.length - 1)];
  const go = (d: number) => setIdx((i) => (i + d + items.length) % items.length);
  // lightbox sequence skips link-only and broken items
  const viewable = items.map((img, i) => ({ img, i })).filter(({ img, i }) => !isLinkOnly(img) && !broken.has(i));
  const openLightbox = (i: number, opener: HTMLElement | null) => {
    const pos = viewable.findIndex((v) => v.i === i);
    if (pos < 0) return;
    openerRef.current = opener;
    setLightbox(pos);
  };

  const thumbs = items.slice(0, MAX_THUMBS);
  const extra = items.length - MAX_THUMBS;

  return (
    <div className="gallery2">
      <div
        className="photo-viewport"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={t.photoOf(idx + 1, items.length)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          else if (e.key === 'ArrowRight') go(1);
          else return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {isLinkOnly(cur) ? (
          <LinkCard img={cur} lang={lang} />
        ) : broken.has(idx) ? (
          <div className="photo-viewport-inner is-empty">
            <Glyph />
            <p>{t.photoBroken}</p>
          </div>
        ) : (
          <>
            <button type="button" className="photo-main" onClick={(e) => openLightbox(idx, e.currentTarget)}>
              <img
                key={cur.url}
                src={cur.url}
                alt={`${bridge.name_vi}, ${lang === 'vi' ? 'ảnh' : 'photo'} ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                onError={() => setBroken((s) => new Set(s).add(idx))}
              />
            </button>
            <button
              type="button"
              className="hero-fs"
              aria-label={t.fullscreen}
              title={t.fullscreen}
              onClick={(e) => openLightbox(idx, e.currentTarget)}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="thumb-row">
          <ul className="thumbs">
            {thumbs.map((img, i) => {
              const more = i === MAX_THUMBS - 1 && extra > 0;
              const linkOnly = isLinkOnly(img);
              return (
                <li key={img.url + i}>
                  <button
                    type="button"
                    className={`thumb${linkOnly ? ' is-link' : ''}`}
                    aria-current={i === idx ? 'true' : undefined}
                    aria-label={linkOnly ? t.thumbLinkAria(hostOf(img.source || img.url)) : t.photoOf(i + 1, items.length)}
                    onClick={(e) => (more ? openLightbox(i, e.currentTarget) : setIdx(i))}
                  >
                    {linkOnly || broken.has(i) ? (
                      <Glyph size={18} />
                    ) : (
                      <img src={img.url} alt="" loading="lazy" decoding="async" onError={() => setBroken((s) => new Set(s).add(i))} />
                    )}
                    {more && <span className="thumb-more">+{extra}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <span className="thumb-count">
            {idx + 1} / {items.length}
          </span>
        </div>
      )}
      <p className="credit">
        <CreditLine img={cur} lang={lang} />
      </p>

      {lightbox !== null && viewable.length > 0 && (
        <Lightbox
          items={viewable.map((v) => v.img)}
          start={lightbox}
          name={bridge.name_vi}
          lang={lang}
          onClose={() => {
            setLightbox(null);
            openerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

function Lightbox({
  items,
  start,
  name,
  lang,
  onClose,
}: {
  items: BridgeImage[];
  start: number;
  name: string;
  lang: Lang;
  onClose: () => void;
}) {
  const t = STRINGS[lang];
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(start);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const img = items[i];
  return (
    <dialog
      ref={ref}
      className="lightbox2"
      aria-label={name}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (dy > 80 && Math.abs(dy) > Math.abs(dx)) ref.current?.close();
        else if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <span className="lb-count">
        {i + 1} / {items.length}
      </span>
      <button type="button" className="lb-close" onClick={() => ref.current?.close()} aria-label={t.close} autoFocus>
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <img src={img.url} alt={`${name}, ${lang === 'vi' ? 'ảnh' : 'photo'} ${i + 1}`} />
      {items.length > 1 && (
        <>
          <button type="button" className="lb-nav lb-prev" onClick={() => go(-1)} aria-label={t.prev}>
            ‹
          </button>
          <button type="button" className="lb-nav lb-next" onClick={() => go(1)} aria-label={t.next}>
            ›
          </button>
        </>
      )}
      <p className="lb-credit">
        <CreditLine img={img} lang={lang} />
      </p>
    </dialog>
  );
}

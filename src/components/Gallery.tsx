import { useEffect, useRef, useState } from 'react';
import type { BridgeImage, Status } from '../types';
import { STRINGS, type Lang } from '../lib/i18n';
import { pylonSvg } from '../lib/status';

const isUnknown = (img: BridgeImage) => img.license.trim().toLowerCase() === 'unknown';

function Placeholder({ text, href }: { text: string; href?: string }) {
  const inner = (
    <>
      <span className="glyph" dangerouslySetInnerHTML={{ __html: pylonSvg('completed', 48) }} />
      <span>{text}</span>
    </>
  );
  return href ? (
    <a className="photo-placeholder" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="photo-placeholder">{inner}</div>
  );
}

function Credit({ img, lang }: { img: BridgeImage; lang: Lang }) {
  const t = STRINGS[lang];
  const text = isUnknown(img)
    ? `${t.photoBy}: ${img.credit || '?'} ${t.rightsReserved}`
    : `${t.photoBy}: ${img.credit || '?'}, ${img.license}`;
  return img.source ? (
    <a href={img.source} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  ) : (
    <>{text}</>
  );
}

export function Gallery({ images, name, lang }: { images: BridgeImage[]; name: string; status: Status; lang: Lang }) {
  const t = STRINGS[lang];
  const [failed, setFailed] = useState<ReadonlySet<number>>(new Set());
  const [open, setOpen] = useState<number | null>(null);
  const embeddable = images.map((img, i) => !isUnknown(img) && !failed.has(i));

  return (
    <section className="card-section">
      <h3>{t.photos}</h3>
      {images.length === 0 ? (
        <Placeholder text={t.noPhotos} />
      ) : (
        <ul className="gallery">
          {images.map((img, i) => (
            <li key={img.url + i}>
              {embeddable[i] ? (
                <button type="button" className="photo-button" onClick={() => setOpen(i)}>
                  <img
                    src={img.url}
                    alt={`${name}, ${lang === 'vi' ? 'ảnh' : 'photo'} ${i + 1}`}
                    loading="lazy"
                    width={240}
                    height={150}
                    onError={() => setFailed((s) => new Set(s).add(i))}
                  />
                </button>
              ) : (
                <Placeholder text={isUnknown(img) ? t.viewAtSource : t.noPhotos} href={img.source || img.url} />
              )}
              <p className="credit">
                <Credit img={img} lang={lang} />
              </p>
            </li>
          ))}
        </ul>
      )}
      {open !== null && (
        <Lightbox
          images={images.filter((_, i) => embeddable[i])}
          start={images.filter((_, i) => embeddable[i]).indexOf(images[open])}
          name={name}
          lang={lang}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}

function Lightbox({
  images,
  start,
  name,
  lang,
  onClose,
}: {
  images: BridgeImage[];
  start: number;
  name: string;
  lang: Lang;
  onClose: () => void;
}) {
  const t = STRINGS[lang];
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(Math.max(0, start));
  const touchX = useRef<number | null>(null);
  const go = (d: number) => setI((x) => (x + d + images.length) % images.length);

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    return () => d?.close();
  }, []);

  const img = images[i];
  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={name}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <img src={img.url} alt={`${name}, ${lang === 'vi' ? 'ảnh' : 'photo'} ${i + 1}`} />
      <p className="credit">
        <Credit img={img} lang={lang} />
      </p>
      <div className="lightbox-controls">
        {images.length > 1 && (
          <>
            <button type="button" className="btn" onClick={() => go(-1)}>
              {t.prev}
            </button>
            <button type="button" className="btn" onClick={() => go(1)}>
              {t.next}
            </button>
          </>
        )}
        <button type="button" className="btn" onClick={() => ref.current?.close()} autoFocus>
          {t.close}
        </button>
      </div>
    </dialog>
  );
}
